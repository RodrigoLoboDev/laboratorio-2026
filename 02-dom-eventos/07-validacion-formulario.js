// ============================================================
//  CLASE 7 · VALIDACIÓN DE FORMULARIOS
//  Laboratorio de Programación — 2° año
//  Tecnicatura en Desarrollo de Software
// ============================================================
//
//  Temas:
//    · Validar campos en tiempo real (evento "input" / "blur")
//    · Expresiones regulares (regex) para nombre y email
//    · Mostrar/ocultar mensajes de error por campo
//    · Contador de caracteres en vivo (textarea)
//    · Prevenir el submit si el formulario no es válido
//    · novalidate: apagamos la validación nativa del navegador
//      para controlar nosotros los mensajes y el estilo
//
//  Este archivo se enfoca SOLO en el formulario de contacto.
//  El envío con spinner (simulando una petición real) es la clase 8.
//
//  HTML activo: index.html
//  Script activo: <script type="module" src="07-validacion-formulario.js"></script>
// ============================================================

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

const LARGO_MAX_MENSAJE = 300;
const LARGO_MIN_MENSAJE = 10;

// Regex simple pero suficiente para una clase: letras (con acentos) y espacios
const REGEX_NOMBRE = /^[a-zA-ZÀ-ÿ\s]{3,60}$/;

// Regex de email: algo@algo.algo — no es 100% RFC, pero cubre los casos reales
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


// ============================================================
//  1. VALIDADORES — una función por campo, devuelve el mensaje
//     de error (string) o "" si el campo es válido
// ============================================================

function validarNombre() {
  const valor = campos.nombre.value.trim();

  if (valor === "") return "El nombre es obligatorio.";
  if (!REGEX_NOMBRE.test(valor)) return "Ingresá solo letras (3 a 60 caracteres).";
  return "";
}

function validarEmail() {
  const valor = campos.email.value.trim();

  if (valor === "") return "El correo es obligatorio.";
  if (!REGEX_EMAIL.test(valor)) return "Ingresá un correo válido (ej: nombre@mail.com).";
  return "";
}

function validarAsunto() {
  if (campos.asunto.value === "") return "Seleccioná un asunto.";
  return "";
}

function validarMensaje() {
  const valor = campos.mensaje.value.trim();

  if (valor === "") return "El mensaje es obligatorio.";
  if (valor.length < LARGO_MIN_MENSAJE) return `Escribí al menos ${LARGO_MIN_MENSAJE} caracteres.`;
  if (valor.length > LARGO_MAX_MENSAJE) return `Superaste el máximo de ${LARGO_MAX_MENSAJE} caracteres.`;
  return "";
}

const validadores = {
  nombre: validarNombre,
  email: validarEmail,
  asunto: validarAsunto,
  mensaje: validarMensaje,
};


// ============================================================
//  2. PINTAR EL RESULTADO DE UNA VALIDACIÓN EN EL DOM
// ============================================================

function validarCampo(nombreCampo) {
  const mensajeError = validadores[nombreCampo]();
  const input = campos[nombreCampo];
  const spanError = errores[nombreCampo];

  spanError.textContent = mensajeError;
  input.classList.toggle("error", mensajeError !== "");
  input.classList.toggle("valido", mensajeError === "");

  return mensajeError === ""; // true si es válido
}

function validarFormularioCompleto() {
  // Validamos TODOS los campos (aunque el usuario no los haya tocado)
  // y devolvemos true solo si TODOS son válidos.
  const resultados = Object.keys(validadores).map(validarCampo);
  return resultados.every((esValido) => esValido);
}


// ============================================================
//  3. VALIDACIÓN EN TIEMPO REAL (mientras el usuario escribe)
// ============================================================

campos.nombre.addEventListener("input", () => validarCampo("nombre"));
campos.email.addEventListener("input", () => validarCampo("email"));
campos.asunto.addEventListener("change", () => validarCampo("asunto"));
campos.mensaje.addEventListener("input", () => {
  validarCampo("mensaje");
  actualizarContadorMensaje();
});

function actualizarContadorMensaje() {
  const largoActual = campos.mensaje.value.length;
  contadorMensaje.textContent = `${largoActual} / ${LARGO_MAX_MENSAJE}`;
  contadorMensaje.style.color = largoActual > LARGO_MAX_MENSAJE ? "var(--color-error)" : "";
}


// ============================================================
//  4. SUBMIT — bloquear el envío si algo no es válido
// ============================================================

form.addEventListener("submit", (e) => {
  e.preventDefault(); // frenamos el envío real del navegador SIEMPRE

  const formularioValido = validarFormularioCompleto();
  if (!formularioValido) {
    console.log("Formulario con errores, no se envía.");
    return;
  }

  // Acá, en la clase 8, vamos a agregar el spinner y simular el
  // envío real con un delay. Por ahora, mostramos éxito directo.
  mensajeExito.classList.remove("oculto");
  form.reset();
  contadorMensaje.textContent = `0 / ${LARGO_MAX_MENSAJE}`;

  // Limpiamos los estados visuales de validación
  Object.values(campos).forEach((input) => input.classList.remove("error", "valido"));
});
