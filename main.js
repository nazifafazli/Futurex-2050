/* ========================================
   FutureX - Main JavaScript
   ======================================== */

document.addEventListener("DOMContentLoaded", function () {
  // 1. Display the current year in the footer
  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // 2. Show a notification message
  const toastMessage = document.getElementById("toastMessage");
  let toastTimer;

  function showToast(message) {
    if (!toastMessage) return;

    toastMessage.textContent = message;
    toastMessage.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function () {
      toastMessage.classList.remove("show");
    }, 3500);
  }

  // 3. Back to top button
  const backToTop = document.getElementById("backToTop");

  if (backToTop) {
    backToTop.addEventListener("click", function (event) {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // 4. Contact form validation
  const contactForm = document.getElementById("contactForm");
  const contactFeedback = document.getElementById("contactFeedback");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.classList.add("was-validated");

        if (contactFeedback) {
          contactFeedback.textContent =
            "Please complete all required fields correctly.";
        }

        return;
      }

      const name = document.getElementById("contactName");
      const email = document.getElementById("contactEmail");

      if (contactFeedback) {
        contactFeedback.textContent =
          "Thank you, " +
          name.value.trim() +
          "! Your form has been checked successfully.";
      }

      showToast("Your contact form is ready!");

      // This is a demo form.
      // It does not send a message to a real inbox.
      contactForm.reset();
      contactForm.classList.remove("was-validated");
    });
  }

  // 5. Newsletter form
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterEmail = document.getElementById("newsletterEmail");
  const newsletterFeedback = document.getElementById("newsletterFeedback");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!newsletterForm.checkValidity()) {
        newsletterForm.classList.add("was-validated");

        if (newsletterFeedback) {
          newsletterFeedback.textContent =
            "Please enter a valid email address.";
        }

        return;
      }

      if (newsletterFeedback) {
        newsletterFeedback.textContent =
          "Thank you! Your email passed validation.";
      }

      showToast("Newsletter form checked successfully!");

      // This demo does not save emails to a server.
      newsletterForm.reset();
      newsletterForm.classList.remove("was-validated");
    });
  }

  // 6. Smooth scrolling for links that point to page sections
  const sectionLinks = document.querySelectorAll('a[href^="#"]');

  sectionLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        event.preventDefault();

        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // 7. Close the mobile navigation after clicking a page link
  const navbar = document.getElementById("mainNavbar");

  if (navbar && typeof bootstrap !== "undefined") {
    const navbarLinks = navbar.querySelectorAll(".nav-link");

    navbarLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (navbar.classList.contains("show")) {
          const collapse = bootstrap.Collapse.getOrCreateInstance(navbar);
          collapse.hide();
        }
      });
    });
  }

  // 8. Add a small hover effect to cards
  const cards = document.querySelectorAll(
    ".info-card, .feature-card, .signal-card, .city-card, .tech-card",
  );

  cards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      card.style.transition = "transform 0.3s ease";
    });
  });

  // 9. Log a message for development
  console.log("FutureX website is ready!");
});
