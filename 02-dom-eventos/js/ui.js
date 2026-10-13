// ============================================================
//  UI — utilidades de interfaz compartidas: toasts y dark mode
// ============================================================

const CLAVE_TEMA = "techstore-tema";
const contenedorToasts = document.querySelector("#toasts");

// Notificación flotante que se autodestruye sola
export function mostrarToast(mensaje, tipo = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast--${tipo}`;
  toast.textContent = mensaje;
  contenedorToasts.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast--saliendo");
    toast.addEventListener("animationend", () => toast.remove());
  }, 2500);
}

export function inicializarDarkMode() {
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
}
