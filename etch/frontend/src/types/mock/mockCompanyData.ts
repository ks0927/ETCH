import Samsung from "../../assets/samsung.png";
export interface mockCompanyData {
  companyName: string;
  like: number;
  img?: string;
}
export const mockCompany: mockCompanyData[] = [
  {
    companyName: "삼성전자",
    like: 142,
    // img: Samsung,
  },
  {
    companyName: "삼성생명",
    like: 117,
    img: Samsung,
  },
  {
    companyName: "삼성SDS",
    like: 177,
    img: Samsung,
  },
  {
    companyName: "삼성물산",
    like: 123,
    img: Samsung,
  },
  {
    companyName: "삼성디스플레이",
    like: 158,
    img: Samsung,
  },
];
