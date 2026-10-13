// ============================================================
//  CLASE 4 · CARRITO DE COMPRAS
//  Laboratorio de Programación — 2° año
//  Tecnicatura en Desarrollo de Software
// ============================================================
//
//  Este archivo parte de todo lo construido en la clase 3
//  (productos + filtros + búsqueda) y agrega el carrito completo:
//
//  NUEVO EN ESTA CLASE:
//    · Estado del carrito en memoria (array de objetos)
//    · Agregar producto / incrementar cantidad si ya existe
//    · Incrementar y decrementar cantidad desde el carrito
//    · Eliminar un producto del carrito
//    · Vaciar el carrito completo
//    · Calcular subtotal, IVA (21%) y total
//    · Renderizar dinámicamente la lista de items del carrito
//    · Actualizar el contador del ícono 🛒 en el header
//
//  Todavía NO persiste al recargar la página — eso es la clase 5.
//
//  HTML activo: index.html
//  Script activo: <script type="module" src="04-carrito.js"></script>
// ============================================================

import { debounce, formatearDinero } from "./helpers.js";

// ============================================================
//  PRODUCTOS + FILTROS (repaso clase 3)
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

function crearCardHTML(producto) {
  return `
    <article class="card" data-id="${producto.id}" data-categoria="${producto.categoria}">
      ${producto.masVendido ? '<div class="card__badge">Más vendido</div>' : ""}
      ${producto.oferta ? '<div class="card__badge card__badge--oferta">Oferta</div>' : ""}
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

renderizarProductos();

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
//  NUEVO — 1. ESTADO DEL CARRITO
// ============================================================

// El carrito es un array de items. Cada item guarda los datos
// del producto + la cantidad elegida.
const carrito = [];

const listaCarrito   = document.querySelector("#listaCarrito");
const carritoVacio   = document.querySelector("#carritoVacio");
const subtotalEl     = document.querySelector("#subtotal");
const ivaEl          = document.querySelector("#iva");
const totalEl        = document.querySelector("#total");
const contadorEl     = document.querySelector("#contadorCarrito");


// ============================================================
//  NUEVO — 2. AGREGAR AL CARRITO (con delegación, repaso clase 2)
// ============================================================

contenedor.addEventListener("click", (e) => {
  const boton = e.target.closest(".btn--agregar");
  if (!boton) return;

  const id = Number(boton.dataset.id);
  agregarAlCarrito(id);
});

function agregarAlCarrito(id) {
  const itemExistente = carrito.find((item) => item.id === id);

  if (itemExistente) {
    itemExistente.cantidad++;
  } else {
    const producto = productos.find((p) => p.id === id);
    carrito.push({ ...producto, cantidad: 1 });
  }

  renderizarCarrito();
}


// ============================================================
//  NUEVO — 3. INCREMENTAR / DECREMENTAR / ELIMINAR
// ============================================================
//
//  Un solo listener delegado en la lista del carrito maneja
//  los tres botones (+, -, eliminar) de todos los items.

listaCarrito.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);
  if (!id) return;

  if (e.target.matches(".carrito__item-btn--mas")) {
    incrementarCantidad(id);
  } else if (e.target.matches(".carrito__item-btn--menos")) {
    decrementarCantidad(id);
  } else if (e.target.matches(".carrito__item-eliminar")) {
    eliminarDelCarrito(id);
  }
});

function incrementarCantidad(id) {
  const item = carrito.find((i) => i.id === id);
  item.cantidad++;
  renderizarCarrito();
}

function decrementarCantidad(id) {
  const item = carrito.find((i) => i.id === id);
  item.cantidad--;

  if (item.cantidad <= 0) {
    eliminarDelCarrito(id);
    return;
  }
  renderizarCarrito();
}

function eliminarDelCarrito(id) {
  const indice = carrito.findIndex((i) => i.id === id);
  carrito.splice(indice, 1);
  renderizarCarrito();
}

document.querySelector("#btnVaciar").addEventListener("click", () => {
  carrito.length = 0; // vaciar el array sin perder la referencia
  renderizarCarrito();
});

document.querySelector("#btnComprar").addEventListener("click", () => {
  if (carrito.length === 0) return;
  alert("¡Gracias por tu compra! (esto se reemplaza por algo mejor en la clase 6: toasts)");
  carrito.length = 0;
  renderizarCarrito();
});


// ============================================================
//  NUEVO — 4. CÁLCULOS: SUBTOTAL, IVA, TOTAL
// ============================================================

function calcularSubtotal() {
  return carrito.reduce((acumulado, item) => acumulado + item.precio * item.cantidad, 0);
}

function calcularIVA(subtotal) {
  return subtotal * 0.21;
}


// ============================================================
//  NUEVO — 5. RENDERIZAR EL CARRITO
// ============================================================

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
  // Lista de items
  if (carrito.length === 0) {
    listaCarrito.innerHTML = "";
    listaCarrito.appendChild(carritoVacio);
    carritoVacio.classList.remove("oculto");
  } else {
    carritoVacio.classList.add("oculto");
    listaCarrito.innerHTML = carrito.map(crearItemCarritoHTML).join("");
  }

  // Totales
  const subtotal = calcularSubtotal();
  const iva      = calcularIVA(subtotal);
  const total    = subtotal + iva;

  subtotalEl.textContent = formatearDinero(subtotal);
  ivaEl.textContent      = formatearDinero(iva);
  totalEl.textContent    = formatearDinero(total);

  // Contador del ícono en el header (suma de cantidades, no de items distintos)
  const cantidadTotal = carrito.reduce((acumulado, item) => acumulado + item.cantidad, 0);
  contadorEl.textContent = cantidadTotal;
}

renderizarCarrito(); // estado inicial: carrito vacío
