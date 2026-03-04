protectPage("designer");

const orders = JSON.parse(localStorage.getItem("orders")) || [];

const total = orders.length;
const inProd = orders.filter(o => o.status === "IN PROGRESS").length;
const hold = orders.filter(o => o.status === "HOLD").length;
const qc = orders.filter(o => o.status === "QC PENDING").length;
const ready = orders.filter(o => o.status === "READY DELIVERY").length;

document.getElementById("kpi-total").innerText = total;
document.getElementById("kpi-prod").innerText = inProd;
document.getElementById("kpi-hold").innerText = hold;
document.getElementById("kpi-qc").innerText = qc;
document.getElementById("kpi-ready").innerText = ready;
