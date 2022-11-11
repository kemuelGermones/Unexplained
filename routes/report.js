const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { validateReport, isLoggedIn, isAuthor } = require("../middleware");
const report = require("../controllers/report");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

// Render All Reports route

router.get("/", wrapAsync(report.renderReports));

// Render New Report Form route

router.get("/new", isLoggedIn, report.renderNewReportForm);

// Create new report route

router.post(
  "/",
  isLoggedIn,
  upload.array("image"),
  validateReport,
  wrapAsync(report.createReport)
);

// Show individual report route

router.get("/:id", wrapAsync(report.showIndividualReport));

// Render edit report form route

router.get("/:id/edit", isLoggedIn, isAuthor, wrapAsync(report.renderEditForm));

// Edit report route
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  upload.array("image"),
  validateReport,
  wrapAsync(report.editReport)
);

// Delete report route

router.delete("/:id", isLoggedIn, isAuthor, wrapAsync(report.deleteReport));

module.exports = router;
