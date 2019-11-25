const express = require("express");
const multer = require("multer");
const auth = require("../middleware/auth");
const router = new express.Router();

const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  uploadImage,
  getImage,
  deleteImage,
  deleteUser
} = require("../controllers/user");

router.post("/register", register);

router.post("/login", login);

router.post("/logout", auth, logout);

router.get("/me", auth, getMe);

router.put("/me", auth, updateProfile);

router.delete("/me", auth, deleteUser);

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }

    cb(undefined, true);
  }
});

router.post(
  "/me/avatar",
  auth,
  upload.single("avatar"),
  uploadImage,
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/me/avatar", auth, deleteImage);

router.get("/:id/avatar", getImage);

module.exports = router;
