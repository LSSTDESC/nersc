document.addEventListener("DOMContentLoaded", function () {
  const btn = document.createElement("button");
  btn.textContent = "☰";
  btn.title = "Toggle sidebar";
  btn.className = "sidebar-toggle";
  btn.onclick = () => document.body.classList.toggle("sidebar-hidden");
  document.body.appendChild(btn);
});
