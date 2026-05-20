export interface RutaLink {
  labelKey: string;
  url: string;
  external?: boolean;
}

export interface RutaSection {
  id: string;
  titleKey: string;
  contentKey: string;
  links?: RutaLink[];
}

export interface RutaMeta {
  slug: string;
  titleKey: string;
  descKey: string;
  sections: RutaSection[];
}
