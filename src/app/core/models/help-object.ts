export class HelpObject implements IdInterface {
  id: number;
  key?: number;

  title: string;
  description: string;

  type: HelpObjectType;

  s3url: string;
}

export enum HelpObjectType {
  PDF = 1,
  VIDEO = 2
}
