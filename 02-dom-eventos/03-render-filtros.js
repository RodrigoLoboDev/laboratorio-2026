// ============================================================
//  CLASE 3 · RENDERIZADO DINÁMICO + FILTROS + BÚSQUEDA
//  Laboratorio de Programación — 2° año
//  Tecnicatura en Desarrollo de Software
// ============================================================
//
//  Temas:
//    · Por qué generar el HTML desde datos (array) en vez de escribirlo a mano
//    · template strings + Array.map() para construir HTML
//    · innerHTML para insertar ese HTML en el DOM
//    · Filtrado por categoría (data-categoria)
//    · Búsqueda por texto con debounce
//    · Mostrar/ocultar mensaje de "sin resultados"
//
//  HTML activo: index.html
//  IMPORTANTE: a partir de esta clase, las 6 cards escritas a mano
//  en el HTML quedan obsoletas — este script las reemplaza al cargar.
//  Script activo: <script type="module" src="03-render-filtros.js"></script>
//
//  ARCHIVO DE INICIO: esta clase se escribe en vivo.
// ============================================================


// ============================================================
//  1. LOS DATOS — única fuente de verdad
// ============================================================
//
//  Antes estos 6 productos estaban escritos a mano en el HTML.
//  Ahora viven acá, como datos. Agregar un producto nuevo es
//  agregar un objeto a este array: el HTML se genera solo.

const productos = [
  { id: 1, categoria: "computacion", imagen: "💻", nombre: "Notebook Pro 15\"",       descripcion: "Intel i7 · 16GB RAM · SSD 512GB · Windows 11",       precio: 450000, masVendido: true },
  { id: 2, categoria: "perifericos", imagen: "⌨️", nombre: "Teclado Mecánico RGB",     descripcion: "Switch Blue · Retroiluminado · USB-C",               precio: 35000  },
  { id: 3, categoria: "perifericos", imagen: "🖱️", nombre: "Mouse Inalámbrico",        descripcion: "2.4GHz · 1600 DPI · Batería 12 meses",               precio: 18000,  oferta: true },
  { id: 4, categoria: "computacion", imagen: "🖥️", nombre: "Monitor Full HD 27\"",     descripcion: "1920×1080 · 75Hz · Panel IPS · HDMI + VGA",          precio: 180000 },
  { id: 5, categoria: "audio",       imagen: "🎧", nombre: "Auriculares Bluetooth",    descripcion: "Cancelación de ruido · 30hs batería · Plegable",     precio: 65000  },
  { id: 6, categoria: "audio",       imagen: "🔊", nombre: "Parlante Portátil",        descripcion: "Bluetooth 5.0 · Resistente al agua · 10hs batería",  precio: 28000  },
];

console.log("Productos cargados:", productos);


// ============================================================
//  2. RENDERIZAR — de array de objetos a HTML
// ============================================================

const contenedor        = document.querySelector("#grillaProdutos");
const sinResultados     = document.querySelector("#sinResultados");

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

const getProductos = () => {
  contenedor.innerHTML = productos.map(product => (
    crearCardHTML(product)
  )).join("")
}

document.addEventListener('DOMContentLoaded', getProductos)

// ============================================================
//  3. FILTRO POR CATEGORÍA
// ============================================================

const filtros_contenedor = document.querySelector('.filtros__categorias')




// ============================================================
//  4. BÚSQUEDA CON DEBOUNCE
// ============================================================



// ============================================================
//  5. DELEGACIÓN DE EVENTOS (repaso de la clase 2)
// ============================================================

