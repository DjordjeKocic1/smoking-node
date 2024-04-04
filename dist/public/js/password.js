const form = document.querySelector("form");
let error = document.querySelector(".error");
let success = document.querySelector(".success");
let showPassword = document.querySelector("#passwordShow");
let psw = document.querySelector("[name='password']");
let repsw = document.querySelector("[name='repassword']");

psw.addEventListener("keydown", (e) => {
  return e.which !== 32;
});

showPassword.addEventListener("click", () => {
  if (showPassword.classList.contains("fa-eye")) {
    showPassword.classList.remove("fa-eye");
    showPassword.classList.add("fa-eye-slash");
    document.querySelector("[name='password']").setAttribute("type", "text");
  } else {
    showPassword.classList.remove("fa-eye-slash");
    showPassword.classList.add("fa-eye");
    document
      .querySelector("[name='password']")
      .setAttribute("type", "password");
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    let password = e.target.password.value;
    let repassword = e.target.repassword.value;
    if (!password) {
      error.textContent = "Password is required";
      return;
    }
    if (password !== repassword) {
      error.textContent = "Passwords do not match";
      return;
    }
    let param = new URLSearchParams(window.location.search);
    let token = param.get("ver");

    let dataToSend = {
      password,
      repassword,
    };

    let response = await fetch("/create-user-with-password", {
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `${token}`,
      },
    });
    let responseData = await response.json();
    if (responseData.error) {
      error.textContent = responseData.error;
      return;
    }
    error.textContent = "";
    success.textContent =
      "Your changes have been saved. You can now login with your new password.";
    setTimeout(() => {
      if (responseData.redirect) {
        window.location = responseData.redirect;
      }
    }, 2000);
  } catch (error) {
    console.log(error);
  }
});
