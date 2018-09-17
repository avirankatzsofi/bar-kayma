'use strict';

/**
 * Documenttemplate.js controller
 *
 * @description: A set of functions called "actions" for managing `Documenttemplate`.
 */

module.exports = {

  /**
   * Retrieve documenttemplate records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.documenttemplate.search(ctx.query);
    } else {
      return strapi.services.documenttemplate.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a documenttemplate record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.documenttemplate.fetch(ctx.params);
  },

  /**
   * Count documenttemplate records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.documenttemplate.count(ctx.query);
  },

  /**
   * Create a/an documenttemplate record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.documenttemplate.add(ctx.request.body);
  },

  /**
   * Update a/an documenttemplate record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.documenttemplate.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an documenttemplate record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.documenttemplate.remove(ctx.params);
  }
};
