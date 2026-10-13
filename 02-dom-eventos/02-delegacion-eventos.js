// ============================================================
//  CLASE 2 · EVENTOS DE MOUSE/TECLADO + DELEGACIÓN DE EVENTOS
//  Laboratorio de Programación — 2° año
//  Tecnicatura en Desarrollo de Software
// ============================================================
//
//  Temas:
//    · Eventos de mouse: mouseenter, mouseleave
//    · Eventos de teclado: keydown, keyup, input
//    · Delegación de eventos (event delegation): por qué y cómo
//    · closest() para encontrar el ancestro correcto
//
//  HTML activo: index.html (con las 6 cards estáticas visibles)
//  Script activo: <script type="module" src="02-delegacion-eventos.js"></script>
// ============================================================


// ============================================================
//  1. EVENTOS DE MOUSE
// ============================================================

const primeraCard = document.querySelector(".card");

// mouseenter / mouseleave — entrar y salir con el mouse
// (a diferencia de mouseover/mouseout, NO se disparan por los hijos)
primeraCard.addEventListener("mouseenter", () => {
  console.log("El mouse entró a la primera card");
});

primeraCard.addEventListener("mouseleave", () => {
  console.log("El mouse salió de la primera card");
});

// ============================================================
//  2. EVENTOS DE TECLADO
// ============================================================

const inputBusqueda = document.querySelector("#inputBusqueda");

// keydown — se dispara al PRESIONAR una tecla (antes de que aparezca el carácter)
// inputBusqueda.addEventListener("keydown", (e) => {
//   console.log("Tecla presionada:", e.key);

//   if (e.key === "Enter") {
//     console.log("El usuario apretó Enter en la búsqueda");
//   }
// });

// input — se dispara cada vez que CAMBIA el valor (tipear, pegar, borrar)
// Es el evento correcto para "reaccionar mientras el usuario escribe".
inputBusqueda.addEventListener("input", (e) => {
  console.log("Valor actual del input:", e.target.value);
});


// ============================================================
//  3. ¿POR QUÉ DELEGACIÓN DE EVENTOS?
// ============================================================
//
//  En la clase pasada pusimos un listener por cada botón ".btn--agregar".
//  Problema: si el HTML se genera dinámicamente (clase 3), los botones
//  nuevos NO tendrían el listener, porque no existían cuando corrió el forEach.
//
//  Solución: aprovechamos que los eventos "burbujean" (bubbling) desde
//  el elemento clickeado hacia sus ancestros. Ponemos UN SOLO listener
//  en el contenedor padre y detectamos qué se clickeó con e.target.

const contenedor = document.querySelector("#grillaProdutos");

contenedor.addEventListener("click", (e) => {
  // closest() busca el ancestro más cercano que matchee el selector,
  // empezando por el propio e.target. Es clave cuando el click puede
  // caer en un <span> o <svg> DENTRO del botón, no en el botón mismo.
  // console.log("target:", e.target);              // dónde se hizo click
  // console.log("currentTarget:", e.currentTarget); // siempre la grilla
  
  const boton = e.target.closest(".btn--agregar");
  // console.log(boton);
  
  // return;
  // Si el click fue en cualquier otra parte de la card, boton es null
  if (!boton) return;

  // return

  const id = boton.dataset.id;
  console.log(`(delegación) Click en "Agregar" — producto id ${id}`);
});

// Esta MISMA lógica es la que vamos a usar en la clase 4 para el carrito,
// y funciona sin importar cuántas cards haya ni cómo se hayan creado.



// const lista_productos = document.querySelectorAll('.card');
// // console.log(lista_productos);

// lista_productos.forEach( producto => {
//   const btn = producto.querySelector('.btn--agregar')
//   // console.log(btn);
//   btn.addEventListener('click', (e) => {
//     console.log('Producto N:', e.target.dataset.id);
    
//   })
// } )