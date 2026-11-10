(function () {
  const KEY = "sidebar-collapsed";
  const wide = () => window.matchMedia("(min-width: 992px)").matches;

  function saved() {
    try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; }
  }
  function save(v) {
    try { localStorage.setItem(KEY, v ? "1" : "0"); } catch (e) {}
  }

  // Runs immediately (script is in <head>) to avoid a flash of the sidebar
  if (saved() && wide()) document.documentElement.classList.add("sidebar-collapsed");

  document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("pst-primary-sidebar");
    if (!sidebar) return;

    if (saved() && wide()) sidebar.classList.add("pst-sidebar-hidden");

    document
      .querySelectorAll(".header-article-items__start .primary-toggle")
      .forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          if (!wide()) return;           // narrow windows: theme's own dialog
          e.preventDefault();
          e.stopImmediatePropagation();
          const hidden = sidebar.classList.toggle("pst-sidebar-hidden");
          document.documentElement.classList.toggle("sidebar-collapsed", hidden);
          save(hidden);
        }, true);
      });
  });
})();
