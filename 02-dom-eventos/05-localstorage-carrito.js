// ============================================================
//  CLASE 5 · localStorage + PERSISTENCIA DEL CARRITO
//  Laboratorio de Programación — 2° año
//  Tecnicatura en Desarrollo de Software
// ============================================================
//
//  Este archivo parte de todo lo construido en la clase 4
//  (productos + filtros + búsqueda + carrito completo) y agrega:
//
//  NUEVO EN ESTA CLASE:
//    · Qué es localStorage y su API: setItem, getItem, removeItem
//    · Por qué solo guarda strings (y cómo guardar objetos con JSON)
//    · Guardar el carrito cada vez que cambia
//    · Recuperar el carrito al cargar la página (persistencia real)
//
//  HTML activo: index.html
//  Script activo: <script type="module" src="05-localstorage-carrito.js"></script>
// ============================================================

import { debounce, formatearDinero } from "./helpers.js";

// ============================================================
//  NUEVO — 1. ¿QUÉ ES localStorage?
// ============================================================
//
//  localStorage guarda datos como pares clave-valor en el navegador,
//  de forma PERSISTENTE: sobreviven a recargar la página, cerrar la
//  pestaña e incluso reiniciar la computadora.
//
//  Características clave:
//    · Solo guarda STRINGS (si guardás un objeto, hay que convertirlo)
//    · ~5MB de capacidad por dominio
//    · Es del navegador, no se envía al servidor (a diferencia de cookies)
//    · Es síncrono: no usa callbacks ni promesas

// setItem(clave, valor) — guardar
localStorage.setItem("demoClase5", "hola");

// getItem(clave) — leer (devuelve null si no existe)
console.log("Demo guardada:", localStorage.getItem("demoClase5"));
console.log("Clave inexistente:", localStorage.getItem("no-existe")); // null

// removeItem(clave) — eliminar una clave puntual
localStorage.removeItem("demoClase5");

// Para guardar un OBJETO o ARRAY hay que convertirlo a texto con JSON.stringify,
// y al leerlo, convertirlo de vuelta con JSON.parse:
const ejemploObjeto = { nombre: "Ana", edad: 20 };
localStorage.setItem("ejemplo", JSON.stringify(ejemploObjeto));

const leido = JSON.parse(localStorage.getItem("ejemplo"));
console.log("Objeto recuperado:", leido, "— edad:", leido.edad);

localStorage.removeItem("ejemplo"); // limpiamos la demo


// ============================================================
//  PRODUCTOS + FILTROS (repaso clases 3 y 4)
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
//  CARRITO — ahora persistente
// ============================================================

const CLAVE_CARRITO = "techstore-carrito";

// NUEVO: en vez de empezar siempre vacío, intentamos recuperar
// lo que haya guardado de una visita anterior.
function cargarCarrito() {
  const guardado = localStorage.getItem(CLAVE_CARRITO);
  return guardado ? JSON.parse(guardado) : [];
}

// NUEVO: convertir el carrito a JSON y guardarlo.
// La llamamos después de CUALQUIER cambio en el carrito.
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

contenedor.addEventListener("click", (e) => {
  const boton = e.target.closest(".btn--agregar");
  if (!boton) return;
  agregarAlCarrito(Number(boton.dataset.id));
});

function agregarAlCarrito(id) {
  const itemExistente = carrito.find((item) => item.id === id);

  if (itemExistente) {
    itemExistente.cantidad++;
  } else {
    const producto = productos.find((p) => p.id === id);
    carrito.push({ ...producto, cantidad: 1 });
  }

  guardarCarrito();     // <- NUEVO: persistimos en cada cambio
  renderizarCarrito();
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

  if (item.cantidad <= 0) {
    eliminarDelCarrito(id);
    return;
  }
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
});

document.querySelector("#btnComprar").addEventListener("click", () => {
  if (carrito.length === 0) return;
  alert("¡Gracias por tu compra!");
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

// Al cargar la página, si había un carrito guardado, se ve inmediatamente.
// Probalo: agregá productos, recargá la página (F5) y van a seguir ahí.
renderizarCarrito();
