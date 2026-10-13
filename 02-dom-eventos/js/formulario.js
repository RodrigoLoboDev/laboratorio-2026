// ============================================================
//  FORMULARIO — validaciones + envío simulado con spinner
// ============================================================

import { mostrarToast } from "./ui.js";

const LARGO_MAX_MENSAJE = 300;
const LARGO_MIN_MENSAJE = 10;
const REGEX_NOMBRE = /^[a-zA-ZÀ-ÿ\s]{3,60}$/;
const REGEX_EMAIL  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function enviarAlServidor(datos) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Datos \"enviados\":", datos);
      resolve({ ok: true });
    }, 1800);
  });
}

export function inicializarFormulario() {
  const form = document.querySelector("#formContacto");

  const campos = {
    nombre:  document.querySelector("#inputNombre"),
    email:   document.querySelector("#inputEmail"),
    asunto:  document.querySelector("#inputAsunto"),
    mensaje: document.querySelector("#inputMensaje"),
  };

  const errores = {
    nombre:  document.querySelector("#errorNombre"),
    email:   document.querySelector("#errorEmail"),
    asunto:  document.querySelector("#errorAsunto"),
    mensaje: document.querySelector("#errorMensaje"),
  };

  const contadorMensaje = document.querySelector("#contadorMensaje");
  const mensajeExito    = document.querySelector("#mensajeExito");
  const btnEnviar       = document.querySelector("#btnEnviar");
  const spinnerEnviar   = document.querySelector("#spinnerEnviar");
  const textoBtnEnviar  = document.querySelector("#textoBtnEnviar");

  const validadores = {
    nombre: () => {
      const valor = campos.nombre.value.trim();
      if (valor === "") return "El nombre es obligatorio.";
      if (!REGEX_NOMBRE.test(valor)) return "Ingresá solo letras (3 a 60 caracteres).";
      return "";
    },
    email: () => {
      const valor = campos.email.value.trim();
      if (valor === "") return "El correo es obligatorio.";
      if (!REGEX_EMAIL.test(valor)) return "Ingresá un correo válido (ej: nombre@mail.com).";
      return "";
    },
    asunto: () => (campos.asunto.value === "" ? "Seleccioná un asunto." : ""),
    mensaje: () => {
      const valor = campos.mensaje.value.trim();
      if (valor === "") return "El mensaje es obligatorio.";
      if (valor.length < LARGO_MIN_MENSAJE) return `Escribí al menos ${LARGO_MIN_MENSAJE} caracteres.`;
      if (valor.length > LARGO_MAX_MENSAJE) return `Superaste el máximo de ${LARGO_MAX_MENSAJE} caracteres.`;
      return "";
    },
  };

  function validarCampo(nombreCampo) {
    const mensajeError = validadores[nombreCampo]();
    campos[nombreCampo].classList.toggle("error", mensajeError !== "");
    campos[nombreCampo].classList.toggle("valido", mensajeError === "");
    errores[nombreCampo].textContent = mensajeError;
    return mensajeError === "";
  }

  function validarFormularioCompleto() {
    return Object.keys(validadores).map(validarCampo).every(Boolean);
  }

  function mostrarSpinner(mostrar) {
    spinnerEnviar.classList.toggle("oculto", !mostrar);
    textoBtnEnviar.classList.toggle("oculto", mostrar);
    btnEnviar.disabled = mostrar;
  }

  campos.nombre.addEventListener("input", () => validarCampo("nombre"));
  campos.email.addEventListener("input", () => validarCampo("email"));
  campos.asunto.addEventListener("change", () => validarCampo("asunto"));
  campos.mensaje.addEventListener("input", () => {
    validarCampo("mensaje");
    contadorMensaje.textContent = `${campos.mensaje.value.length} / ${LARGO_MAX_MENSAJE}`;
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validarFormularioCompleto()) return;

    const datos = {
      nombre: campos.nombre.value.trim(),
      email: campos.email.value.trim(),
      asunto: campos.asunto.value,
      mensaje: campos.mensaje.value.trim(),
    };

    mostrarSpinner(true);

    try {
      await enviarAlServidor(datos);
      mensajeExito.classList.remove("oculto");
      mostrarToast("Mensaje enviado correctamente", "exito");
      form.reset();
      contadorMensaje.textContent = `0 / ${LARGO_MAX_MENSAJE}`;
      Object.values(campos).forEach((input) => input.classList.remove("error", "valido"));
    } catch (error) {
      mostrarToast("No se pudo enviar el mensaje. Probá de nuevo.", "error");
    } finally {
      mostrarSpinner(false);
    }
  });
}
