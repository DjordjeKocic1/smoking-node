const User = require("../model/user");

exports.getUsers = (req, res, next) => {
  User.find().then((users) => {
    res.json({ users });
  });
};

exports.createUser = (req, res, next) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    image: req.body.picture,
    address: req.body.address,
    city: req.body.city,
  });
  User.find().then((users) => {
    let existingUser = users.find((user) => user.email == req.body.email);
    if (existingUser) {
      res.json({ user: existingUser });
      return;
    } else {
      user.save();
      res.json({ user: user });
    }
  });
};

exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((r) => {
    res.json({ user: r });
  });
};
