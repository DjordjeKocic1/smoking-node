const form = document.querySelector("form");
let error = document.querySelector(".error");
let success = document.querySelector(".success");
let showPassword = document.querySelector("#passwordShow");

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

    let getUserEmail = await fetch("/get-user-token", {
      method: "POST",
      body: JSON.stringify({ token }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    let userEmailResponseData = await getUserEmail.json();

    let dataToSend = {
      password,
      repassword,
      token,
      email: userEmailResponseData.email,
    };

    let response = await fetch("/create-user-with-token", {
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
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
  } catch (error) {
    console.log(error);
  }
});
