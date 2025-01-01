export type Event = {
  id: string;
  type: 'event' | 'prayer' | 'bible' | 'note' | 'task';
  title: string;
  start: Date;
  end?: Date;
  content?: string;
  completed?: boolean;
};