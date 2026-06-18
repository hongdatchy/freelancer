export interface MediaLectureDTO {
  id: number;
  documentId: string;
  name: string;
  type: 'video' | 'pdf' | 'ppt' | 'canva' | string;
  url: string | null;
  content: MediaContentDTO[] | null;
}

export interface MediaContentDTO {
  id: number;
  documentId: string;
  name: string;
  url: string;
  mime: string;
  size: number;
}

export interface MediaLectureResponseDTO {
  data: MediaLectureDTO[];
}