const User = require("../model/user");

exports.getUsers = (req,res,next) => {
  User.find().then((users) => {
    res.json({users})
  })
}

exports.createUser = (req, res, next) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    image: req.body.picture,
  });
  User.find().then((users) => {
    let existingUser = users.find((user) => user.email == req.body.email);
    if (existingUser) {
      console.log("Existing: ", existingUser);
      res.json({ user: existingUser });
      return;
    } else {
      user.save();
      console.log("New: ", user);
      res.json({ user: user });
    }
  });
};

exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((r) => {
    console.log("User Updated", r);
    res.json({ user: r });
  });
};
