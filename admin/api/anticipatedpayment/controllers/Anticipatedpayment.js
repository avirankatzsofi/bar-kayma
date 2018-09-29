'use strict';
const wkhtmltopdf = require('wkhtmltopdf');
const fs = require('fs');

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
    const result = strapi.services.anticipatedpayment.add(ctx.request.body);
    result.then(doc => {
      fs.readFile('public/templates/dp.html', 'utf8', (err, data) => {
        const regex = /{{[a-zA-Z0-9\.]+}}/g;
        const matches = data.match(regex);
        matches.forEach(match => {
          let keys = match.split(/{{|}}/)[1];
          keys = keys.split('.');
          let value = false;
          keys.forEach(key => {
            value = value ? value[key] : doc[key];
          });
          value = value.toLocaleDateString ? value.toLocaleDateString('he-IL') : value;
          data = data.split(match).join(value);
        });
        wkhtmltopdf(data, { output: `public/dp/${doc._id}.pdf` });
      });
    });
    return result;
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
