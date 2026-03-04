function login() {
  const role = document.getElementById("role").value;
  if (!role) {
    alert("Select role");
    return;
  }
  window.location.href = "/" + role + ".html";
}
