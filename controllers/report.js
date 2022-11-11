const Report = require("../models/report");
const { cloudinary } = require("../cloudinary/index");

const categories = ["Paranormal", "UFO/Aliens", "Others"];

// Render All Reports

module.exports.renderReports = async (req, res, next) => {
  const { category } = req.query;
  if (category) {
    if (categories.indexOf(category) < 0) {
      req.flash("error", "Cannot find that category");
      return res.redirect("/reports");
    }
    const report = await (
      await Report.find({ category }).populate("author")
    ).reverse();
    res.render("report/index.ejs", { report, category });
  } else {
    const report = await (await Report.find({}).populate("author")).reverse();
    res.render("report/index.ejs", { report, category: "All" });
  }
};

// Render New Report Form

module.exports.renderNewReportForm = (req, res) => {
  res.render("report/new.ejs", { categories });
};

// Create new report

module.exports.createReport = async (req, res, next) => {
  const report = new Report(req.body.report);
  report.author = req.user._id;
  report.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  if (report.images.length > 5) {
    for (let file of report.images) {
      cloudinary.uploader.destroy(file.filename);
    }
    req.flash("error", "Images should be less than or equal to five only");
    return res.redirect("/reports/new");
  }
  await report.save();
  req.flash("success", "Successfully made a report");
  res.redirect("/reports");
};

// Show individual report

module.exports.showIndividualReport = async (req, res, next) => {
  const { id } = req.params;
  const report = await Report.findById(id)
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

// Render Edit Report Form

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const report = await Report.findById(id);
  if (!report) {
    req.flash("error", "Cannot find that report");
    return res.redirect("/reports");
  }
  res.render("report/edit.ejs", { report, categories });
};

// Edit Report

module.exports.editReport = async (req, res, next) => {
  const { id } = req.params;
  const report = await Report.findById(id);
  if (req.body.deleteImages) {
    for (let deleteFilename of req.body.deleteImages) {
      cloudinary.uploader.destroy(deleteFilename);
      report.images = report.images.filter(
        (img) => img.filename !== deleteFilename
      );
    }
  }
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  const mergedImgs = [...report.images, ...imgs];
  if (mergedImgs.length > 5) {
    for (let file of imgs) {
      cloudinary.uploader.destroy(file.filename);
    }
    req.flash(
      "error",
      "Total Images should be less than or equal to five only"
    );
    return res.redirect(`/reports/${id}`);
  }
  req.body.report.images = mergedImgs;
  const editedReport = await Report.findByIdAndUpdate(id, {
    ...req.body.report,
  });
  req.flash("success", "Successfully edited a report");
  res.redirect(`/reports/${id}`);
};

// Delete Report

module.exports.deleteReport = async (req, res, next) => {
  const { id } = req.params;
  const report = await Report.findById(id);
  if (report.images.length) {
    for (let file of report.images) {
      await cloudinary.uploader.destroy(file.filename);
    }
  }
  await Report.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted a report");
  res.redirect("/reports");
};
