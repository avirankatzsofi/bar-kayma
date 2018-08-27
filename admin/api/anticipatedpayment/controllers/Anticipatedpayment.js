'use strict';

/**
 * Anticipatedpayment.js controller
 *
 * @description: A set of functions called "actions" for managing `Anticipatedpayment`.
 */

module.exports = {

  /**
   * Retrieve anticipatedpayment records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.anticipatedpayment.search(ctx.query);
    } else {
      return strapi.services.anticipatedpayment.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a anticipatedpayment record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.anticipatedpayment.fetch(ctx.params);
  },

  /**
   * Count anticipatedpayment records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.anticipatedpayment.count(ctx.query);
  },

  /**
   * Create a/an anticipatedpayment record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.anticipatedpayment.add(ctx.request.body);
  },

  /**
   * Update a/an anticipatedpayment record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.anticipatedpayment.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an anticipatedpayment record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.anticipatedpayment.remove(ctx.params);
  }
};
