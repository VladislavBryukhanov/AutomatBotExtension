import { StepContentType } from '../enums/step/content-type';
import { StepType } from '../enums/step/type';

export type BotStep = {
  title: string;
  type: StepType;
  content: StepContent;
  manualMoveForwardOnly?: boolean;
  autoSkip?: boolean;
}

export type StepContent = {
  type: StepContentType;
  text?: string;
  label?: string;  
}