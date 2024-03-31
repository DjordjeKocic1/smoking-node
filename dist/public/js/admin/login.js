let loginForm = document.querySelector(".login");
let errorTxt = document.querySelector(".error");
let success = document.querySelector(".text-success");
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

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let email = e.target.email.value;
  let password = e.target.password.value;

  let dataToSend = { email, password };
  let response = await fetch("/user-login", {
    method: "POST",
    body: JSON.stringify(dataToSend),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  let responseData = await response.json();

  if (responseData.error) {
    let { error } = responseData;
    errorTxt.textContent = error;
    return;
  }

  success.textContent = "Login Successful";

  setTimeout(() => {
    success.textContent = "";
  },2000)
  
});
