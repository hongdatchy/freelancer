interface AdminUserInfoDTO {
  id: number;
  documentId: string;
  description: string;
  avatar: {
    url: string;
  };
  createdAt: string; // You can change to Date if you want to handle Date type
  updatedAt: string; // Same as above, change to Date if needed
  publishedAt: string;
  locale: string;
  admin_user: {
    id: number;
  };
}

export interface AdminUserDTO {
  id: number;
  documentId: string;
  firstname: string;
  lastname: string;
  username: string | null;
  email: string;
  password: string;
  resetPasswordToken: string | null;
  registrationToken: string | null;
  isActive: boolean;
  blocked: boolean;
  preferedLanguage: string | null;
  createdAt: string; // You can change to Date if you want to handle Date type
  updatedAt: string; // Same as above, change to Date if needed
  publishedAt: string;
  locale: string | null;
  addition_admin_user_info: AdminUserInfoDTO;
}
