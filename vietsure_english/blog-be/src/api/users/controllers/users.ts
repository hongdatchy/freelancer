/**
 * user controller
 */

import { factories } from '@strapi/strapi';

interface FiltersUser {
  fullName?: { $containsi: string };
  gender?: "Male" | "Female" | "Other";
  region?: {
    name: { $containsi: string };
  };
  teacher_schedules?: {
    day?: { $eq: string };
    time_slot?: { $eq: string };
  };
}

interface Pagination {
  page?: string;
  pageSize?: string;
}

export default factories.createCoreController('plugin::users-permissions.user', ({ strapi }) => ({
  async searchUsers(ctx) {
    try {
      const { locale } = ctx.query;
      const defaultLocale = strapi.config.get('plugin::i18n.defaultLocale', null);
      const { fullName, gender, region, schedule } = ctx.request.body;
      const paginationQuery = ctx.query.pagination as Pagination;

      const filters: FiltersUser = {};
      if (fullName) {
        filters.fullName = { $containsi: fullName as string };
      }
      if (gender) {
        filters.gender = gender;
      }
      if (region) {
        filters.region = {
          name: { $containsi: region as string },
        };
      }
      if (schedule) {
        filters.teacher_schedules = {};
        if (schedule.day) {
          filters.teacher_schedules.day = { $eq: schedule.day };
        }
        if (schedule.time_slot) {
          filters.teacher_schedules.time_slot = { $eq: schedule.time_slot };
        }
      }

      if (!paginationQuery?.page || !paginationQuery?.pageSize) {
        ctx.internalServerError('paginationQuery is required');
        return;
      }
      if (Number(paginationQuery.page) < 0 || Number(paginationQuery.pageSize) < 1) {
        ctx.internalServerError('paginationQuery is invalid');
        return;
      }

      const pagination: any = {};
      pagination.start = (Number(paginationQuery.page)) * Number(paginationQuery.pageSize);
      pagination.limit = Number(paginationQuery.pageSize);

      const users = await strapi.documents('plugin::users-permissions.user').findMany({
        ...pagination,
        filters,
        populate: {
          avatar: true,
          educations: true,
          score: true,
          region: true,
          teacher_schedules: true,
        },
        locale: (locale as string) || defaultLocale
      });

      const total = await strapi.documents('plugin::users-permissions.user').count({ filters });

      ctx.body = {
        data: users,
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
      ctx.internalServerError('An error occurred while searching users');
    }
  },
}));