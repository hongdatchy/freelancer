import { factories } from '@strapi/strapi';

interface FiltersCourse {
  name?: { $containsi: string };
  locale?: string;
  users_permissions_users?: {
    id: number;
  };
  isStudentLecture?: boolean;
}

interface Pagination {
  page?: string;
  pageSize?: string;
}

export default factories.createCoreController('api::course.course', ({ strapi }) => ({
  async searchCourses(ctx) {
    try {
      const { locale } = ctx.query;
      const defaultLocale = strapi.config.get('plugin::i18n.defaultLocale', null);

      const { name, token, isStudentLecture } = ctx.request.body;

      if (!token) {
        return ctx.unauthorized('Token is required');
      }

      let decoded: any;
      try {
        decoded = await strapi.plugins['users-permissions'].services.jwt.verify(token);
      } catch (err) {
        return ctx.unauthorized('Invalid token');
      }

      const userId = decoded.id;

      const paginationQuery = ctx.query.pagination as Pagination;

      const filters: FiltersCourse = {};

      if (name) {
        filters.name = { $containsi: name };
      }

      filters.locale = (locale as string) || defaultLocale;

      if (isStudentLecture !== undefined) {
        filters.isStudentLecture = isStudentLecture;
      }

      filters.users_permissions_users = {
        id: userId,
      };

      if (!paginationQuery?.page || !paginationQuery?.pageSize) {
        ctx.internalServerError('paginationQuery is required');
        return;
      }

      if (Number(paginationQuery.page) < 0 || Number(paginationQuery.pageSize) < 1) {
        ctx.internalServerError('paginationQuery is invalid');
        return;
      }

      const pagination = {
        start: Number(paginationQuery.page) * Number(paginationQuery.pageSize),
        limit: Number(paginationQuery.pageSize),
      };

      const courses = await strapi.documents('api::course.course').findMany({
        filters,
        populate: {
          thumbnail: true,
          lectures: true,
        },
        ...pagination,
        status: 'published',
        sort: ['createdAt:desc'],
      });

      const total = await strapi.documents('api::course.course').count({
        filters,
        status: 'published',
      });

      ctx.body = {
        data: courses,
        meta: {
          pagination: {
            page: Number(paginationQuery.page),
            pageSize: Number(paginationQuery.pageSize),
            pageCount: Math.ceil(total / Number(paginationQuery.pageSize)),
            total,
          },
        },
      };
    } catch (err) {
      console.error(err);
      ctx.internalServerError('An error occurred while searching courses');
    }
  },
}));