const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    match: /^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}/,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 3,
    maxlength: 30,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50,
    match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female"],
  },
  mobileNumber: {
    type: String,
    unique: true,
    required: true,
    match: /^(\+98|0098|0)?9\d{9}$/,
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["admin", "blogger"],
    default: "blogger",
  },
  avatar: {
    type: String,
    default: "default",
  },
  articleCounter: {
    type: Number,
    default: 0,
  },
  commentCounter: {
    type: Number,
    default: 0,
  },
});

UserSchema.pre("save", function (next) {
  const user = this;
  if (this.isNew || this.isModified("password")) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        return next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.pre("findOneAndUpdate", function (next) {
  if (this.getUpdate().$set) {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(this.getUpdate().$set.password, salt);
    this.getUpdate().$set.password = hash;

    next();
  } else {
    next();
  }
});

UserSchema.methods.toJSON = function () {
  let user = this.toObject();
  delete user.__v;
  delete user.password;
  return user;
};

module.exports = mongoose.model("User", UserSchema);
