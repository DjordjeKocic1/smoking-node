let deleteForm = document.querySelector(".deleteForm");
let errorTxt = document.querySelector(".error");
let successTxt = document.querySelector(".text-success");

deleteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let params = new URLSearchParams(window.location.search);
  const dataToSend = {
    name: "sale.dalibor.djole@gmail.com",
    email: "sale.dalibor.djole@gmail.com",
    params: {
      id: params.get("id"),
      email: e.target.email.value,
    },
  };
  fetch("/email/create-delete-email", {
    method: "POST",
    body: JSON.stringify(dataToSend),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (e.target.feedback.value) {
        fetch("/create-feedback", {
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
      if (data.error) {
        errorTxt.textContent = data.error;
        successTxt.textContent = "";
        return;
      }
      errorTxt.textContent = "";
      successTxt.textContent = "Request sent!";
    })
    .catch((err) => {
      console.log(err);
    });
});
