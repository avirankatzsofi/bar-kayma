'use strict';
const wkhtmltopdf = require('wkhtmltopdf');
const fs = require('fs');
const templatesDir = 'public/templates';
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
      parseTemplate(`${templatesDir}/dp.pdf.html`, doc)
        .then(dpContent => wkhtmltopdf(dpContent, { output: `public/dp/${doc._id}.pdf` }));
      doc.pdfUrl = `${ctx.request.origin}/dp/${doc._id}.pdf`;
      parseTemplate(`${templatesDir}/dp.email.html`, doc)
        .then((emailContent) => {
          strapi.plugins['email'].services.email.send({
            to: [doc.user.email, doc.recipientEmail],
            from: 'bill@barkayma.org',
            replyTo: 'bill@barkayma.org',
            subject: `דרישת תשלום עבור ${doc.user.project} מספר ${doc.index} [BanKayma]`,
            html: emailContent
          }).then(() => console.debug('email sent'))
            .catch(err => console.error(err));
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
    return strapi.services.anticipatedpayment.edit(ctx.params, ctx.request.body);
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

function parseTemplate(templateFile, doc) {
  return new Promise((resolve) => {
    fs.readFile(templateFile, 'utf8', (err, data) => {
      const regex = /{{[a-zA-Z0-9\.]+}}/g;
      const matches = data.match(regex);
      matches.forEach(match => {
        let keys = match.split(/{{|}}/)[1];
        keys = keys.split('.'); // in case of nested keys e.g. user.project
        let value = false;
        keys.forEach(key => {
          value = value ? value[key] : doc[key];
        });
        value = value && value.toLocaleDateString ? value.toLocaleDateString('he-IL') : value;
        data = data.split(match).join(value);
      });
      resolve(data);
    });
  });
}
