// ============================================================
//  TECHSTORE — PROYECTO FINAL
//  Laboratorio de Programación — 2° año
//  Tecnicatura en Desarrollo de Software
// ============================================================
//
//  Este es el resultado de integrar todo lo visto en las clases
//  1 a 8, organizado en un módulo por responsabilidad:
//
//    js/datos.js       -> catálogo de productos
//    js/helpers.js     -> funciones puras (formatearDinero, debounce)
//    js/ui.js          -> toasts + dark mode
//    js/favoritos.js   -> wishlist persistente
//    js/carrito.js     -> carrito persistente
//    js/productos.js   -> render + filtros + búsqueda
//    js/formulario.js  -> validaciones + envío con spinner
//
//  main.js no tiene lógica propia: solo importa y arranca cada
//  módulo. Esta es la misma idea que van a ver en frameworks como
//  React o Vue: componentes/módulos chicos y un punto de entrada.
// ============================================================

import { inicializarCarrito }    from "./js/carrito.js";
import { inicializarProductos }  from "./js/productos.js";
import { inicializarFormulario } from "./js/formulario.js";
import { inicializarDarkMode }   from "./js/ui.js";

inicializarCarrito();     // primero el carrito: productos.js depende de agregarAlCarrito
inicializarProductos();
inicializarFormulario();
inicializarDarkMode();
