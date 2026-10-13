// ============================================================
//  PRODUCTOS — render dinámico, filtros y búsqueda
// ============================================================

import { productos } from "./datos.js";
import { debounce } from "./helpers.js";
import { esFavorito, alternarFavorito } from "./favoritos.js";
import { agregarAlCarrito } from "./carrito.js";

const estado = { categoria: "todos", busqueda: "" };

const contenedor        = document.querySelector("#grillaProdutos");
const sinResultados     = document.querySelector("#sinResultados");
const contadorProductos = document.querySelector("#contadorProductos");

function crearCardHTML(producto) {
  const favorito = esFavorito(producto.id);

  return `
    <article class="card" data-id="${producto.id}" data-categoria="${producto.categoria}">
      ${producto.masVendido ? '<div class="card__badge">Más vendido</div>' : ""}
      ${producto.oferta ? '<div class="card__badge card__badge--oferta">Oferta</div>' : ""}
      <button class="card__favorito ${favorito ? "activo" : ""}" data-id="${producto.id}" title="Favorito">
        ${favorito ? "♥" : "♡"}
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

function obtenerFiltrados() {
  return productos.filter((producto) => {
    const coincideCategoria = estado.categoria === "todos" || producto.categoria === estado.categoria;
    const coincideBusqueda = producto.nombre.toLowerCase().includes(estado.busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });
}

function renderizar() {
  const filtrados = obtenerFiltrados();
  contenedor.innerHTML = filtrados.map(crearCardHTML).join("");
  contadorProductos.textContent = `Mostrando ${filtrados.length} producto${filtrados.length === 1 ? "" : "s"}`;
  sinResultados.classList.toggle("oculto", filtrados.length > 0);
}

export function inicializarProductos() {
  document.querySelectorAll(".filtros__btn").forEach((boton) => {
    boton.addEventListener("click", () => {
      document.querySelectorAll(".filtros__btn").forEach((b) => b.classList.remove("activo"));
      boton.classList.add("activo");
      estado.categoria = boton.dataset.categoria;
      renderizar();
    });
  });

  document.querySelector("#inputBusqueda").addEventListener("input", debounce((e) => {
    estado.busqueda = e.target.value;
    renderizar();
  }, 300));

  // Delegación: agregar al carrito y marcar favorito conviven en el mismo listener
  contenedor.addEventListener("click", (e) => {
    const botonAgregar = e.target.closest(".btn--agregar");
    if (botonAgregar) {
      const producto = productos.find((p) => p.id === Number(botonAgregar.dataset.id));
      agregarAlCarrito(producto);
      return;
    }

    const botonFavorito = e.target.closest(".card__favorito");
    if (botonFavorito) {
      const producto = productos.find((p) => p.id === Number(botonFavorito.dataset.id));
      alternarFavorito(producto);
      renderizar(); // repintar para reflejar el corazón actualizado
    }
  });

  renderizar();
}
