/**
 * post controller
 */

import { factories } from '@strapi/strapi';
interface FiltersPost {
  title?: { $containsi: string };
  categories?: any;
  locale?: string;
  users ?: {
    id: { $eq: string }
  },
  trending?: { $eq: boolean }
}

interface Pagination {
  page?: string;
  pageSize?: string;
}

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
  async searchPosts(ctx) {
    try {
      const { locale } = ctx.query;
      const defaultLocale = strapi.config.get('plugin::i18n.defaultLocale', 'en');
      const { title, category, userId, trending } = ctx.request.body;
      const paginationQuery = ctx.query.pagination as Pagination;
      const populateQuery = ctx.query.populate;

      const populateOptions = {};
      if (populateQuery) {
        const populateFields = Array.isArray(populateQuery) ? populateQuery : [populateQuery];

        populateFields.forEach((field) => {
          populateOptions[field] = true;
        });
      }
      const filters: FiltersPost = {};
      if (title) {
        filters.title = { $containsi: title as string };
      }
      if (category) {
        filters.categories = category;
      }
      if (userId) {
        filters.users = {
          id: { $eq: userId }
        };
      }
      if (trending !== undefined) {
        filters.trending = { $eq: trending as boolean };
      }

      filters.locale = (locale as string) || defaultLocale;
      const pagination: any = {};

      if (!ctx.query.pagination || !paginationQuery?.page || !paginationQuery?.pageSize) {
        ctx.internalServerError('paginationQuery is required');
        return;
      }
      if (Number(paginationQuery.page) < 1 || Number(paginationQuery.pageSize) < 1) {
        ctx.internalServerError('paginationQuery is invalid');
        return;
      }
      pagination.start = (Number(paginationQuery.page) - 1) * Number(paginationQuery.pageSize);
      pagination.limit = Number(paginationQuery.pageSize);
      const posts = await strapi.documents('api::post.post').findMany({
        filters,
        // populate: populateOptions,
        populate: {
          categories: true,
          thumbnail: true,
          createdBy: true,
          posts: {
            populate: ['thumbnail', 'categories'],
          },
        },
        ...pagination,
        status: 'published',
        sort: ['publishedAt:desc'],
      });

      const total = await strapi
        .documents('api::post.post')
        .count({ filters, status: 'published', sort: ['publishedAt:desc'] });
      ctx.body = {
        data: posts,
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
      ctx.internalServerError('An error occurred while searching posts');
    }
  },
}));
