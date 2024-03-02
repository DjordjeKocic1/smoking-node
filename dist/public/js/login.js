let loginForm = document.querySelector(".login");
let errorTxt = document.querySelector(".error");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    let dataToSend = { email: e.target.email.value };
    let response = await fetch("/user", {
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
    window.location = responseData.redirect;
    errorTxt.textContent = "";
  } catch (error) {
    console.log(error);
  }
});
