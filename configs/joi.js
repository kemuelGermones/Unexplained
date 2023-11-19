const sanitizeHtml = require("sanitize-html");

// Adds a escapeHtml method to joi and checks if the
// a input contains HTML elements
const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHtml": "{{#label}} must not include HTML",
  },
  rules: {
    escapeHtml: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value) {
          return helpers.error("string.escapeHtml", { value });
        }
        return clean;
      },
    },
  },
});

module.exports = extension;
