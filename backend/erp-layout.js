// Sidebar navigation
document.querySelectorAll(".nav a").forEach(link => {
  link.onclick = () => {
    document.querySelectorAll(".nav a").forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    const target = link.dataset.target;
    document.querySelectorAll(".section").forEach(sec => {
      sec.classList.remove("active");
      if (sec.id === target) sec.classList.add("active");
    });
  };
});

// Dark mode toggle
const toggle = document.getElementById("darkToggle");
const savedMode = localStorage.getItem("erp-dark");

if (savedMode === "true") document.body.classList.add("dark");

toggle.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("erp-dark", document.body.classList.contains("dark"));
};
