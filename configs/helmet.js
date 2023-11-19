require("dotenv").config();

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;

const contentSecurityPolicy = {
  directives: {
    defaultSrc: [],
    connectSrc: ["'self'"],
    scriptSrc: ["'unsafe-inline'", "'self'", "https://cdn.jsdelivr.net"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
    workerSrc: ["'self'", "blob:"],
    childSrc: ["blob:"],
    objectSrc: [],
    imgSrc: [
      "'self'",
      "blob:",
      "data:",
      `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/`,
      "https://images.pexels.com",
    ],
    fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
  },
};

module.exports = contentSecurityPolicy;
