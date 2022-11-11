const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

// Adds a escapeHTML method to joi and checks if the
// a input contains HTML elements

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

// Validates report inputs

module.exports.reportSchema = Joi.object({
  report: Joi.object({
    title: Joi.string().escapeHTML().required(),
    description: Joi.string().escapeHTML().required(),
    category: Joi.string().escapeHTML().required(),
  }).required(),
  deleteImages: Joi.array(),
});

// Validates comment input

module.exports.commentSchema = Joi.object({
  comment: Joi.object({
    opinion: Joi.string().escapeHTML().required(),
  }).required(),
});
