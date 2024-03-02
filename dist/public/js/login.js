let loginForm = document.querySelector(".login");
let errorTxt = document.querySelector(".error");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = { email: e.target.email.value };
  fetch("/user", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        let { error } = data;
        errorTxt.textContent = error;
        return;
      }
      window.location = data.redirect;
      errorTxt.textContent = "";
    })
    .catch((err) => {
      console.log(err);
    });
});
