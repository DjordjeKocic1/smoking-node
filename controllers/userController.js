const User = require("../model/user");
const { validationResult } = require("express-validator");
exports.getUsers = (req, res, next) => {
  User.find().then((users) => {
    res.json({ users });
  });
};

exports.createUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    image: req.body.picture,
    address: req.body.address,
    city: req.body.city,
  });
  User.find().then((users) => {
    let existingUser = users.find((user) => user.email == req.body.email);
    if (!!existingUser) {
      return res.json({ user: existingUser });
    }
    user
      .save()
      .then((user) => res.json({ user }))
      .catch((error) => res.json({ error }));
  });
};

exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(
    (user) => {
      res.json({ user });
    }
  );
};
