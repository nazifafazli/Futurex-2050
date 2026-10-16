"use strict";

/* FutureX interactions — shared across all six pages */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

document.addEventListener("DOMContentLoaded", () => {
  const nav = $("#siteNav");
  const progress = $("#scrollProgress");
  const backToTop = $("#backToTop");
  const toast = $("#toastMessage");
  let toastTimer;

  // Highlight the current page in navigation.
  const currentFile = location.pathname.split("/").pop() || "index.html";

  $$(".fx-nav .nav-link").forEach((link) => {
    const href = link.getAttribute("href");

    if (href === currentFile) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // Header, scroll progress and back-to-top button.
  const updateScrollUI = () => {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;

    if (progress) {
      progress.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    }

    if (nav) {
      nav.classList.toggle("scrolled", window.scrollY > 24);
    }

    if (backToTop) {
      backToTop.classList.toggle("visible", window.scrollY > 500);
    }
  };

  updateScrollUI();

  window.addEventListener("scroll", updateScrollUI, {
    passive: true,
  });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Reveal elements when they enter the viewport.
  const revealItems = $$(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -25px 0px",
      },
    );

    revealItems.forEach((item) => {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
    });
  }

  // Animated counters.
  const counters = $$("[data-counter]");

  const animateCounter = (node) => {
    if (node.dataset.counted === "true") return;

    node.dataset.counted = "true";

    const end = Number(node.dataset.counter);

    if (!Number.isFinite(end)) return;

    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progressValue = Math.min((now - start) / duration, 1);

      const eased = 1 - Math.pow(1 - progressValue, 3);

      node.textContent = Math.round(end * eased).toLocaleString("en-GB");

      if (progressValue < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.4,
      },
    );

    counters.forEach((counter) => {
      counterObserver.observe(counter);
    });
  } else {
    counters.forEach(animateCounter);
  }

  // Theme toggle.
  const themeToggle = $("#themeToggle");

  const savedTheme = (() => {
    try {
      return localStorage.getItem("futurex-theme");
    } catch {
      return null;
    }
  })();

  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }

  const updateThemeButton = () => {
    if (!themeToggle) return;

    const light = document.body.classList.contains("light-mode");

    themeToggle.innerHTML = light
      ? '<i class="fa-solid fa-moon"></i>'
      : '<i class="fa-solid fa-sun"></i>';

    themeToggle.setAttribute(
      "aria-label",
      light ? "Switch to dark theme" : "Switch to light theme",
    );
  };

  updateThemeButton();

  themeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    try {
      localStorage.setItem(
        "futurex-theme",
        document.body.classList.contains("light-mode") ? "light" : "dark",
      );
    } catch {
      // The theme toggle still works if storage is unavailable.
    }

    updateThemeButton();
  });

  // Close the mobile navigation after selecting a link.
  $$("#mainNav .nav-link, #mainNav .nav-cta").forEach((link) => {
    link.addEventListener("click", () => {
      const menu = $("#mainNav");

      if (menu?.classList.contains("show") && window.bootstrap?.Collapse) {
        window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  // Reusable toast notification.
  const showToast = (message) => {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    window.clearTimeout(toastTimer);

    toastTimer = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  };

  // Image lightbox.
  $$("[data-lightbox]").forEach((tile) => {
    tile.addEventListener("click", () => {
      const src = tile.dataset.lightbox;
      const img = tile.querySelector("img");

      if (!src || !img) return;

      const dialog = document.createElement("dialog");
      dialog.className = "image-dialog";

      dialog.innerHTML =
        '<button class="image-dialog-close" type="button" aria-label="Close image"><i class="fa-solid fa-xmark"></i></button><img alt=""><p></p>';

      $("img", dialog).src = src;
      $("img", dialog).alt = img.alt;
      $("p", dialog).textContent = img.alt;

      document.body.append(dialog);

      const close = () => {
        if (dialog.open) dialog.close();
        dialog.remove();
      };

      $(".image-dialog-close", dialog).addEventListener("click", close);

      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) close();
      });

      dialog.addEventListener("close", () => dialog.remove(), { once: true });

      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
        dialog.style.display = "block";
      }
    });
  });

  // Vision timeline selector.
  const timelineData = {
    2030: {
      eyebrow: "CHAPTER 01 / 03",
      title: "The transition",
      description:
        "Cleaner energy, connected infrastructure and more useful digital tools begin to reshape daily routines.",
      tags: ["Smart grids", "Clean transport", "Digital helpers"],
    },

    2040: {
      eyebrow: "CHAPTER 02 / 03",
      title: "The acceleration",
      description:
        "More shared mobility, adaptive services and collaborative machines become part of the everyday conversation.",
      tags: ["Shared mobility", "Adaptive services", "Helpful robotics"],
    },

    2050: {
      eyebrow: "CHAPTER 03 / 03",
      title: "A new balance",
      description:
        "The most hopeful scenario puts human wellbeing, responsible technology and the living planet at the centre of progress.",
      tags: ["Human-first design", "Circular thinking", "Responsible AI"],
    },
  };

  const timelinePanel = $("#timelinePanel");

  if (timelinePanel) {
    $$("[data-year]").forEach((button) => {
      button.addEventListener("click", () => {
        const data = timelineData[button.dataset.year];

        if (!data) return;

        $$("[data-year]").forEach((item) => {
          const active = item === button;

          item.classList.toggle("active", active);
          item.setAttribute("aria-pressed", String(active));
        });

        const image = $("#timelineImage");

        if (image) image.style.opacity = "0.25";

        window.setTimeout(() => {
          $("#timelineEyebrow").textContent = data.eyebrow;
          $("#timelineTitle").textContent = data.title;
          $("#timelineDescription").textContent = data.description;

          $("#timelineTags").innerHTML = data.tags
            .map((tag) => `<span>${tag}</span>`)
            .join("");

          if (image) {
            image.src = button.dataset.image;
            image.alt = button.dataset.imageAlt || "";

            image.onload = () => {
              image.style.opacity = "1";
            };

            if (image.complete) {
              image.style.opacity = "1";
            }
          }
        }, 160);
      });
    });
  }

  // City filters and live search.
  const cityGrid = $("#cityGrid");

  if (cityGrid) {
    let activeFilter = "all";

    const searchInput = $("#citySearch");

    const updateCities = () => {
      const query = (searchInput?.value || "").trim().toLowerCase();

      let visibleCount = 0;

      $$(".city-item", cityGrid).forEach((card) => {
        const categoryMatches =
          activeFilter === "all" || card.dataset.category === activeFilter;

        const searchMatches =
          !query ||
          `${card.dataset.name} ${card.textContent}`
            .toLowerCase()
            .includes(query);

        const visible = categoryMatches && searchMatches;

        card.classList.toggle("d-none", !visible);

        if (visible) visibleCount += 1;
      });

      $("#emptyCities")?.classList.toggle("d-none", visibleCount !== 0);
    };

    $$("[data-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;

        $$("[data-filter]").forEach((item) => {
          item.classList.toggle("active", item === button);
        });

        updateCities();
      });
    });

    searchInput?.addEventListener("input", updateCities);

    const cityModalElement = $("#cityModal");

    const cityModal =
      cityModalElement && window.bootstrap?.Modal
        ? window.bootstrap.Modal.getOrCreateInstance(cityModalElement)
        : null;

    $$("[data-city-detail]").forEach((button) => {
      button.addEventListener("click", () => {
        $("#cityModalTitle").textContent =
          button.dataset.cityDetail || "District";

        $("#cityModalText").textContent = button.dataset.detail || "";

        if (cityModal) {
          cityModal.show();
        } else {
          showToast(`${button.dataset.cityDetail}: ${button.dataset.detail}`);
        }
      });
    });
  }

  // Mobility simulator. Figures are illustrative estimates.
  const distanceRange = $("#distanceRange");

  if (distanceRange) {
    const modes = {
      car: {
        speed: 35,
        wait: 8,
        co2PerKm: 0.12,
      },
      pod: {
        speed: 55,
        wait: 4,
        co2PerKm: 0.035,
      },
      rail: {
        speed: 180,
        wait: 9,
        co2PerKm: 0.018,
      },
      air: {
        speed: 150,
        wait: 12,
        co2PerKm: 0.09,
      },
    };

    let selectedMode = "car";

    const calculate = () => {
      const distance = Number(distanceRange.value);
      const mode = modes[selectedMode];

      const minutes = Math.max(
        1,
        Math.round((distance / mode.speed) * 60 + mode.wait),
      );

      const emissions = distance * mode.co2PerKm;

      $("#distanceValue").textContent = String(distance);
      $("#journeyTime").textContent = String(minutes);
      $("#co2Value").textContent = emissions.toFixed(1);

      $("#timeTrack").style.width = `${Math.min(100, (minutes / 180) * 100)}%`;

      $("#co2Track").style.width = `${Math.min(100, (emissions / 12) * 100)}%`;
    };

    distanceRange.addEventListener("input", calculate);

    $$("[data-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedMode = button.dataset.mode;

        $$("[data-mode]").forEach((item) => {
          const active = item === button;

          item.classList.toggle("active", active);
          item.setAttribute("aria-pressed", String(active));
        });

        calculate();
      });
    });

    calculate();
  }

  // Technology tabs.
  const techDetails = {
    ai: {
      kicker: "INTELLIGENCE / HUMAN SUPPORT",
      title: "AI that gives time back.",
      description:
        "Personal assistants could help organise information, reduce repetitive tasks and make complex services easier to navigate.",
      question:
        "Who controls the data, and can people understand how a recommendation was made?",
    },

    learning: {
      kicker: "LEARNING / PERSONAL GROWTH",
      title: "Education that adapts.",
      description:
        "Flexible learning tools could offer different explanations and practice paths while keeping teachers and community at the centre.",
      question:
        "Does every learner have fair access, support and a real human connection?",
    },

    robotics: {
      kicker: "ROBOTICS / COLLABORATION",
      title: "Machines that lend a hand.",
      description:
        "Robots may support repetitive or physically demanding tasks, creating more room for care, craft and creative work.",
      question:
        "Who benefits from automation, and how are workers supported through change?",
    },

    energy: {
      kicker: "ENERGY / RESILIENT SYSTEMS",
      title: "Power with less waste.",
      description:
        "Smarter grids and storage could help balance demand and bring renewable energy into more parts of everyday life.",
      question:
        "How can clean energy remain reliable, affordable and available to more communities?",
    },
  };

  const techDetail = $("#techDetail");

  if (techDetail) {
    $$("[data-tech]").forEach((button) => {
      button.addEventListener("click", () => {
        const data = techDetails[button.dataset.tech];

        if (!data) return;

        $$("[data-tech]").forEach((item) => {
          const active = item === button;

          item.classList.toggle("active", active);
          item.setAttribute("aria-selected", String(active));
        });

        const image = $("#techImage");

        image.style.opacity = "0.2";

        window.setTimeout(() => {
          $("#techKicker").textContent = data.kicker;
          $("#techTitle").textContent = data.title;
          $("#techDescription").textContent = data.description;
          $("#techQuestion").textContent = data.question;

          image.src = button.dataset.image;
          image.alt = button.dataset.imageAlt || "";

          image.onload = () => {
            image.style.opacity = "1";
          };

          if (image.complete) {
            image.style.opacity = "1";
          }
        }, 140);
      });
    });
  }

  // Contact form validation and character counter.
  const contactForm = $("#contactForm");

  if (contactForm) {
    const message = $("#message");
    const messageCount = $("#messageCount");
    const successPanel = $("#formSuccess");
    const submitButton = $(".submit-button");

    const updateCount = () => {
      if (messageCount && message) {
        messageCount.textContent = String(message.value.length);
      }
    };

    message?.addEventListener("input", updateCount);
    updateCount();

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      contactForm.classList.add("was-validated");

      if (!contactForm.checkValidity()) {
        const invalid = $(
          ".form-control:invalid, .form-select:invalid, #consent:not(:checked)",
          contactForm,
        );

        invalid?.focus();

        showToast("Please check the highlighted fields.");
        return;
      }

      if (successPanel) {
        successPanel.classList.remove("d-none");
      }

      if (submitButton) {
        submitButton.disabled = true;
      }

      showToast(
        "Your form is complete and ready for a real submission service.",
      );
    });

    $("#editMessage")?.addEventListener("click", () => {
      successPanel?.classList.add("d-none");

      if (submitButton) {
        submitButton.disabled = false;
      }

      $("#fullName")?.focus();
    });

    $("#consent")?.addEventListener("change", () => {
      const feedback = $("#consentFeedback");

      if (feedback) {
        feedback.style.display = "none";
      }
    });
  }

  // Newsletter demo.
  const newsletterForm = $("#newsletterForm");

  newsletterForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = $("#newsletterEmail");
    const feedback = $("#newsletterFeedback");

    if (!email?.checkValidity()) {
      email?.reportValidity();
      return;
    }

    if (feedback) {
      feedback.textContent =
        "Looks good — connect a newsletter provider to activate subscriptions.";
    }

    newsletterForm.reset();
  });

  // Close dialogs with the Escape key.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const openDialog = $("dialog[open]");

      if (openDialog) openDialog.close();
    }
  });

  // Make the toast helper available to other scripts.
  window.FutureX = Object.freeze({
    showToast,
  });
});
