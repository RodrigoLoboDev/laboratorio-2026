// ============================================================
//  HELPERS — funciones puras reutilizables
//  No dependen del DOM: reciben datos, devuelven datos.
// ============================================================

export function formatearDinero(valor) {
  const numero = Number(String(valor).replace(/[^0-9.-]+/g, ""));
  if (isNaN(numero)) return "Valor inválido";

  const formateado = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numero);

  return `$${formateado}`;
}

export function debounce(funcion, espera = 300) {
  let temporizador;
  return function (...argumentos) {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => funcion.apply(this, argumentos), espera);
  };
}
