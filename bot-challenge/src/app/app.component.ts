import { Component, ElementRef, ViewChild } from '@angular/core';
import { botActions, initialBotSteps } from '../actions-config';
import { ActionIcon, BotAction } from '../types/bot-action';
import { environment } from '../environments/environment';
import { StepType } from '../enums/step/type';
import { ConnectorEventType } from '../enums/connector-event-type.enum';
import { ElementSelectors, ExtraMetadata } from '../types/connector-events';
import xor from 'lodash.xor';
import { BotStep } from '../types/bot-step';
import { StepContentType } from '../enums/step/content-type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('botUi', { static: true }) botUi: ElementRef;

  botActions = botActions;
  stepContentType = StepContentType;

  activeStepType = StepType.ElementSelection;
  private activeAction?: BotAction;

  private itemSelectors?: ElementSelectors;
  extraMessageMetadata: ExtraMetadata = {};

  get activeStep() {
    return this.botSteps.find(step => step.type === this.activeStepType);
  }

  private get botSteps() {
    return (this.activeAction?.steps || initialBotSteps);
  }

  isActionDisabled(action: BotAction) {
    return action.disabled || this.activeStepType !== StepType.ActionSelection;
  }

  buildIconUrl(icon: ActionIcon) {
    return `assets/${icon}.svg`;
  }

  handleAction(action: BotAction) {
    if (this.isActionDisabled(action)) return;

    this.activeAction = action;

    this.setActiveStepType(action.steps[0].type);
  }

  stepMoveForward() {
    const nextActiveStep = this.botSteps.reduce((acc: null | BotStep, step, index) => {
      if (step.type === this.activeStepType) {
        return this.botSteps[index + 1];
      }
      return acc;
    }, null);
    
    if (nextActiveStep) {
      this.setActiveStepType(nextActiveStep!.type);

      if (nextActiveStep.autoSkip) {
        this.stepMoveForward();
      }
      return;
    }

    this.setActiveStepType(StepType.ElementSelection);
    this.activeAction = undefined;
  }

  private setActiveStepType(val: StepType) {
    this.activeStepType = val;

    window.parent.postMessage({
      type: this.activeStepType,
      ...this.itemSelectors,
      ...this.extraMessageMetadata,
    }, environment.listeningAppUrl);
  }

  private predictSelection(payload: ElementSelectors) {
    if (!this.itemSelectors) {
      return this.itemSelectors = payload;
    }

    const classesDiff = xor(payload.classList, this.itemSelectors.classList);

    // TODO has minor classes diff
    // TODO has similar ids

    if (this.itemSelectors.classList.length && !classesDiff.length) {
      return this.stepMoveForward();
    }

    if (payload.tagName === this.itemSelectors.tagName) {
      return this.stepMoveForward();
    }

    this.itemSelectors = undefined;
    this.setActiveStepType(StepType.ElementSelection);
  }

  private repeatAction(payload: ElementSelectors) {
      this.itemSelectors = payload;
      this.stepMoveForward();
  }

  private handleConnectorMessage = (
    event: Event & {
      data: { type: ConnectorEventType } & ElementSelectors;
    }
  ) => {
    const {type, ...payload} = event.data;

    switch (type) {
      case ConnectorEventType.ElementSelection: {
        if (this.activeStepType === StepType.ActionElementSelection) {
          return this.repeatAction(<ElementSelectors>payload);
        }

        return this.predictSelection(<ElementSelectors>payload);
      }
    }
  }

  ngAfterViewInit() {
    window.addEventListener("message", this.handleConnectorMessage, false);
  }

  ngDestroy() {
    window.removeEventListener("message", this.handleConnectorMessage);
  }
}
