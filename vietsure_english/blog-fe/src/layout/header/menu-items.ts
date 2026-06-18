import { User } from "@/state-manager/user-login-store";

export const getMenuItemsByTran = (user: User | null): MenuItem[] => {
  if (user) {
    return [
      {
        title: "Elearning",
        href: "/elearning/?isStudentLecture=true",
        subItems: [],
      },
      {
        title: "Trainning giáo viên",
        href: "/elearning/?isStudentLecture=false",
        subItems: [],
      },
      {
        title: "Quản lý thời khoá biểu",
        href: "/schedule-management",
        subItems: [],
      },
    ];
  }
  return [
    {
      title: "Trang Chủ",
      href: "/",
      subItems: [],
    },
    {
      title: "Giới thiệu",
      href: "/about",
      subItems: [],
    },
    {
      title: "Giáo viên",
      href: "/teachers",
      subItems: [],
    },
    {
      title: "Khóa học",
      href: "/course",
      subItems: [],
    },
    {
      title: "Reviews",
      href: "/review",
      subItems: [],
    },
    {
      title: "Liên hệ",
      href: "/contact",
      subItems: [],
    },
  ];
};

type SubMenuItem = {
  title: string;
  href: string;
  description: string;
};

export type MenuItem = {
  title: string;
  href: string;
  subItems: SubMenuItem[];
};
