export interface CoverLetterRequest {
  name: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  answer5: string;
}

export interface CoverLetterDetailResponse {
  id: number;
  name: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  answer5: string;
}

export interface CoverLetterListResponse {
  id: number;
  name: string;
}
