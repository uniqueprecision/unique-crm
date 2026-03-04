/* ===============================
   ADMIN LIVE DASHBOARD (AUTO)
================================ */

function loadAdminDashboard() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  let inProgress = 0;
  let onHold = 0;
  let qcPending = 0;
  let ready = 0;

  orders.forEach(o => {
    if (o.status === "IN PROGRESS") inProgress++;
    if (o.status === "HOLD") onHold++;
    if (o.status === "COMPLETED") qcPending++;
    if (o.status === "READY FOR DELIVERY") ready++;
  });

  // ===== COUNTERS =====
  if (document.getElementById("totalOrders"))
    totalOrders.innerText = orders.length;

  if (document.getElementById("inProgress"))
    inProgressEl().innerText = inProgress;

  if (document.getElementById("onHold"))
    onHoldEl().innerText = onHold;

  if (document.getElementById("qcPending"))
    qcPendingEl().innerText = qcPending;

  if (document.getElementById("readyDelivery"))
    readyDeliveryEl().innerText = ready;

  // ===== ORDERS TABLE =====
  if (!document.getElementById("orderTable")) return;

  orderTable.innerHTML = "";

  orders.forEach(o => {
    const row = orderTable.insertRow();
    row.innerHTML = `
      <td>${o.orderId || "-"}</td>
      <td>${o.customer || "-"}</td>
      <td>${o.requirement || "-"}</td>
      <td>${o.date || "-"}</td>
      <td>${o.designer || "-"}</td>
      <td>${o.status || "-"}</td>
      <td>${o.jobId || "-"}</td>
    `;
  });
}

/* ===== SAFE ELEMENT GETTERS ===== */
function inProgressEl() { return document.getElementById("inProgress"); }
function onHoldEl() { return document.getElementById("onHold"); }
function qcPendingEl() { return document.getElementById("qcPending"); }
function readyDeliveryEl() { return document.getElementById("readyDelivery"); }

/* ===== AUTO REFRESH ===== */
loadAdminDashboard();
setInterval(loadAdminDashboard, 3000);
