interface BaseListProps {
  id: number;
}
export interface FavoriteProjectProps extends BaseListProps {
  projectName: string;
  writer: string;
  img: string;
}

export interface FavoriteJobProps extends BaseListProps {
  companyName: string;
  title: string;
  location: string;
  createTime: string;
  expLevel: string;
}

export interface FavoriteCompanyProps extends BaseListProps {
  companyName: string;
  img: string;
}
