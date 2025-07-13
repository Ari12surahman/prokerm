
const API_URL = "[![Netlify Status](https://api.netlify.com/api/v1/badges/952e3d08-85cb-4390-80dd-4a0c99d820fb/deploy-status)](https://app.netlify.com/projects/prokerm/deploys)";

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const divisi = document.getElementById('divisi').value;
  const kegiatan = document.getElementById('kegiatan').value;
  const tanggal = document.getElementById('tanggal').value;
  const pj = document.getElementById('pj').value;

  await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ divisi, kegiatan, tanggal, penanggung_jawab: pj }),
  });

  document.getElementById('form').reset();
  loadData();
});

async function loadData() {
  const res = await fetch(`${API_URL}/data`);
  const data = await res.json();
  const tbody = document.querySelector('#data-table tbody');
  tbody.innerHTML = '';
  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.divisi}</td>
      <td>${row.kegiatan}</td>
      <td>${row.tanggal}</td>
      <td>${row.penanggung_jawab}</td>
    `;
    tbody.appendChild(tr);
  });
}

function exportExcel() {
  window.open(`${API_URL}/export/excel`, '_blank');
}

function exportPDF() {
  window.open(`${API_URL}/export/pdf`, '_blank');
}

loadData();
