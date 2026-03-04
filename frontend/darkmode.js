// ===== DARK MODE =====
const isDark = localStorage.getItem("darkMode");

if (isDark === "on") {
  document.body.classList.add("dark");
}

function toggleDark() {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("darkMode", "on");
  } else {
    localStorage.setItem("darkMode", "off");
  }
}
