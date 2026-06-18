export const getMenuItemsByTran = (): MenuItem[] => {
  return [
    {
      title: 'Trang chủ',
      href: '/',
      subItems: [],
    },
    {
      title: 'Dịch vụ tương tác',
      href: '/service',
      subItems: [],
    },
    {
      title: 'Khoá học',
      href: '/search-post',
      subItems: [],
    },
    {
      title: 'Khoá học của tôi',
      href: '/my-courses',
      subItems: [],
    },
    {
      title: 'Giới thiệu',
      href: '/about',
      subItems: [],
    },
    {
      title: 'Liên hệ',
      href: '/contact',
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
