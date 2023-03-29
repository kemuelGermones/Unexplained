const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { validateReport, isLoggedIn, isAuthor } = require("../middleware");
const report = require("../controllers/report");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

// Render reports page route

router.get("/", wrapAsync(report.renderReports));

// Render new report page route

router.get("/new", isLoggedIn, report.renderNewReportForm);

// Create report route

router.post(
  "/",
  isLoggedIn,
  upload.array("image"),
  validateReport,
  wrapAsync(report.createReport)
);

// Render individual report page route

router.get("/:reportId", wrapAsync(report.showIndividualReport));

// Render edit report page route

router.get("/:reportId/edit", isLoggedIn, isAuthor, wrapAsync(report.renderEditForm));

// Edit report route

router.put(
  "/:reportId",
  isLoggedIn,
  isAuthor,
  upload.array("image"),
  validateReport,
  wrapAsync(report.editReport)
);

// Delete report route

router.delete("/:reportId", isLoggedIn, isAuthor, wrapAsync(report.deleteReport));

module.exports = router;
