export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'frame-ancestors': ["'self'", 'http://localhost:3000'],
          'media-src': ["'self'", 'data:', 'blob:', 'http://127.0.0.1:9000', 'http://localhost:9000', process.env.MINIO_ENDPOINT, process.env.MINIO_EXTERNAL_ENDPOINT].filter(Boolean),
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];