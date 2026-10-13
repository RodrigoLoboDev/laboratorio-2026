// ============================================================
//  CLASE 6 · FAVORITOS + TOASTS + DARK MODE PERSISTENTE
//  Laboratorio de Programación — 2° año
//  Tecnicatura en Desarrollo de Software
// ============================================================
//
//  Este archivo parte de todo lo construido en la clase 5
//  (productos + filtros + búsqueda + carrito persistente) y agrega:
//
//  NUEVO EN ESTA CLASE:
//    · Favoritos/wishlist: botón ♡ en cada card, persistente aparte del carrito
//    · Sistema de toasts: notificaciones flotantes que aparecen y se
//      autodestruyen solas (setTimeout + removeChild)
//    · Dark mode: toggle de clase en <body> + persistencia en localStorage
//
//  HTML activo: index.html
//  Script activo: <script type="module" src="06-favoritos-toasts-darkmode.js"></script>
// ============================================================

import { debounce, formatearDinero } from "./helpers.js";

// ============================================================
//  PRODUCTOS + FILTROS (repaso clases 3, 4 y 5)
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

const contenedor        = document.querySelector("#grillaProdutos");
const sinResultados     = document.querySelector("#sinResultados");
const contadorProductos = document.querySelector("#contadorProductos");

// NUEVO: la card ahora incluye el botón de favorito (♡ / ♥)
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
          <span class="card__precio" data-precio="${producto.precio}">
            ${"$" + producto.precio.toLocaleString("es-AR")}
          </span>
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

const filtrarPorBusqueda = debounce((valor) => {
  estado.busqueda = valor;
  renderizarProductos();
}, 300);

document.querySelector("#inputBusqueda").addEventListener("input", (e) => {
  filtrarPorBusqueda(e.target.value);
});


// ============================================================
//  NUEVO — 1. FAVORITOS / WISHLIST
// ============================================================

const CLAVE_FAVORITOS = "techstore-favoritos";

function cargarFavoritos() {
  const guardado = localStorage.getItem(CLAVE_FAVORITOS);
  return guardado ? JSON.parse(guardado) : [];
}

function guardarFavoritos() {
  localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
}

let favoritos = cargarFavoritos();

function alternarFavorito(id) {
  const yaEsFavorito = favoritos.includes(id);

  if (yaEsFavorito) {
    favoritos = favoritos.filter((favoritoId) => favoritoId !== id);
  } else {
    favoritos.push(id);
  }

  guardarFavoritos();

  const producto = productos.find((p) => p.id === id);
  mostrarToast(
    yaEsFavorito ? `Quitado de favoritos: ${producto.nombre}` : `Agregado a favoritos: ${producto.nombre}`,
    yaEsFavorito ? "info" : "exito"
  );

  renderizarProductos(); // para repintar el corazón
}

// Delegación: un solo listener para "Agregar al carrito" Y "favorito"
contenedor.addEventListener("click", (e) => {
  const botonAgregar = e.target.closest(".btn--agregar");
  if (botonAgregar) {
    agregarAlCarrito(Number(botonAgregar.dataset.id));
    return;
  }

  const botonFavorito = e.target.closest(".card__favorito");
  if (botonFavorito) {
    alternarFavorito(Number(botonFavorito.dataset.id));
  }
});

renderizarProductos(); // primer render (ya con favoritos aplicados)


// ============================================================
//  NUEVO — 2. TOASTS (notificaciones flotantes)
// ============================================================

const contenedorToasts = document.querySelector("#toasts");

function mostrarToast(mensaje, tipo = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast--${tipo}`;
  toast.textContent = mensaje;

  contenedorToasts.appendChild(toast);

  // Después de 2.5s disparamos la animación de salida...
  setTimeout(() => {
    toast.classList.add("toast--saliendo");
    // ...y cuando termina la animación (250ms), lo sacamos del DOM.
    toast.addEventListener("animationend", () => toast.remove());
  }, 2500);
}


// ============================================================
//  CARRITO (repaso clase 5, ahora con toasts en vez de alert)
// ============================================================

const CLAVE_CARRITO = "techstore-carrito";

function cargarCarrito() {
  const guardado = localStorage.getItem(CLAVE_CARRITO);
  return guardado ? JSON.parse(guardado) : [];
}

function guardarCarrito() {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

let carrito = cargarCarrito();

const listaCarrito = document.querySelector("#listaCarrito");
const carritoVacio = document.querySelector("#carritoVacio");
const subtotalEl   = document.querySelector("#subtotal");
const ivaEl        = document.querySelector("#iva");
const totalEl      = document.querySelector("#total");
const contadorEl   = document.querySelector("#contadorCarrito");

function agregarAlCarrito(id) {
  const itemExistente = carrito.find((item) => item.id === id);
  const producto = productos.find((p) => p.id === id);

  if (itemExistente) {
    itemExistente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  guardarCarrito();
  renderizarCarrito();
  mostrarToast(`Agregado al carrito: ${producto.nombre}`, "exito"); // NUEVO: toast en vez de console.log
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
  const indice = carrito.findIndex((i) => i.id === id);
  carrito.splice(indice, 1);
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

function calcularSubtotal() {
  return carrito.reduce((acumulado, item) => acumulado + item.precio * item.cantidad, 0);
}

function calcularIVA(subtotal) {
  return subtotal * 0.21;
}

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

  const subtotal = calcularSubtotal();
  const iva      = calcularIVA(subtotal);
  const total    = subtotal + iva;

  subtotalEl.textContent = formatearDinero(subtotal);
  ivaEl.textContent      = formatearDinero(iva);
  totalEl.textContent    = formatearDinero(total);

  const cantidadTotal = carrito.reduce((acumulado, item) => acumulado + item.cantidad, 0);
  contadorEl.textContent = cantidadTotal;
}

renderizarCarrito();


// ============================================================
//  NUEVO — 3. DARK MODE PERSISTENTE
// ============================================================

const CLAVE_TEMA = "techstore-tema";
const btnDark = document.querySelector("#btn-dark");

function aplicarTema(tema) {
  document.body.classList.toggle("dark", tema === "oscuro");
  btnDark.textContent = tema === "oscuro" ? "☀️ Modo claro" : "🌙 Modo oscuro";
}

// Al cargar la página, respetamos la preferencia guardada (o "claro" por defecto)
const temaGuardado = localStorage.getItem(CLAVE_TEMA) || "claro";
aplicarTema(temaGuardado);

btnDark.addEventListener("click", () => {
  const temaActual = localStorage.getItem(CLAVE_TEMA) || "claro";
  const temaNuevo = temaActual === "oscuro" ? "claro" : "oscuro";

  localStorage.setItem(CLAVE_TEMA, temaNuevo);
  aplicarTema(temaNuevo);
});
