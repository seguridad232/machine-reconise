const SUPPORT_EMAIL = "tickets@bcncentralitas.eu";

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const yearNodes = document.querySelectorAll("[data-current-year]");
const pageKey = document.body.dataset.page;
const form = document.querySelector("#contact-form");
const statusNode = document.querySelector("#form-status");

yearNodes.forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

if (pageKey) {
  document.querySelectorAll(".main-nav a[data-page]").forEach((link) => {
    if (link.dataset.page === pageKey) {
      link.classList.add("is-active");
    }
  });
}

if (menuToggle && header && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function buildMailto(formData) {
  const requestType = formData.get("requestType");
  const company = formData.get("company");
  const name = formData.get("name");
  const phone = formData.get("phone");
  const email = formData.get("email");
  const teamSize = formData.get("teamSize");
  const message = formData.get("message");

  const subject = `[BCN Centralitas] ${requestType} - ${company}`;
  const body = [
    `Tipo de solicitud: ${requestType}`,
    `Empresa: ${company}`,
    `Contacto: ${name}`,
    `Telefono: ${phone}`,
    `Email: ${email}`,
    `Tamano del equipo: ${teamSize}`,
    "",
    "Necesidad del cliente:",
    message,
  ].join("\n");

  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

if (form && statusNode) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    statusNode.textContent = `Abriendo tu cliente de correo para enviar la solicitud a ${SUPPORT_EMAIL}.`;
    statusNode.classList.add("success");
    window.location.href = buildMailto(formData);
  });
}
