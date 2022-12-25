exports.validateEmail = (value, { req }) => {
  if (!value) {
    return Promise.reject("'Email' field is required");
  } else if (!value.includes("@")) {
    return Promise.reject(
      "'Email' field is invalid, need to have @ and email domain exp:email@domain.com"
    );
  } else {
    return Promise.resolve();
  }
};
