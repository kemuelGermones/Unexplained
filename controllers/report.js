const Report = require("../models/report");
const { cloudinary } = require("../cloudinary/index");
const categories = require("../public/javascripts/categories");

// Render reports page

module.exports.renderReports = async (req, res, next) => {
  const { category } = req.query;
  if (category) {
    if (categories.findIndex((val) => val.name === category) === -1) {
      req.flash("error", "Cannot find that category");
      return res.redirect("/reports");
    }
    const report = await Report.find({ category }).populate("author");
    return res.render("report/index.ejs", { report });
  }
  const report = await Report.find().populate("author");
  res.render("report/index.ejs", { report });
};

// Render new report page

module.exports.renderNewReportForm = (req, res, next) => {
  res.render("report/new.ejs");
};

// Create new report

module.exports.createReport = async (req, res, next) => {
  const report = new Report(req.body.report);
  report.author = req.user._id;
  report.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  await report.save();
  req.flash("success", "Successfully made a report");
  res.redirect("/reports");
};

// Render individual report page

module.exports.showIndividualReport = async (req, res, next) => {
  const { reportId } = req.params;
  const report = await Report.findById(reportId)
    .populate({
      path: "comments",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!report) {
    req.flash("error", "Cannot find that report");
    return res.redirect("/reports");
  }
  res.render("report/show.ejs", { report });
};

// Render edit report page

module.exports.renderEditForm = async (req, res, next) => {
  const { reportId } = req.params;
  const report = await Report.findById(reportId);
  if (!report) {
    req.flash("error", "Cannot find that report");
    return res.redirect("/reports");
  }
  res.render("report/edit.ejs", { report });
};

// Edit Report

module.exports.editReport = async (req, res, next) => {
  const { reportId } = req.params;
  const report = await Report.findByIdAndUpdate(reportId, {
    ...req.body.report,
  });
  report.images.push(
    ...req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }))
  );
  await report.save();
  if (req.body.deleteImages) {
    const deleteCloudinary = req.body.deleteImages.map((filename) =>
      cloudinary.uploader.destroy(filename)
    );
    await Promise.all(deleteCloudinary);
    await report.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully edited a report");
  res.redirect(`/reports/${reportId}`);
};

// Delete Report

module.exports.deleteReport = async (req, res, next) => {
  const { reportId } = req.params;
  const report = await Report.findById(reportId);
  if (report.images.length) {
    const deleteCloudinary = report.images.map((image) =>
      cloudinary.uploader.destroy(image.filename)
    );
    await Promise.all(deleteCloudinary);
  }
  await Report.findByIdAndDelete(reportId);
  req.flash("success", "Successfully deleted a report");
  res.redirect("/reports");
};
