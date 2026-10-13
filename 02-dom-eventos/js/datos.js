// ============================================================
//  DATOS — catálogo de productos
//  Única fuente de verdad: agregar/editar productos se hace acá,
//  no tocando HTML.
// ============================================================

export const productos = [
  { id: 1, categoria: "computacion", imagen: "💻", nombre: "Notebook Pro 15\"",    descripcion: "Intel i7 · 16GB RAM · SSD 512GB · Windows 11",      precio: 450000, masVendido: true },
  { id: 2, categoria: "perifericos", imagen: "⌨️", nombre: "Teclado Mecánico RGB",  descripcion: "Switch Blue · Retroiluminado · USB-C",              precio: 35000  },
  { id: 3, categoria: "perifericos", imagen: "🖱️", nombre: "Mouse Inalámbrico",     descripcion: "2.4GHz · 1600 DPI · Batería 12 meses",              precio: 18000,  oferta: true },
  { id: 4, categoria: "computacion", imagen: "🖥️", nombre: "Monitor Full HD 27\"",  descripcion: "1920×1080 · 75Hz · Panel IPS · HDMI + VGA",         precio: 180000 },
  { id: 5, categoria: "audio",       imagen: "🎧", nombre: "Auriculares Bluetooth", descripcion: "Cancelación de ruido · 30hs batería · Plegable",    precio: 65000  },
  { id: 6, categoria: "audio",       imagen: "🔊", nombre: "Parlante Portátil",     descripcion: "Bluetooth 5.0 · Resistente al agua · 10hs batería", precio: 28000  },
];
