// ============================================================
//  CARRITO — estado, persistencia y render de la sección carrito
// ============================================================

import { formatearDinero } from "./helpers.js";
import { mostrarToast } from "./ui.js";

const CLAVE_CARRITO = "techstore-carrito";

let carrito = JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];

const listaCarrito = document.querySelector("#listaCarrito");
const carritoVacio = document.querySelector("#carritoVacio");
const subtotalEl   = document.querySelector("#subtotal");
const ivaEl        = document.querySelector("#iva");
const totalEl      = document.querySelector("#total");
const contadorEl   = document.querySelector("#contadorCarrito");

function guardar() {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

export function agregarAlCarrito(producto) {
  const itemExistente = carrito.find((item) => item.id === producto.id);

  if (itemExistente) itemExistente.cantidad++;
  else carrito.push({ ...producto, cantidad: 1 });

  guardar();
  renderizar();
  mostrarToast(`Agregado al carrito: ${producto.nombre}`, "exito");
}

function incrementarCantidad(id) {
  carrito.find((i) => i.id === id).cantidad++;
  guardar();
  renderizar();
}

function decrementarCantidad(id) {
  const item = carrito.find((i) => i.id === id);
  item.cantidad--;
  if (item.cantidad <= 0) return eliminar(id);
  guardar();
  renderizar();
}

function eliminar(id) {
  carrito.splice(carrito.findIndex((i) => i.id === id), 1);
  guardar();
  renderizar();
}

function crearItemHTML(item) {
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

function renderizar() {
  if (carrito.length === 0) {
    listaCarrito.innerHTML = "";
    listaCarrito.appendChild(carritoVacio);
    carritoVacio.classList.remove("oculto");
  } else {
    carritoVacio.classList.add("oculto");
    listaCarrito.innerHTML = carrito.map(crearItemHTML).join("");
  }

  const subtotal = carrito.reduce((acumulado, item) => acumulado + item.precio * item.cantidad, 0);
  const iva = subtotal * 0.21;

  subtotalEl.textContent = formatearDinero(subtotal);
  ivaEl.textContent      = formatearDinero(iva);
  totalEl.textContent    = formatearDinero(subtotal + iva);
  contadorEl.textContent = carrito.reduce((acumulado, item) => acumulado + item.cantidad, 0);
}

export function inicializarCarrito() {
  listaCarrito.addEventListener("click", (e) => {
    const id = Number(e.target.dataset.id);
    if (!id) return;

    if (e.target.matches(".carrito__item-btn--mas")) incrementarCantidad(id);
    else if (e.target.matches(".carrito__item-btn--menos")) decrementarCantidad(id);
    else if (e.target.matches(".carrito__item-eliminar")) eliminar(id);
  });

  document.querySelector("#btnVaciar").addEventListener("click", () => {
    carrito = [];
    guardar();
    renderizar();
    mostrarToast("Carrito vaciado", "info");
  });

  document.querySelector("#btnComprar").addEventListener("click", () => {
    if (carrito.length === 0) return;
    mostrarToast("¡Gracias por tu compra!", "exito");
    carrito = [];
    guardar();
    renderizar();
  });

  renderizar();
}
