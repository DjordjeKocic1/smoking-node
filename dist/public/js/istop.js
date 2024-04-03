let token = sessionStorage.getItem("token");
let error = document.querySelector(".error");
fetch("/admin-users", { headers: { Authorization: token } })
  .then((res) => res.json())
  .then((data) => {
    if (data.error) {
      error.textContent = data.error;
      return;
    }
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
