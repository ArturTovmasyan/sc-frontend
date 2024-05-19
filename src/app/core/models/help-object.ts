export class HelpObject implements IdInterface {
  id: number;
  key?: number;
  isLeaf?: boolean;

  title: string;
  description: string;

  type: HelpObjectType;

  url: string;
  vimeo_url: string;
  youtube_url: string;
}

export enum HelpObjectType {
  PDF = 1,
  VIDEO = 2,
  VIMEO = 3,
  YOUTUBE = 4
}
