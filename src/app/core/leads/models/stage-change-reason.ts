export class StageChangeReason implements IdInterface {
  id: number;

  title: string;
  state: StageChangeReasonState;
}

export enum StageChangeReasonState {
  OPEN = 1,
  CLOSED = 2,
}
