const SUPPORT_EMAIL = "tickets@bcncentralitas.eu";
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".main-nav a[data-page]");
const years = document.querySelectorAll("[data-current-year]");
const form = document.querySelector("#contact-form");
const status = document.querySelector("#form-status");
const page = document.body.dataset.page;

years.forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

navLinks.forEach((link) => {
  if (link.dataset.page === page) {
    link.classList.add("is-active");
  }
});

if (menuToggle && header) {
  menuToggle.addEventListener("click", () => {
    const open = header.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
}

function buildMailto(formData) {
  const requestType = formData.get("requestType") || "Consulta";
  const company = formData.get("company") || "";
  const name = formData.get("name") || "";
  const email = formData.get("email") || "";
  const phone = formData.get("phone") || "";
  const teamSize = formData.get("teamSize") || "";
  const schedule = formData.get("schedule") || "";
  const message = formData.get("message") || "";

  const subject = `[BCN Centralitas] ${requestType} - ${company}`;
  const body = [
    `Tipo de solicitud: ${requestType}`,
    `Empresa: ${company}`,
    `Contacto: ${name}`,
    `Email: ${email}`,
    `Telefono: ${phone}`,
    `Tamano del equipo: ${teamSize}`,
    `Horario de atencion: ${schedule}`,
    "",
    "Detalle de la solicitud:",
    message,
  ].join("\n");

  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

if (form && status) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const mailtoUrl = buildMailto(new FormData(form));
    status.textContent = `Abriendo tu correo para enviar la solicitud a ${SUPPORT_EMAIL}.`;
    status.classList.add("success");
    window.location.href = mailtoUrl;
  });
}
