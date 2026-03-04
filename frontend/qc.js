const table = document.getElementById("qcTable");

async function loadQC() {
  table.innerHTML = "";

  const res = await fetch("/api/qc/list");
  const jobs = await res.json();

  jobs.forEach(j => {
    const row = table.insertRow();
    row.innerHTML = `
      <td>${j.jobId}</td>
      <td>${j.customer}</td>
      <td>${j.requirement}</td>
      <td>
        <button onclick="qcUpdate('${j.jobId}', 'APPROVED')">Approve</button>
        <button onclick="qcUpdate('${j.jobId}', 'REJECTED')">Reject</button>
      </td>
    `;
  });
}

async function qcUpdate(jobId, status) {
  const remarks = prompt("QC Remarks:");
  if (!remarks) return;

  await fetch("/api/qc/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jobId,
      status,
      remarks,
      qcBy: "QC User"
    })
  });

  alert("QC Updated");
  loadQC();
}

document.addEventListener("DOMContentLoaded", loadQC);
