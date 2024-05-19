export class StateChangeReason implements IdInterface {
  id: number;

  title: string;
  state: StateChangeReasonState;
}

export enum StateChangeReasonState {
  OPEN = 1,
  CLOSED = 2,
}
