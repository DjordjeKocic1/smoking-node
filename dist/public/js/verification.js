const form = document.querySelector("form");
let error = document.querySelector(".error");
let success = document.querySelector(".success");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    let email = e.target.email.value;

    const dataToSend = {
      email,
    };
    let response = await fetch("/email/create-email-verification", {
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
    success.textContent = "A Link has been sent to your email";

    setTimeout(() => {
      error.textContent = "";
      success.textContent = "";
    }, 2000);
  } catch (error) {
    console.log(error);
  }
});
