document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("navbar-container").innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div class="container-fluid">
        <a href="index.html" class="navbar-brand">Questify</a>
        <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <div class="navbar-nav ms-auto">
            <a href="Quiz.html" class="nav-item nav-link">Quiz</a>
            <a href="profile.html" class="nav-item nav-link">Profile</a>
            <a href="login.html" class="nav-item nav-link">Sign In</a>
            <a href="register.html" class="nav-item nav-link">Sign Up</a>
          </div>
        </div>
      </div>
    </nav>
  `;

  document.getElementById("footer-container").innerHTML = `
    <footer class="footer bg-dark text-white text-center py-3">
      <div class="container">
        <p>© 2025 Questify. All rights reserved. Contact us: <a href="mailto:cherednyk.kostiantyn@lll.kpi.ua" class="text-white">cherednyk.kostiantyn@lll.kpi.ua</a></p>
      </div>
    </footer>
  `;

  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".navbar-nav a");

  navLinks.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  const model = new UserModel();
  const view = new UserView();
  const controller = new UserController(model, view);
  controller.init();
});