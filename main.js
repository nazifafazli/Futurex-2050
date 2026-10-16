/* =========================================================

   FUTUREX — MAIN JAVASCRIPT

========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  /* ===================== 1. CURRENT YEAR ===================== */

  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* ===================== 2. NAVBAR SCROLL EFFECT ===================== */

  const navbar = document.querySelector(".fx-navbar");

  function updateNavbar() {
    if (!navbar) return;

    if (window.scrollY > 50) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }
  }

  updateNavbar();

  window.addEventListener("scroll", updateNavbar);

  /* ===================== 3. BACK TO TOP ===================== */

  const backTop = document.getElementById("backTop");

  function updateBackTop() {
    if (!backTop) return;

    if (window.scrollY > 350) {
      backTop.classList.add("visible");
    } else {
      backTop.classList.remove("visible");
    }
  }

  updateBackTop();

  window.addEventListener("scroll", updateBackTop);

  if (backTop) {
    backTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,

        behavior: "smooth",
      });
    });
  }

  /* ===================== 4. SCROLL REVEAL ANIMATION ===================== */

  const revealElements = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");

            observer.unobserve(entry.target);
          }
        });
      },

      {
        threshold: 0.12,
      },
    );

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(function (element) {
      element.classList.add("revealed");
    });
  }

  /* ===================== 5. CLOSE MOBILE NAVBAR ===================== */

  const navbarCollapse = document.getElementById("mainNavbar");

  const navbarLinks = document.querySelectorAll(
    "#mainNavbar .nav-link, #mainNavbar .nav-cta",
  );

  if (navbarCollapse && window.bootstrap) {
    const collapseInstance = bootstrap.Collapse.getOrCreateInstance(
      navbarCollapse,
      {
        toggle: false,
      },
    );

    navbarLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (
          window.innerWidth < 992 &&
          navbarCollapse.classList.contains("show")
        ) {
          collapseInstance.hide();
        }
      });
    });
  }

  /* ===================== 6. NEWSLETTER FORM ===================== */

  const newsletterForm = document.getElementById("newsletterForm");

  const newsletterEmail = document.getElementById("newsletterEmail");

  const newsletterMessage = document.getElementById("newsletterMessage");

  if (newsletterForm && newsletterEmail && newsletterMessage) {
    newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();

      newsletterMessage.className = "form-message";

      newsletterMessage.textContent = "";

      if (!newsletterEmail.checkValidity()) {
        newsletterEmail.reportValidity();

        newsletterMessage.textContent = "Please enter a valid email address.";

        newsletterMessage.classList.add("error");

        return;
      }

      newsletterMessage.textContent =
        "Your email is valid! Connect a backend to save your subscription.";

      newsletterMessage.classList.add("success");
    });
  }

  /* ===================== 7. CONTACT FORM ===================== */

  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    const contactMessage = document.getElementById("contactMessage");

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const requiredFields = contactForm.querySelectorAll("[required]");

      let isValid = true;

      requiredFields.forEach(function (field) {
        if (!field.checkValidity()) {
          field.classList.add("is-invalid");

          field.classList.remove("is-valid");

          isValid = false;
        } else {
          field.classList.remove("is-invalid");

          field.classList.add("is-valid");
        }
      });

      if (!isValid) {
        if (contactMessage) {
          contactMessage.textContent =
            "Please complete all required fields correctly.";

          contactMessage.className = "form-message error";
        }

        const firstInvalidField = contactForm.querySelector(":invalid");

        if (firstInvalidField) {
          firstInvalidField.focus();
        }

        return;
      }

      if (contactMessage) {
        contactMessage.textContent =
          "The form is valid, but a backend is needed to send your message.";

        contactMessage.className = "form-message success";
      }
    });

    contactForm
      .querySelectorAll("input, textarea, select")

      .forEach(function (field) {
        field.addEventListener("input", function () {
          if (field.checkValidity()) {
            field.classList.remove("is-invalid");
          }
        });
      });
  }

  /* ===================== 8. UPDATE ACTIVE NAV LINK ===================== */

  const currentPage =
    window.location.pathname

      .split("/")

      .pop() || "index.html";

  document.querySelectorAll(".fx-navbar .nav-link").forEach(function (link) {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.classList.add("active");

      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active");

      link.removeAttribute("aria-current");
    }
  });

  /* ===================== 9. CONSOLE MESSAGE ===================== */

  console.log("FutureX website is ready!");
});
