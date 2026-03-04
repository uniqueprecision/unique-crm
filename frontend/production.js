let currentJob = null;

/* =========================
   LOAD JOB
========================= */
async function loadJob() {
  const jobId = document.getElementById("jobIdInput").value.trim();
  if (!jobId) return alert("Enter Job ID");

  const res = await fetch("/api/jobs/list");
  const jobs = await res.json();

  const job = jobs.find(j => j.jobId === jobId);
  if (!job) {
    document.getElementById("jobMsg").innerText = "❌ Job not found";
    return;
  }

  currentJob = job;

  document.getElementById("pdJobId").innerText = job.jobId;
  document.getElementById("pdRequirement").innerText = job.requirement;
  document.getElementById("pdDesign").innerText = job.designNo;

  document.getElementById("jobDetails").style.display = "block";
}

/* =========================
   START PRODUCTION
========================= */
async function startProduction() {
  if (!currentJob) return;

  await fetch("/api/production/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jobId: currentJob.jobId,
      machine: pdMachine.value,
      operator: pdOperator.value
    })
  });

  alert("✅ Production Started");
}

/* =========================
   COMPLETE PRODUCTION
========================= */
async function completeProduction() {
  if (!currentJob) return;

  await fetch("/api/production/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jobId: currentJob.jobId,
      qty: pdQty.value,
      reject: pdReject.value
    })
  });

  alert("✅ Production Completed");
  location.reload();
}
