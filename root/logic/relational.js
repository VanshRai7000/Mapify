document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("relationalModelContainer");

  const tablesJSON = sessionStorage.getItem("relationalTables");
  if (!tablesJSON) {
    container.innerHTML = "<p>No relational model found.</p>";
    return;
  }

  const tables = JSON.parse(tablesJSON);

  tables.forEach(table => {
    const div = document.createElement("div");
    div.className = "p-4 border rounded bg-white shadow";

    let html = `<h2 class="font-bold mb-2 text-lg">${table.tableName}</h2>`;
    html += `<table class="w-full border border-gray-300"><tr><th class="border px-2 py-1">Column</th><th class="border px-2 py-1">Type</th></tr>`;

    table.columns.forEach(col => {
      html += `<tr>
                <td class="border px-2 py-1">${col.name}${table.primaryKey === col.name ? " (PK)" : ""}</td>
                <td class="border px-2 py-1">${col.type}</td>
               </tr>`;
    });

    table.foreignKeys?.forEach(fk => {
      html += `<tr>
                <td class="border px-2 py-1">${fk.column} (FK)</td>
                <td class="border px-2 py-1">References ${fk.references}</td>
               </tr>`;
    });

    html += `</table>`;
    div.innerHTML = html;
    container.appendChild(div);
  });
});
