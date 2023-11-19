const Post = require("../models/post");
const { cloudinary } = require("../configs/cloudinary");

module.exports.renderPostsPage = async (req, res, next) => {
  const { category } = req.query;
  const options = category && { category };

  const posts = await Post.find(options).populate("author");

  res.render("post/index.ejs", { posts });
};

module.exports.renderCreatePostPage = (req, res, next) => {
  res.render("post/new.ejs");
};

module.exports.renderEditPostPage = async (req, res, next) => {
  const { post } = res.locals;

  res.render("post/edit.ejs", { post });
};

module.exports.createPost = async (req, res, next) => {
  const { _id } = req.user;
  const images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));

  const post = new Post(req.body.post);
  post.author = _id;
  post.images = images;
  await post.save();

  req.flash("success", "Successfully created a post");
  res.redirect("/posts");
};

module.exports.getPost = async (req, res, next) => {
  const { post } = res.locals;

  res.render("post/show.ejs", { post });
};

module.exports.editPost = async (req, res, next) => {
  const { post } = res.locals;
  const images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));

  if (req.body.images) {
    const deleteImages = req.body.images.map(
      async (filename) => await cloudinary.uploader.destroy(filename)
    );
    await Promise.all(deleteImages);
    await post.updateOne({
      $pull: { images: { filename: { $in: req.body.images } } },
    });
  }
  await post.updateOne({
    ...req.body.post,
    $push: { images: { $each: images } },
  });

  req.flash("success", "Successfully edited a post");
  res.redirect(`/posts/${post._id}`);
};

module.exports.deletePost = async (req, res, next) => {
  const { post } = res.locals;

  if (post.images.length) {
    const deleteImages = post.images.map(
      async (image) => await cloudinary.uploader.destroy(image.filename)
    );
    await Promise.all(deleteImages);
  }
  await post.deleteOne();

  req.flash("success", "Successfully deleted a post");
  res.redirect("/posts");
};
