export interface ResponseCategoryDTO {
  id: number;
  documentId: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  posts: Array<{id: number}>
  slug: string;
}