async function loadProductionDashboard() {
  const res = await fetch("/api/production/live");
  const data = await res.json();

  let total = data.length;
  let running = 0, completed = 0, qc = 0;

  const table = document.getElementById("prodTable");
  table.innerHTML = "";

  data.forEach(d => {
    if (d.status === "STARTED") running++;
    if (d.status === "COMPLETED") completed++;
    if (d.status === "QC_PENDING") qc++;

    const row = table.insertRow();
    row.innerHTML = `
      <td>${d.jobId}</td>
      <td>${d.machine}</td>
      <td>${d.operator}</td>
      <td>
        <span class="status ${d.status}">
          ${d.status}
        </span>
      </td>
      <td>${d.time}</td>
    `;
  });

  document.getElementById("kpiTotal").innerText = total;
  document.getElementById("kpiRunning").innerText = running;
  document.getElementById("kpiCompleted").innerText = completed;
  document.getElementById("kpiQC").innerText = qc;
}

setInterval(loadProductionDashboard, 5000);
loadProductionDashboard();
