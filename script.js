const SUPPORT_EMAIL = "tickets@bcncentralitas.eu";

const form = document.querySelector("#ticket-form");
const status = document.querySelector("#form-status");
const year = document.querySelector("#current-year");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

function buildMailto(formData) {
  const requestType = formData.get("requestType");
  const company = formData.get("company");
  const name = formData.get("name");
  const phone = formData.get("phone");
  const email = formData.get("email");
  const message = formData.get("message");

  const subject = `[Web BCN Centralitas] ${requestType} - ${company}`;
  const body = [
    `Tipo de solicitud: ${requestType}`,
    `Empresa: ${company}`,
    `Persona de contacto: ${name}`,
    `Telefono: ${phone}`,
    `Email: ${email}`,
    "",
    "Detalle de la solicitud:",
    message,
  ].join("\n");

  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const mailtoUrl = buildMailto(formData);

    status.textContent = `Abriendo tu cliente de correo con el ticket preparado para ${SUPPORT_EMAIL}.`;
    status.classList.add("success");
    window.location.href = mailtoUrl;
  });
}
