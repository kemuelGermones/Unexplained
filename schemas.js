const extension = require("./configs/joi");
const Joi = require("joi").extend(extension);

module.exports.postSchema = Joi.object({
  post: Joi.object({
    title: Joi.string().label("Title").escapeHtml().required(),
    description: Joi.string().label("Description").escapeHtml().required(),
    category: Joi.string()
      .label("Category")
      .valid("paranormal", "extraterrestrial", "others")
      .escapeHtml()
      .required(),
  }).required(),
  images: Joi.array().label("Images").items(Joi.string().label("Filename")),
});

module.exports.commentSchema = Joi.object({
  opinion: Joi.string().label("Opinion").escapeHtml().required(),
});

module.exports.userSchema = Joi.object({
  username: Joi.string().label("Username").escapeHtml().required(),
  email: Joi.string().label("Email").email().escapeHtml().required(),
  password: Joi.string().label("Password").required(),
});
