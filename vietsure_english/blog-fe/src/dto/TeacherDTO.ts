export interface TeacherDTO {
  id: number;
  documentId: string;

  username: string;
  email: string;
  fullName: string;

  region: {
    id: number;
    documentId: string;
    name: string;
  };
  gender: string;

  provider: string;
  confirmed: boolean;
  blocked: boolean;

  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  academicScoring: string;

  avatar: {
    url: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
  };

  avatarHomePage: {
    url: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
  };

  educations: Array<{
    id: number;
    title: string;
  }>;

  experiences?: number;

  score?: Array<{
    id: number;
    type: string;
    vaule: number;
  }>;

  achievements?: Array<{
    id: number;
    title: string;
  }>;
}