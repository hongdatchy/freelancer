// src/extensions/users-permissions/strapi-server.ts
export default (plugin: any) => {
  const originalUpdate = plugin.controllers.contentmanageruser.update;

  plugin.controllers.contentmanageruser.update = async (ctx: any) => {
    const body = ctx.request.body;

    if (body && (body.password === null || body.password === '' || body.password === undefined)) {
      delete ctx.request.body.password;
    }

    return originalUpdate(ctx);
  };

  return plugin;
};