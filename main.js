/* =====================================================
   FUTUREX — LIFE IN 2050
   Main JavaScript
===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  // ---------- 1. CURRENT YEAR ----------

  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // ---------- 2. BACK TO TOP BUTTON ----------

  const backToTop = document.getElementById("backToTop");

  if (backToTop) {
    function updateBackToTop() {
      if (window.scrollY > 350) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    }

    window.addEventListener("scroll", updateBackToTop, {
      passive: true,
    });

    updateBackToTop();

    backToTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // ---------- 3. MOBILE NAVIGATION ----------

  const navLinks = document.querySelectorAll(".future-navbar .nav-link");

  const navbarCollapse = document.getElementById("futureNavbar");

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (
        navbarCollapse &&
        navbarCollapse.classList.contains("show") &&
        window.bootstrap
      ) {
        const collapseInstance =
          window.bootstrap.Collapse.getOrCreateInstance(navbarCollapse);

        collapseInstance.hide();
      }
    });
  });

  // ---------- 4. TOAST MESSAGE ----------

  const toastMessage = document.getElementById("toastMessage");

  let toastTimeout;

  function showToast(message) {
    if (!toastMessage) {
      return;
    }

    toastMessage.textContent = message;
    toastMessage.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(function () {
      toastMessage.classList.remove("show");
    }, 3500);
  }

  // ---------- 5. NEWSLETTER FORM ----------

  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterEmail = document.getElementById("newsletterEmail");
  const newsletterFeedback = document.getElementById("newsletterFeedback");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!newsletterForm.checkValidity()) {
        newsletterForm.reportValidity();
        return;
      }

      const email = newsletterEmail ? newsletterEmail.value.trim() : "";

      if (!email) {
        if (newsletterFeedback) {
          newsletterFeedback.textContent = "Please enter your email address.";

          newsletterFeedback.classList.add("error");
        }

        return;
      }

      if (newsletterFeedback) {
        newsletterFeedback.textContent =
          "Your email looks valid. Newsletter subscription is not connected yet.";

        newsletterFeedback.classList.remove("error");
      }

      showToast(
        "Demo only: newsletter subscription is not connected to a server yet.",
      );

      newsletterForm.reset();
    });
  }

  // ---------- 6. CONTACT FORM ----------

  const contactForm = document.getElementById("contactForm");
  const contactFeedback = document.getElementById("contactFeedback");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const nameField = document.getElementById("contactName");
      const emailField = document.getElementById("contactEmail");
      const subjectField = document.getElementById("contactSubject");
      const messageField = document.getElementById("contactMessage");

      const name = nameField ? nameField.value.trim() : "";
      const email = emailField ? emailField.value.trim() : "";
      const subject = subjectField ? subjectField.value : "";
      const message = messageField ? messageField.value.trim() : "";

      if (!name || !email || !subject || !message) {
        if (contactFeedback) {
          contactFeedback.textContent = "Please complete all fields.";

          contactFeedback.classList.add("error");
        }

        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        if (contactFeedback) {
          contactFeedback.textContent = "Please enter a valid email address.";

          contactFeedback.classList.add("error");
        }

        if (emailField) {
          emailField.focus();
        }

        return;
      }

      const recipient = "hello@futurex.example";

      const emailSubject = encodeURIComponent("FutureX Contact: " + subject);

      const emailBody = encodeURIComponent(
        "Name: " +
          name +
          "\n" +
          "Email: " +
          email +
          "\n" +
          "Subject: " +
          subject +
          "\n\n" +
          "Message:\n" +
          message,
      );

      if (contactFeedback) {
        contactFeedback.textContent =
          "Your message is prepared. Choose your email app to continue.";

        contactFeedback.classList.remove("error");
      }

      showToast("Opening your email app. Review the message before sending.");

      window.location.href =
        "mailto:" +
        recipient +
        "?subject=" +
        emailSubject +
        "&body=" +
        emailBody;
    });
  }

  // ---------- 7. SMOOTH SCROLL FOR PAGE LINKS ----------

  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

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

  // ---------- 8. CARD HOVER SUPPORT ----------

  const hoverCards = document.querySelectorAll(
    ".future-card, .vision-info-card, .value-card, " +
      ".city-feature-card, .city-day-card, " +
      ".mobility-card, .mobility-option-card",
  );

  hoverCards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      card.classList.add("is-hovered");
    });

    card.addEventListener("mouseleave", function () {
      card.classList.remove("is-hovered");
    });
  });

  // ---------- 9. IMAGE LOADING FALLBACK ----------

  const pageImages = document.querySelectorAll("img");

  pageImages.forEach(function (img) {
    img.addEventListener("error", function () {
      img.classList.add("image-error");
      img.style.opacity = "0.35";
    });
  });

  // ---------- 10. PAGE READY ----------

  document.body.classList.add("page-loaded");

  console.log("FutureX website is ready.");
});
