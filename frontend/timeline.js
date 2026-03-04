function addTimeline(orderId, stage) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  const index = orders.findIndex(o => o.orderId === orderId || o.jobId === orderId);
  if (index === -1) return;

  if (!orders[index].timeline) {
    orders[index].timeline = [];
  }

  const now = new Date();
  const time =
    now.getFullYear() + "-" +
    String(now.getMonth() + 1).padStart(2, "0") + "-" +
    String(now.getDate()).padStart(2, "0") + " " +
    String(now.getHours()).padStart(2, "0") + ":" +
    String(now.getMinutes()).padStart(2, "0");

  orders[index].timeline.push({ stage, time });

  localStorage.setItem("orders", JSON.stringify(orders));
}
