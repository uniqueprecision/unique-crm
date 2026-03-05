const orders = JSON.parse(localStorage.getItem("orders")) || [];

// ===== PRODUCTION STATUS BAR =====
const statusCount = {
  "IN PROGRESS": 0,
  "HOLD": 0,
  "COMPLETED": 0
};

orders.forEach(o => {
  if (statusCount[o.status] !== undefined) {
    statusCount[o.status]++;
  }
});

new Chart(document.getElementById("productionStatus"), {
  type: "bar",
  data: {
    labels: ["In Progress", "On Hold", "Completed"],
    datasets: [{
      label: "Jobs",
      data: [
        statusCount["IN PROGRESS"],
        statusCount["HOLD"],
        statusCount["COMPLETED"]
      ],
      backgroundColor: ["#1f5fa6", "#d97706", "#15803d"]
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } }
  }
});

// ===== MACHINE UTILIZATION PIE =====
const machineCount = {};

orders.forEach(o => {
  if (o.machine) {
    machineCount[o.machine] = (machineCount[o.machine] || 0) + 1;
  }
});

new Chart(document.getElementById("machinePie"), {
  type: "pie",
  data: {
    labels: Object.keys(machineCount),
    datasets: [{
      data: Object.values(machineCount),
      backgroundColor: [
        "#1f5fa6", "#15803d", "#d97706", "#6b7280", "#b91c1c"
      ]
    }]
  }
});

// ===== DAILY OUTPUT LINE =====
const dailyMap = {};

orders.forEach(o => {
  if (o.endTime) {
    const day = o.endTime.split(",")[0];
    dailyMap[day] = (dailyMap[day] || 0) + 1;
  }
});

new Chart(document.getElementById("dailyOutput"), {
  type: "line",
  data: {
    labels: Object.keys(dailyMap),
    datasets: [{
      label: "Completed Jobs",
      data: Object.values(dailyMap),
      borderColor: "#1f5fa6",
      backgroundColor: "rgba(31,95,166,0.2)",
      tension: 0.4,
      fill: true
    }]
  },
  options: {
    responsive: true
  }
});
