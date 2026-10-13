// ============================================================
//  CLASE 8 · SPINNER + ENVÍO ASÍNCRONO + CIERRE
//  Laboratorio de Programación — 2° año
//  Tecnicatura en Desarrollo de Software
// ============================================================
//
//  Última clase de la progresión: acá se junta TODO lo construido
//  en las clases 1 a 7 en un solo archivo, y se agrega lo último
//  que faltaba: simular una petición real al enviar el formulario.
//
//  NUEVO EN ESTA CLASE:
//    · async/await y Promise (aunque no haya un servidor real)
//    · Spinner de SpinKit (https://tobiasahlin.com/spinkit/) mientras
//      se "envía" el formulario
//    · Deshabilitar el botón durante el envío (evitar doble-click)
//    · Manejo de errores con try/catch/finally
//
//  Después de esta clase, el PRÓXIMO paso es reorganizar este mismo
//  código en módulos separados (carpeta js/) — eso es main.js,
//  el proyecto final.
//
//  HTML activo: index.html
//  Script activo: <script type="module" src="08-spinner-y-cierre.js"></script>
// ============================================================

import { debounce, formatearDinero } from "./helpers.js";

// ============================================================
//  PRODUCTOS + FILTROS + FAVORITOS (repaso clases 3, 4, 5, 6)
// ============================================================

const productos = [
  { id: 1, categoria: "computacion", imagen: "💻", nombre: "Notebook Pro 15\"",       descripcion: "Intel i7 · 16GB RAM · SSD 512GB · Windows 11",       precio: 450000, masVendido: true },
  { id: 2, categoria: "perifericos", imagen: "⌨️", nombre: "Teclado Mecánico RGB",     descripcion: "Switch Blue · Retroiluminado · USB-C",               precio: 35000  },
  { id: 3, categoria: "perifericos", imagen: "🖱️", nombre: "Mouse Inalámbrico",        descripcion: "2.4GHz · 1600 DPI · Batería 12 meses",               precio: 18000,  oferta: true },
  { id: 4, categoria: "computacion", imagen: "🖥️", nombre: "Monitor Full HD 27\"",     descripcion: "1920×1080 · 75Hz · Panel IPS · HDMI + VGA",          precio: 180000 },
  { id: 5, categoria: "audio",       imagen: "🎧", nombre: "Auriculares Bluetooth",    descripcion: "Cancelación de ruido · 30hs batería · Plegable",     precio: 65000  },
  { id: 6, categoria: "audio",       imagen: "🔊", nombre: "Parlante Portátil",        descripcion: "Bluetooth 5.0 · Resistente al agua · 10hs batería",  precio: 28000  },
];

const estado = { categoria: "todos", busqueda: "" };
const CLAVE_CARRITO   = "techstore-carrito";
const CLAVE_FAVORITOS = "techstore-favoritos";
const CLAVE_TEMA      = "techstore-tema";

const contenedor        = document.querySelector("#grillaProdutos");
const sinResultados     = document.querySelector("#sinResultados");
const contadorProductos = document.querySelector("#contadorProductos");
const contenedorToasts  = document.querySelector("#toasts");

let carrito   = JSON.parse(localStorage.getItem(CLAVE_CARRITO))   || [];
let favoritos = JSON.parse(localStorage.getItem(CLAVE_FAVORITOS)) || [];

function crearCardHTML(producto) {
  const esFavorito = favoritos.includes(producto.id);
  return `
    <article class="card" data-id="${producto.id}" data-categoria="${producto.categoria}">
      ${producto.masVendido ? '<div class="card__badge">Más vendido</div>' : ""}
      ${producto.oferta ? '<div class="card__badge card__badge--oferta">Oferta</div>' : ""}
      <button class="card__favorito ${esFavorito ? "activo" : ""}" data-id="${producto.id}" title="Favorito">
        ${esFavorito ? "♥" : "♡"}
      </button>
      <div class="card__imagen">${producto.imagen}</div>
      <div class="card__cuerpo">
        <span class="card__categoria">${producto.categoria}</span>
        <h3 class="card__nombre">${producto.nombre}</h3>
        <p class="card__descripcion">${producto.descripcion}</p>
        <div class="card__footer">
          <span class="card__precio" data-precio="${producto.precio}">${"$" + producto.precio.toLocaleString("es-AR")}</span>
          <button class="btn btn--agregar" data-id="${producto.id}">Agregar</button>
        </div>
      </div>
    </article>
  `;
}

