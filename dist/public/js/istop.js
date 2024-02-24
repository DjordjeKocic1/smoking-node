fetch("/users")
  .then((res) => res.json())
  .then((data) => {
    let { users } = data;
    const table = document.body.appendChild(document.createElement("table"));
    const thead = table.appendChild(document.createElement("thead"));
    const tr = thead.appendChild(document.createElement("tr"));
    const columnTexts = ["type", "email", "created", "last seen"];
    columnTexts.forEach((columnText) => {
      tr.appendChild(document.createElement("td")).textContent = columnText;
    });
    const tbody = table.appendChild(document.createElement("tbody"));
    users.forEach((item) => {
      const tr = tbody.appendChild(document.createElement("tr"));
      const values = [
        item.type,
        item.email,
        new Date(item.createdAt).toLocaleDateString(),
        new Date(item.updatedAt).toLocaleDateString(),
      ];
      values.forEach((value) => {
        tr.appendChild(document.createElement("td")).textContent = value;
      });
    });
  });

let btnPP = document.querySelector(".btnPP");

btnPP.addEventListener("click", () => {
  fetch("/paypal-pay", {
    method: "POST",
    body: JSON.stringify({ price: 12 }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
});
