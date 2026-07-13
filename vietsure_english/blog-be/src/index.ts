import type { Core } from '@strapi/strapi';
import { sendRegistrationEmail } from './utils/email';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    strapi.documents.use((context, next) => {
      const { action, uid } = context;

      // Check if it's the creation of trial-registration or ctv-registration
      const isTrial = uid === 'api::trial-registration.trial-registration';
      const isCtv = uid === 'api::ctv-registration.ctv-registration';

      if ((isTrial || isCtv) && action === 'create') {
        return next().then((result) => {
          const type = isTrial ? 'trial' : 'ctv';
          
          sendRegistrationEmail(type, result)
            .then(() => {
              strapi.log.info(`[Email Notification] Successfully sent email for ${type} registration ID: ${result?.id || result?.documentId}`);
            })
            .catch((err) => {
              strapi.log.error(`[Email Notification] Failed to send email for ${type} registration:`, err);
            });

          return result;
        });
      }

      return next();
    });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};

