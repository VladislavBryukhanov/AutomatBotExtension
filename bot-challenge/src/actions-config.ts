import { BotAction } from './types/bot-action';
import { StepType } from './enums/step/type';
import { BotStep } from './types/bot-step';
import { StepContentType } from './enums/step/content-type';

export const botActions: BotAction[] = [
  {
    title: 'Click a button',
    description: 'allows you to click on a button for ead element',
    icon: 'Cursor',
    steps: [
      {
        title: 'Step 3. Click a button',
        type: StepType.ActionElementSelection,
        content: {
          type: StepContentType.Text,
          text: 'Select an element',
        },
      },
      {
        title: 'Step 3. Run a task',
        type: StepType.ActionElementSelected,
        content: {
          type: StepContentType.Text,
          text: 'click button to run bot task',
        },
        manualMoveForwardOnly: true,
      },
      {
        title: 'Completed',
        type: StepType.ApplyClickAction,
        content: {
          type: StepContentType.Text,
          text: 'The click was applied',
        },
        autoSkip: true,
      }
    ]
  },
  {
    title: 'Input text',
    description: 'allows you to input text for each element',
    icon: 'Text',
    steps: [
      {
        title: 'Step 3. Click an input field',
        type: StepType.ActionElementSelection,
        content: {
          type: StepContentType.Text,
          text: 'Select an input element'
        },
      },
      {
        title: 'Step 3. Click an input field',
        type: StepType.ActionElementSelected,
        content: {
          type: StepContentType.Text,
          text: 'Select an input element'
        },
        autoSkip: true,
      },
      {
        title: 'Step 3. Click an input field',
        type: StepType.InputActionElementTyping,
        content: {
          type: StepContentType.Input,
          label: 'Enter some text',
        },
        manualMoveForwardOnly: true,
      },
      {
        title: 'Completed',
        type: StepType.ApplyInputAction,
        content: {
          type: StepContentType.Text,
          text: 'The input typing was proceeded'
        },
        autoSkip: true,
      }
    ]
  },
  {
    title: 'Store data',
    description: 'Amet minim mollit non deserunt ullamco est sit.',
    icon: 'Database',
    disabled: true,
    steps: [],
  },
  {
    title: 'If condition',
    description: 'Amet minim mollit non deserunt ullamco est sit.',
    icon: 'List',
    disabled: true,
    steps: [],
  },
  {
    title: 'For loop',
    description: 'Amet minim mollit non deserunt ullamco est sit.',
    icon: 'Restart',
    disabled: true,
    steps: [],
  },
];

export const initialBotSteps: BotStep[] = [
  {
    title: 'Step 1. For Loop',
    type: StepType.ElementSelection,
    content: {
      type: StepContentType.Text,
      text: 'Select an element',
    }
  },
  {
    title: 'Step 1. For loop',
    type: StepType.PredictionSelection,
    manualMoveForwardOnly: true,
    content: {
      type: StepContentType.Text,
      text: 'Great! You selected 2 elements, we predicted the other',
    },
  },
  {
    title: 'Step 2. Do an action on each element',
    type: StepType.ActionSelection,
    content: {
      type: StepContentType.Text,
      text: 'Add action you want the bot to do on the page',
    }
  },
];