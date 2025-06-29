const PATH_NAME = {
  HOME: '/',
  AUTH: '/auth',
  POST: '/post',
  POST_DETAIL: '/post/:id',
  NOT_FOUND: '*',
  MEMBER: '/member',
  ADMIN: '/admin',
  CHAT_BOT: '/member/chatbot',
  CONTACT: '/contact',
  ABOUT: '/about',
  PACKAGE_MAMANGEMENT: '/member/package',
  CHANGE_PASSWORD: '/member/change-password',
  MEMBER_INFO: '/member/info',
};

const NAV_ELEMENTS = [
  {
    name: 'TRANG CHỦ',
    path: '/',
  },
  {
    name: 'BÀI VIẾT',
    path: '#',
  },
  {
    name: 'TRỢ LÝ ẢO',
    path: PATH_NAME.CHAT_BOT,
  },
  {
    name: 'VỀ CHÚNG TÔI',
    path: '/contact',
  },
];

export { PATH_NAME, NAV_ELEMENTS };
