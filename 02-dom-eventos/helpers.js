// ============================================================
//  HELPERS — funciones puras reutilizables en varias clases
//  No dependen del DOM: reciben datos, devuelven datos.
// ============================================================

// Formatea un número como moneda argentina: 18000 -> "$18.000,00"
export function formatearDinero(valor) {
  const numero = Number(String(valor).replace(/[^0-9.-]+/g, ""));

  if (isNaN(numero)) return "Valor inválido";

  const formateado = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numero);

  return `$${formateado}`;
}

// Debounce: retrasa la ejecución de una función hasta que pasen
// "espera" ms sin que se la vuelva a llamar. Útil para inputs de
// búsqueda: evita filtrar en CADA tecla presionada.
export function debounce(funcion, espera = 300) {
  let temporizador;

  return function (...argumentos) {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => funcion.apply(this, argumentos), espera);
  };
}
