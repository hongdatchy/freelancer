export interface CourseDTO {
  id: number;
  documentId: string;

  name: string;
  description?: string;

  thumbnail?: {
    id: number;
    documentId: string;
    url: string;
    formats?: {
      medium?: {
        url: string;
      };
      small?: {
        url: string;
      };
      large?: {
        url: string;
      };
      thumbnail?: {
        url: string;
      };
    };
  };

  lectures?: LectureDTO[];

  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  isStudentLecture?: boolean;
  ages?: string;
  level?: 'Level 0' | 'Level 1+2' | 'Starters' | 'Level 3+4' | 'Movers' | 'Level 5+6' | 'Flyers';
}

export interface LectureDTO {
  id: number;
  documentId: string;

  name: string;
  description?: string;

  content?: string;

  media_lectures?: MediaLectureDTO[];

  createdAt?: string;
  updatedAt?: string;
}

export interface MediaLectureDTO {
  id: number;
  documentId: string;

  name: string;
  type: string;

  url?: string;

  content?: Array<{
    id: number;
    url: string;
  }>;
}