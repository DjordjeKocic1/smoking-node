const User = require("../model/user");
const { validationResult } = require("express-validator");
exports.getUsers = (req, res, next) => {
  User.find().then((users) => {
    res.status(200).json({ users });
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
      return res.status(201).json({ user: existingUser });
    }
    user
      .save()
      .then((user) => res.status(201).json({ user }))
      .catch((error) => res.status(502).json({ error }));
  });
};

exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((user) => {
      res.status(201).json({ user });
    })
    .catch((err) => console.log(err));
};
