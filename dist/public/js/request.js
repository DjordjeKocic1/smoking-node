let deleteForm = document.querySelector(".deleteForm");
let errorTxt = document.querySelector(".error");
let successTxt = document.querySelector(".text-success");

deleteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    let params = new URLSearchParams(window.location.search);
    const dataToSend = {
      name: "sale.dalibor.djole@gmail.com",
      email: "sale.dalibor.djole@gmail.com",
      params: {
        id: params.get("id"),
        email: e.target.email.value,
      },
    };
    let response = await fetch("/email/create-delete-email", {
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    let responseData = await response.json();

    if (responseData.error) {
      errorTxt.textContent = responseData.error;
      successTxt.textContent = "";
      return;
    }

    if (e.target.feedback.value) {
      await fetch("/create-feedback", {
        method: "POST",
        body: JSON.stringify({
          email: e.target.email.value,
          message: e.target.feedback.value,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    }
    
    errorTxt.textContent = "";
    successTxt.textContent = "Request sent!";
    setTimeout(() => {
      window.location = responseData.redirect
    }, 2000);
  } catch (error) {
    console.log(error);
  }
});
