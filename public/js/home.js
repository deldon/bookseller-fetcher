const app = {
  table: [],
  init: async () => {
    app.table = await app.selectIsbnNotScrap();
    app.wirthTable();

    const myForm = document.getElementById("myForm");
    myForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const data = {
        isbn: document.getElementById("isbn").value,
        box: document.getElementById("box").value,
      };
      document.getElementById("isbn").value = "";
      app.table = await app.inputIsbn(data);
      app.wirthTable();
    });
  },
  inputIsbn: async (obj) => {
    try {
      const response = await fetch("http://localhost:3066/isbn/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Erreur lors de la requête Fetch :", error);
    }
  },
  selectIsbnNotScrap: async () => {
    try {
      const response = await fetch("http://localhost:3066/isbn/noscrap", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de la requête Fetch :", error);
    }
  },
  wirthTable: () => {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";
    //app.table.reverse();

    app.table.forEach((item) => {
      const row = document.createElement("tr");

      const regex = /^978\d{10}$/;

      // Exemple d'utilisation
      const testString = "9781234567890";
      const isMatch = regex.test(item.isbn);

      if (!isMatch) {
        row.classList.add('table-danger')
      }

      row.innerHTML = `
<td>${item.id}</td>
<td>${item.isbn}</td>
<td>${item.box}</td>
<td>${item.scan_date}</td>
<td>
<a href="/isbn/${item.id}" class="btn btn-warning btn-sm">
    <i class="fas fa-edit"></i>
</a>

<!-- Bouton de suppression avec lien -->
<a href="/isbn/delete/${item.id}" class="btn btn-danger btn-sm">
    <i class="fas fa-trash-alt"></i>
</a>
</td>
`;
      tableBody.appendChild(row);
    });
  },
};

app.init();