function obtenerProductosFiltrados() {
  return productos.filter((producto) => {
    const coincideCategoria = estado.categoria === "todos" || producto.categoria === estado.categoria;
    const coincideBusqueda = producto.nombre.toLowerCase().includes(estado.busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });
}

function renderizarProductos() {
  const filtrados = obtenerProductosFiltrados();
  contenedor.innerHTML = filtrados.map(crearCardHTML).join("");
  contadorProductos.textContent = `Mostrando ${filtrados.length} producto${filtrados.length === 1 ? "" : "s"}`;
  sinResultados.classList.toggle("oculto", filtrados.length > 0);
}

document.querySelectorAll(".filtros__btn").forEach((boton) => {
  boton.addEventListener("click", () => {
    document.querySelectorAll(".filtros__btn").forEach((b) => b.classList.remove("activo"));
    boton.classList.add("activo");
    estado.categoria = boton.dataset.categoria;
    renderizarProductos();
  });
});

document.querySelector("#inputBusqueda").addEventListener("input", debounce((e) => {
  estado.busqueda = e.target.value;
  renderizarProductos();
}, 300));

function mostrarToast(mensaje, tipo = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast--${tipo}`;
  toast.textContent = mensaje;
  contenedorToasts.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast--saliendo");
    toast.addEventListener("animationend", () => toast.remove());
  }, 2500);
}

function alternarFavorito(id) {
  const yaEsFavorito = favoritos.includes(id);
  favoritos = yaEsFavorito ? favoritos.filter((favId) => favId !== id) : [...favoritos, id];
  localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));

  const producto = productos.find((p) => p.id === id);
  mostrarToast(yaEsFavorito ? `Quitado de favoritos: ${producto.nombre}` : `Agregado a favoritos: ${producto.nombre}`, "info");
  renderizarProductos();
}

contenedor.addEventListener("click", (e) => {
  const botonAgregar = e.target.closest(".btn--agregar");
  if (botonAgregar) return agregarAlCarrito(Number(botonAgregar.dataset.id));

  const botonFavorito = e.target.closest(".card__favorito");
  if (botonFavorito) alternarFavorito(Number(botonFavorito.dataset.id));
});

renderizarProductos();


// ============================================================
//  CARRITO (repaso clases 4, 5 y 6)
// ============================================================

const listaCarrito = document.querySelector("#listaCarrito");
const carritoVacio = document.querySelector("#carritoVacio");
const subtotalEl   = document.querySelector("#subtotal");
const ivaEl        = document.querySelector("#iva");
const totalEl      = document.querySelector("#total");
const contadorEl   = document.querySelector("#contadorCarrito");

function guardarCarrito() {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function agregarAlCarrito(id) {
  const itemExistente = carrito.find((item) => item.id === id);
  const producto = productos.find((p) => p.id === id);

  if (itemExistente) itemExistente.cantidad++;
  else carrito.push({ ...producto, cantidad: 1 });

  guardarCarrito();
  renderizarCarrito();
  mostrarToast(`Agregado al carrito: ${producto.nombre}`, "exito");
}

listaCarrito.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);
  if (!id) return;

  if (e.target.matches(".carrito__item-btn--mas")) incrementarCantidad(id);
  else if (e.target.matches(".carrito__item-btn--menos")) decrementarCantidad(id);
  else if (e.target.matches(".carrito__item-eliminar")) eliminarDelCarrito(id);
});

function incrementarCantidad(id) {
  carrito.find((i) => i.id === id).cantidad++;
  guardarCarrito();
  renderizarCarrito();
}

function decrementarCantidad(id) {
  const item = carrito.find((i) => i.id === id);
  item.cantidad--;
  if (item.cantidad <= 0) return eliminarDelCarrito(id);
  guardarCarrito();
  renderizarCarrito();
}

function eliminarDelCarrito(id) {
  carrito.splice(carrito.findIndex((i) => i.id === id), 1);
  guardarCarrito();
  renderizarCarrito();
}

document.querySelector("#btnVaciar").addEventListener("click", () => {
  carrito = [];
  guardarCarrito();
  renderizarCarrito();
  mostrarToast("Carrito vaciado", "info");
});

document.querySelector("#btnComprar").addEventListener("click", () => {
  if (carrito.length === 0) return;
  mostrarToast("¡Gracias por tu compra!", "exito");
  carrito = [];
  guardarCarrito();
  renderizarCarrito();
});

function crearItemCarritoHTML(item) {
  return `
    <div class="carrito__item" data-id="${item.id}">
      <span class="carrito__item-emoji">${item.imagen}</span>
      <div class="carrito__item-info">
        <p class="carrito__item-nombre">${item.nombre}</p>
        <p class="carrito__item-precio">${formatearDinero(item.precio)} c/u</p>
      </div>
      <div class="carrito__item-controles">
        <button class="carrito__item-btn carrito__item-btn--menos" data-id="${item.id}">−</button>
        <span class="carrito__item-cantidad">${item.cantidad}</span>
        <button class="carrito__item-btn carrito__item-btn--mas" data-id="${item.id}">+</button>
        <button class="carrito__item-eliminar" data-id="${item.id}" title="Eliminar">🗑️</button>
      </div>
    </div>
  `;
}

function renderizarCarrito() {
  if (carrito.length === 0) {
    listaCarrito.innerHTML = "";
    listaCarrito.appendChild(carritoVacio);
    carritoVacio.classList.remove("oculto");
  } else {
    carritoVacio.classList.add("oculto");
    listaCarrito.innerHTML = carrito.map(crearItemCarritoHTML).join("");
  }

  const subtotal = carrito.reduce((acumulado, item) => acumulado + item.precio * item.cantidad, 0);
  const iva = subtotal * 0.21;

  subtotalEl.textContent = formatearDinero(subtotal);
  ivaEl.textContent      = formatearDinero(iva);
  totalEl.textContent    = formatearDinero(subtotal + iva);
  contadorEl.textContent = carrito.reduce((acumulado, item) => acumulado + item.cantidad, 0);
}

renderizarCarrito();


// ============================================================
//  DARK MODE (repaso clase 6)
// ============================================================

const btnDark = document.querySelector("#btn-dark");

function aplicarTema(tema) {
  document.body.classList.toggle("dark", tema === "oscuro");
  btnDark.textContent = tema === "oscuro" ? "☀️ Modo claro" : "🌙 Modo oscuro";
}

aplicarTema(localStorage.getItem(CLAVE_TEMA) || "claro");

btnDark.addEventListener("click", () => {
  const temaNuevo = document.body.classList.contains("dark") ? "claro" : "oscuro";
  localStorage.setItem(CLAVE_TEMA, temaNuevo);
  aplicarTema(temaNuevo);
});


// ============================================================
//  FORMULARIO (repaso clase 7) + NUEVO: SPINNER Y ENVÍO ASYNC
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
const btnEnviar       = document.querySelector("#btnEnviar");
const spinnerEnviar   = document.querySelector("#spinnerEnviar");
const textoBtnEnviar  = document.querySelector("#textoBtnEnviar");

const LARGO_MAX_MENSAJE = 300;
const LARGO_MIN_MENSAJE = 10;
const REGEX_NOMBRE = /^[a-zA-ZÀ-ÿ\s]{3,60}$/;
const REGEX_EMAIL  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

campos.nombre.addEventListener("input", () => validarCampo("nombre"));
campos.email.addEventListener("input", () => validarCampo("email"));
campos.asunto.addEventListener("change", () => validarCampo("asunto"));
campos.mensaje.addEventListener("input", () => {
  validarCampo("mensaje");
  contadorMensaje.textContent = `${campos.mensaje.value.length} / ${LARGO_MAX_MENSAJE}`;
});

// ------------------------------------------------------------
//  NUEVO: simulamos una petición a un servidor con una Promise.
//  En un proyecto real, acá iría un fetch() a una API.
// ------------------------------------------------------------
function enviarFormularioAlServidor(datos) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Datos \"enviados\":", datos);
      resolve({ ok: true });
    }, 1800); // simulamos latencia de red
  });
}

function mostrarSpinner(mostrar) {
  spinnerEnviar.classList.toggle("oculto", !mostrar);
  textoBtnEnviar.classList.toggle("oculto", mostrar);
  btnEnviar.disabled = mostrar;
}

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
    await enviarFormularioAlServidor(datos);

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
