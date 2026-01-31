(function () {
  // Mobile menu toggle
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        if (nav.classList.contains("open")) {
          nav.classList.remove("open");
          menuBtn.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  // Accordion helper (single-open style)
  function setupAccordion(rootId) {
    const root = document.getElementById(rootId);
    if (!root) return;

    const buttons = Array.from(root.querySelectorAll(".acc-btn"));

    function closeAll(exceptBtn) {
      buttons.forEach((btn) => {
        const panel = btn.parentElement?.querySelector(".acc-panel");
        if (!panel) return;

        if (btn !== exceptBtn) {
          btn.setAttribute("aria-expanded", "false");
          panel.hidden = true;
        }
      });
    }

    buttons.forEach((btn) => {
      const panel = btn.parentElement?.querySelector(".acc-panel");
      if (!panel) return;

      // Ensure initial state
      btn.setAttribute("aria-expanded", "false");
      panel.hidden = true;

      btn.addEventListener("click", () => {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        closeAll(btn);

        btn.setAttribute("aria-expanded", String(!expanded));
        panel.hidden = expanded;
      });
    });
  }

  setupAccordion("skillsAcc");
  setupAccordion("evidenceAcc");

  // Scroll-spy: highlight nav link for visible section
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".nav a[data-section]"));

  function setActive(id) {
    navLinks.forEach((a) => {
      const match = a.getAttribute("data-section") === id;
      a.classList.toggle("active", match);
    });
  }

  const spy = new IntersectionObserver(
    (entries) => {
      // Find the most visible section
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

      if (visible?.target?.id) setActive(visible.target.id);
    },
    { root: null, threshold: [0.2, 0.35, 0.5, 0.65] }
  );

  sections.forEach((s) => spy.observe(s));

  // Contact form validation (demo)
  const form = document.getElementById("form");
  if (!form) return;

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const msg = document.getElementById("msg");

  const nameErr = document.getElementById("nameErr");
  const emailErr = document.getElementById("emailErr");
  const msgErr = document.getElementById("msgErr");
  const status = document.getElementById("status");

  function validEmail(x) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(x).trim());
  }
  function setErr(el, text) {
    el.textContent = text;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (status) status.textContent = "";
    setErr(nameErr, "");
    setErr(emailErr, "");
    setErr(msgErr, "");

    let ok = true;

    if (name.value.trim().length < 2) {
      setErr(nameErr, "Please enter a valid name (minimum 2 characters).");
      ok = false;
    }
    if (!validEmail(email.value)) {
      setErr(emailErr, "Please enter a valid email address (e.g., user@example.com).");
      ok = false;
    }
    if (msg.value.trim().length < 12) {
      setErr(msgErr, "Message must be at least 12 characters for coursework validation.");
      ok = false;
    }

    if (!ok) return;

    if (status) status.textContent = "Validated successfully (demo only).";
    form.reset();
  });
})();
