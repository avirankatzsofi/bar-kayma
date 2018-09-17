'use strict';

/**
 * Lifecycle callbacks for the `Anticipatedpayment` model.
 */

module.exports = {
  // Before saving a value.
  // Fired before an `insert` or `update` query.
  beforeSave: async (model) => {
    try {
      await strapi.plugins['email'].services.email.send({
        from: 'contact@kayma.soficoop.com', // Sender (defaults to `strapi.config.smtp.from`).
        to: [model.recipientEmail], // Recipients list.
        html: `<p>Welcome back Oz,

        I would say that would be a misconception, to take the simplicity of the
        frames as simplicity of the software/platform. I modeled the user
        journey, yet I had to leave out all complex background tasks.
        
        The main screen would be more looking like this:
        https://www.youtube.com/watch?v=rOjrImaPh80
        The user is able to fly FPV through the universe of questions (and
        answers).
        
        The answers around one question would more look like this:
        https://www.youtube.com/watch?v=wvsE8jm1GzE&t=5s
        The answers are sorted by dimensionality reducing algorithm (like
        t-SNE).</p>`, // HTML version of the email content.
        text: `Welcome back Oz,

        I would say that would be a misconception, to take the simplicity of the
        frames as simplicity of the software/platform. I modeled the user
        journey, yet I had to leave out all complex background tasks.
        
        The main screen would be more looking like this:
        https://www.youtube.com/watch?v=rOjrImaPh80
        The user is able to fly FPV through the universe of questions (and
        answers).
        
        The answers around one question would more look like this:
        https://www.youtube.com/watch?v=wvsE8jm1GzE&t=5s
        The answers are sorted by dimensionality reducing algorithm (like
        t-SNE).` // Text version of the email content.
      });
    } catch (error) {
      console.log(error);
    }
  },

  // After saving a value.
  // Fired after an `insert` or `update` query.
  // afterSave: async (model, result) => {},

  // Before fetching all values.
  // Fired before a `fetchAll` operation.
  // beforeFetchAll: async (model) => {},

  // After fetching all values.
  // Fired after a `fetchAll` operation.
  // afterFetchAll: async (model, results) => {},

  // Fired before a `fetch` operation.
  // beforeFetch: async (model) => {},

  // After fetching a value.
  // Fired after a `fetch` operation.
  // afterFetch: async (model, result) => {},

  // Before creating a value.
  // Fired before an `insert` query.
  // beforeCreate: async (model) => {},

  // After creating a value.
  // Fired after an `insert` query.
  // afterCreate: async (model, result) => {},

  // Before updating a value.
  // Fired before an `update` query.
  // beforeUpdate: async (model) => {},

  // After updating a value.
  // Fired after an `update` query.
  // afterUpdate: async (model, result) => {},

  // Before destroying a value.
  // Fired before a `delete` query.
  // beforeDestroy: async (model) => {},

  // After destroying a value.
  // Fired after a `delete` query.
  // afterDestroy: async (model, result) => {}
};
