const express = require("express");
const router = express.Router();
const Article = require("../models/article");
const User = require("../models/user");
const Comment = require("../models/comment");
const moment = require("moment-jalaali");
const commentValidate = require("../tools/validator/commentValidate");
const { validationResult } = require("express-validator");

router.get("/", (req, res, next) => {
  let perPage = 10;
  let page = req.query.page || 1;
  let search = new RegExp(req.query.search, "i");
  req.query.order = req.query.order || "desc";
  let order = -1;
  if (req.query.order === "asc") {
    order = 1;
  } else if (req.query.order === "desc") {
    order = -1;
  }
  Comment.find({ body: { $regex: search } })
    .skip(perPage * page - perPage)
    .limit(perPage)
    .populate("author", { firstName: 1, lastName: 1, avatar: 1 })
    .populate("article", {
      viewCounter: 0,
      commentCounter: 0,
      brief: 0,
      describe: 0,
    })
    .sort({ createdAt: order })
    .exec((err, comments) => {
      if (err) return res.status(500).json({ msg: "Server Error" });
      let createTime = [];
      for (let index = 0; index < comments.length; index++) {
        createTime[index] = {
          date: moment(comments[index].createdAt).format("jYYYY/jM/jD"),
          time: moment(comments[index].createdAt).format("HH:mm"),
        };
      }
      Comment.find({ body: { $regex: search } })
        .count()
        .exec((err, commentCount) => {
          if (err) return res.status(500).json({ msg: "Server Error" });
          return res.render("user/admin/comments", {
            user: req.session.user,
            page: req.query.page,
            successfullyDelete: req.flash("successfullyDelete"),
            comments,
            createTime,
            current: page,
            pages: Math.ceil(commentCount / perPage),
          });
        });
    });
});

router.post("/", commentValidate.handle(), (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array();
    const messages = [];
    errors.forEach((err) => {
      messages.push(err.msg);
    });
    req.flash("messages", messages);
    return res.redirect(`/article/view/${req.body.article_id}`);
  }
  const comment = new Comment({
    body: req.body.comment,
    author: req.session.user._id,
    article: req.body.article_id,
  });
  comment.save((err) => {
    if (err) return res.status(500).json({ msg: "Server Error" });
  });
  Article.findByIdAndUpdate(
    req.body.article_id,
    { $inc: { commentCounter: 1 } },
    { new: true },
    (err) => {
      if (err) return res.status(500).json({ msg: "Server Error" });
      req.flash("successfullyAdded", "نظر شما با موفقیت ثبت شد");
      return res.redirect(`/article/view/${req.body.article_id}`);
    }
  );
});

router.delete("/:id", (req, res, next) => {
  Comment.deleteOne({ _id: req.params.id }, (err) => {
    if (err) return res.status(500).json({ msg: "Server Error" });
    Article.findByIdAndUpdate(
      req.body.article_id,
      { $inc: { commentCounter: -1 } },
      { new: true },
      (err) => {
        if (err) return res.status(500).json({ msg: "Server Error" });
        req.flash("successfullyDelete", "نظر مورد نظر با موفقیت حذف شد.");
        return res.redirect("/article/comment");
      }
    );
  });
});

module.exports = router;
