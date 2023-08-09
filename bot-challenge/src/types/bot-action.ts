import { BotStep } from './bot-step';

export type ActionIcon = 'Cursor' | 'Database' | 'List' | 'Restart' | 'Text';
export type BotAction = {
  icon: ActionIcon;
  title: string;
  description: string;
  disabled?: boolean;
  steps: BotStep[];
};
