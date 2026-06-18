// export interface CreatePostDTO {
//   name: string;
//   email: string;
//   password: string;
// }

// export interface UpdatePostDTO {
//   name: string;
//   email: string;
//   password: string;
// }

export interface ResponsePostDTO {
  id: number;
  documentId: string;
  title: string;
  description: string;
  content: string;
  slug: string;
  trending: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  thumbnail: {
    url: string;
  };
  categories: Array<{
    name: string;
  }>;
  posts: Array<ResponsePostDTO>;
}
