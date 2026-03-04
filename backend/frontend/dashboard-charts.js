// READ ALL ORDERS
const orders = JSON.parse(localStorage.getItem("orders")) || [];

/* ================= PRODUCTION STATUS (BAR) ================= */
const statusMap = {
  "IN PROGRESS": 0,
  "HOLD": 0,
  "COMPLETED": 0,
  "QC PENDING": 0
};

orders.forEach(o => {
  if (statusMap[o.status] !== undefined) {
    statusMap[o.status]++;
  }
});

new Chart(document.getElementById("prodStatusChart"), {
  type: "bar",
  data: {
    labels: Object.keys(statusMap),
    datasets: [{
      data: Object.values(statusMap),
      backgroundColor: ["#2563eb", "#dc2626", "#16a34a", "#f59e0b"]
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } }
  }
});

/* ================= MACHINE UTILIZATION (PIE) ================= */
const machineMap = {};

orders.forEach(o => {
  if (o.machine) {
    machineMap[o.machine] = (machineMap[o.machine] || 0) + 1;
  }
});

new Chart(document.getElementById("machineChart"), {
  type: "pie",
  data: {
    labels: Object.keys(machineMap),
    datasets: [{
      data: Object.values(machineMap),
      backgroundColor: [
        "#2563eb",
        "#16a34a",
        "#f59e0b",
        "#dc2626",
        "#6b7280"
      ]
    }]
  },
  options: { responsive: true }
});

/* ================= DAILY OUTPUT (LINE) ================= */
const dailyMap = {};

orders.forEach(o => {
  if (o.endTime) {
    const day = o.endTime.split(",")[0];
    dailyMap[day] = (dailyMap[day] || 0) + 1;
  }
});

new Chart(document.getElementById("dailyChart"), {
  type: "line",
  data: {
    labels: Object.keys(dailyMap),
    datasets: [{
      label: "Completed Jobs",
      data: Object.values(dailyMap),
      borderColor: "#2563eb",
      backgroundColor: "rgba(37,99,235,0.2)",
      fill: true,
      tension: 0.4
    }]
  },
  options: { responsive: true }
});
