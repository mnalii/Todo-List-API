const User = require("../models/user");
const sharp = require("sharp");
const { sendWelcomeEmail, sendCancelationEmail } = require("../emails/account");

exports.register = async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.json({ user, token });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

exports.logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.json({
      success: true
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.getMe = async (req, res) => {
  res.send(req.user);
};

exports.updateProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ error: "Invalid updates!" });
  }

  try {
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send({
      success: true,
      data: req.user
    });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

exports.uploadImage = async (req, res) => {
  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();
  req.user.avatar = buffer;
  await req.user.save();
  res.json({
    succes: true
  });
};

exports.deleteImage = async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.json({
    success: true
  });
};

exports.getImage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).json({
      error: "No image found"
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await req.user.remove();
    sendCancelationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
};
