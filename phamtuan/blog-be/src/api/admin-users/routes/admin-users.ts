export default {
  routes: [
    {
      method: 'GET',
      path: '/admin-users',
      handler: 'admin-users.getAllAdminUsers',
    },
    {
      method: 'GET',
      path: '/admin-users/:userId',
      handler: 'admin-users.getByUserId',
    },
  ],
}
