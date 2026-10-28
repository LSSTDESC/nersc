document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.getElementById("pst-primary-sidebar");
  const buttons = document.querySelectorAll(".header-article-items__start .primary-toggle");
  if (!sidebar) return;

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      // Desktop widths only; the theme's modal handles narrow windows
      if (window.matchMedia("(min-width: 992px)").matches) {
        e.preventDefault();
        e.stopImmediatePropagation();
        sidebar.classList.toggle("pst-sidebar-hidden");
      }
    }, true);
  });
});
