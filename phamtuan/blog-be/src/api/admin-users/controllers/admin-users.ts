interface Pagination {
  page?: string;
  pageSize?: string;
}

const adminUsersController = {
  async getAllAdminUsers(ctx: any) {
    try {
      const { locale } = ctx.query;
      const defaultLocale = strapi.config.get('plugin::i18n.defaultLocale', 'en');
      const paginationQuery = ctx.query.pagination as Pagination;

      if (!ctx.query.pagination || !paginationQuery?.page || !paginationQuery?.pageSize) {
        ctx.internalServerError('paginationQuery is required');
        return;
      }
      if (Number(paginationQuery.page) < 1 || Number(paginationQuery.pageSize) < 1) {
        ctx.internalServerError('paginationQuery is invalid');
        return;
      }

      const pagination: any = {};
      pagination.start = (Number(paginationQuery.page) - 1) * Number(paginationQuery.pageSize);
      pagination.limit = Number(paginationQuery.pageSize);

      const adminUsers = await strapi.query('admin::user').findMany({
        ...pagination,
        filters: {
          // roles: {
          //   code: { $ne: 'strapi-super-admin' },
          // },
        },
        
      });

      const additionalInfo = await strapi.documents('api::addition-admin-user-info.addition-admin-user-info').findMany({
        populate: {
          admin_user: {
            fields: ['id']
          },
          avatar: true,
        },
        locale: (locale as string) || defaultLocale
      });

      const additionalInfoMap = additionalInfo.reduce((acc: any, info: any) => {
        acc[info.admin_user.id] = info;
        return acc;
      }, {});

      adminUsers.forEach((user: any) => {
        user.addition_admin_user_info = additionalInfoMap[user.id] || null;
      });

      const total = await strapi.documents('admin::user').count({
        filters: {
          
          // roles: {
          //   code: { $ne: 'strapi-super-admin' },
          // },
        },
      });

      ctx.body = {
        data: adminUsers,
        meta: {
          pagination: {
            page: Number(paginationQuery.page),
            pageSize: Number(paginationQuery.pageSize),
            pageCount: Math.ceil(total / Number(paginationQuery.pageSize)),
            total,
          },
        },
      };
    } catch (error) {
      strapi.log.error('Error fetching admin users:', error);
      ctx.internalServerError('An error occurred while fetching admin users');
    }
  },

  async getByUserId(ctx: any) {
    try {
      const { userId } = ctx.params;
  
      if (!userId) {
        ctx.internalServerError('userId is required');
        return;
      }
  
      const adminUser = await strapi.query('admin::user').findOne({
        where: { id: userId },
      });
  
      if (!adminUser) {
        ctx.notFound('User not found');
        return;
      }
  
      const additionalInfo = await strapi.query('api::addition-admin-user-info.addition-admin-user-info').findMany({
        where: { admin_user: { id: userId } },
        populate: { avatar: true },
      });
  
      adminUser.addition_admin_user_info = additionalInfo.length > 0 ? additionalInfo[0] : null;
  
      ctx.body = {
        data: adminUser,
      };
    } catch (error) {
      strapi.log.error('Error fetching admin user by userId:', error);
      ctx.internalServerError('An error occurred while fetching the admin user');
    }
  }
  
};

export default adminUsersController;
