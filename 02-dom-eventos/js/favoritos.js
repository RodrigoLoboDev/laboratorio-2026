// ============================================================
//  FAVORITOS — estado + persistencia de la wishlist
// ============================================================

import { mostrarToast } from "./ui.js";

const CLAVE_FAVORITOS = "techstore-favoritos";

let favoritos = JSON.parse(localStorage.getItem(CLAVE_FAVORITOS)) || [];

function guardar() {
  localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
}

export function esFavorito(id) {
  return favoritos.includes(id);
}

export function alternarFavorito(producto) {
  const yaEsFavorito = esFavorito(producto.id);

  favoritos = yaEsFavorito
    ? favoritos.filter((id) => id !== producto.id)
    : [...favoritos, producto.id];

  guardar();

  mostrarToast(
    yaEsFavorito ? `Quitado de favoritos: ${producto.nombre}` : `Agregado a favoritos: ${producto.nombre}`,
    "info"
  );
}
