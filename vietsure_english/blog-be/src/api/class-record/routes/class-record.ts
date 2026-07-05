export default {
  routes: [
    {
      method: 'GET',
      path: '/class-records',
      handler: 'class-record.find',
      config: {
        auth: false, // For local testing, we can keep it open.
        policies: [],
        middlewares: [],
      },
    },
  ],
};
