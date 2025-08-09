type CardType = "license" | "activity" | "project";

export interface TextCard {
  title: string;
  type: CardType;
}
export interface ProjectTextCard extends TextCard {
  projectName: string;
  comment: string;
  content: string;
  stack: Array<{ value: string; label: string }>;
  startAt: string;
  endAt: string;
  githubURL: string;
}

export interface ActivityTextCard extends TextCard {
  companyName: string;
  startAt: string;
  endAt: string;
  active: string;
}

export interface LicenseTextCard extends TextCard {
  licenseName: string;
  getAt: string;
  issuer: string;
}
