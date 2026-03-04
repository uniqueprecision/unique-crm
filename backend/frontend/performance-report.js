/* =====================
   PERFORMANCE REPORT
   READ-ONLY from localStorage
   Auto-refresh every 3 seconds
===================== */

/* ================= LOAD REPORT DATA ================= */
function loadPerformanceReport() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  // Load Operator Performance Report
  loadOperatorReport(orders);

  // Load Machine Load Report
  loadMachineReport(orders);
}

/* ================= OPERATOR PERFORMANCE ================= */
function loadOperatorReport(orders) {
  const operatorMap = {};

  orders.forEach(o => {
    if (o.status === "COMPLETED" && o.machine) {
      // Track jobs completed on each machine/operator context
      const operator = o.designer || "Unknown";

      if (!operatorMap[operator]) {
        operatorMap[operator] = {
          jobs: 0,
          totalTime: 0,
          holds: 0,
          avgTime: 0
        };
      }

      operatorMap[operator].jobs++;

      // Calculate time if both timestamps exist
      if (o.startTime && o.endTime) {
        try {
          const start = new Date(o.startTime);
          const end = new Date(o.endTime);
          if (!isNaN(start) && !isNaN(end)) {
            const hours = (end - start) / (1000 * 60 * 60);
            operatorMap[operator].totalTime += hours;
          }
        } catch (e) {
          // Skip if date parsing fails
        }
      }

      // Count holds
      if (o.holdReason) {
        operatorMap[operator].holds++;
      }
    }
  });

  // Render Operator Table (clear first to avoid duplicates)
  const operatorBody = document.getElementById("operatorReport");
  operatorBody.innerHTML = "";

  Object.keys(operatorMap).forEach(name => {
    const data = operatorMap[name];
    const avgTime = data.jobs > 0 ? (data.totalTime / data.jobs).toFixed(2) : "0.00";

    const row = operatorBody.insertRow();
    row.insertCell(0).innerText = name;
    row.insertCell(1).innerText = data.jobs;
    row.insertCell(2).innerText = data.totalTime.toFixed(2);
    row.insertCell(3).innerText = avgTime;
    row.insertCell(4).innerText = data.holds;
  });

  // Show message if no data
  if (Object.keys(operatorMap).length === 0) {
    operatorBody.innerHTML = "<tr><td colspan='5'>No completed jobs yet</td></tr>";
  }
}

/* ================= MACHINE LOAD ================= */
function loadMachineReport(orders) {
  const machineMap = {};
  const machineStatus = {};

  orders.forEach(o => {
    if (o.machine) {
      // Count total jobs per machine
      machineMap[o.machine] = (machineMap[o.machine] || 0) + 1;

      // Track current status
      if (!machineStatus[o.machine]) {
        machineStatus[o.machine] = {
          inProgress: 0,
          completed: 0,
          onHold: 0
        };
      }

      if (o.status === "IN PROGRESS") {
        machineStatus[o.machine].inProgress++;
      } else if (o.status === "COMPLETED") {
        machineStatus[o.machine].completed++;
      } else if (o.status === "HOLD") {
        machineStatus[o.machine].onHold++;
      }
    }
  });

  // Render Machine Table (clear first to avoid duplicates)
  const machineBody = document.getElementById("machineReport");
  machineBody.innerHTML = "";

  Object.keys(machineMap).forEach(machine => {
    const row = machineBody.insertRow();
    row.insertCell(0).innerText = machine;
    row.insertCell(1).innerText = machineMap[machine];
    row.insertCell(2).innerText = machineStatus[machine].inProgress;
    row.insertCell(3).innerText = machineStatus[machine].completed;
    row.insertCell(4).innerText = machineStatus[machine].onHold;
  });

  // Show message if no data
  if (Object.keys(machineMap).length === 0) {
    machineBody.innerHTML = "<tr><td colspan='5'>No machine data available</td></tr>";
  }
}

/* =====================
   AUTO-REFRESH EVERY 3 SECONDS
===================== */
setInterval(loadPerformanceReport, 3000);

// Initial load
loadPerformanceReport();
