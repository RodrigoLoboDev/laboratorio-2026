// ============================================================
//  CLASE 1 · SELECCIÓN DE ELEMENTOS + EVENTOS BÁSICOS
//  Laboratorio de Programación — 2° año
//  Tecnicatura en Desarrollo de Software
// ============================================================
//
//  Temas:
//    · querySelector / querySelectorAll / getElementById
//    · addEventListener: la forma correcta de escuchar eventos
//    · El objeto Event (e): target, type, preventDefault
//    · Aplicado a la tienda: botones existentes del header y hero
//
//  HTMLz activo: index.html (con las 6 cards estáticas visibles)
//  Script activo: <script type="module" src="01-seleccion-y-eventos.js"></script>
// ============================================================


// ============================================================
//  1. FORMAS DE SELECCIONAR ELEMENTOS
// ============================================================

// getElementById — la más vieja, solo por id, sin el "#"
const contadorCarrito = document.getElementById("contadorCarrito");

// querySelector — devuelve el PRIMER elemento que matchea el selector CSS
const btnVerProductos = document.querySelector("#btnVerProductos");
const primeraCard     = document.querySelector(".card");

// querySelectorAll — devuelve TODOS los elementos que matchean (NodeList)
const todasLasCards = document.querySelectorAll(".card");

console.log("Cantidad de cards en la página:", todasLasCards.length);
console.log("Primera card:", primeraCard);

// Una NodeList se puede recorrer con forEach (no es un Array, pero se parece)
todasLasCards.forEach((card, index) => {
  console.log('ESTE ES EL CARD', card);
  console.log('ESTE ES EL POSICION EN EL ARREGLO', index);
  
  
  // console.log(`Card #${index}:`, card.dataset.id, card.dataset.categoria);
});


// ============================================================
//  2. addEventListener — LA FORMA CORRECTA DE ESCUCHAR EVENTOS
// ============================================================

// Sintaxis: elemento.addEventListener("evento", función)
// La función recibe automáticamente el objeto Event (e) - (ev) - (event).

btnVerProductos.addEventListener("click", function (e) {
  console.log("--- CLICK en 'Ver productos' ---");
  console.log("Tipo de evento:", e.type);          // "click"
  console.log("Elemento clickeado:", e.target);    // el botón
  console.log("Texto del botón:", e.target.textContent.trim());
  e.target.classList.add('nueva-clase');
  e.target.classList.remove('btn');

  // Scroll suave hacia la sección de productos
  document.querySelector("#productos").scrollIntoView({ behavior: "smooth" });
});

// Con arrow function (más común en código moderno)
const btnCarrito = document.querySelector("#btnCarrito");
const funcion_fuera = () => console.log('Desdde fuera');



btnCarrito.addEventListener("click", funcion_fuera);


// ============================================================
//  3. preventDefault — CANCELAR EL COMPORTAMIENTO POR DEFECTO
// ============================================================

// Los links del header por defecto navegan (y hacen "salto" en la página).
// Vamos a interceptarlos para controlar nosotros el scroll.

const linksNav = document.querySelectorAll(".header__link");

linksNav.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault(); // evita el salto brusco del navegador

    const destino = document.querySelector(link.getAttribute("href"));
    destino.scrollIntoView({ behavior: "smooth" });
  });
});


// ============================================================
//  4. UN LISTENER POR CADA CARD (todavía SIN delegación)
// ============================================================
//
//  Esto funciona, pero tiene un problema: si mañana agregamos una
//  card nueva por JS, esta no va a tener el listener puesto acá.
//  Ese problema lo resolvemos en la CLASE 2 con delegación de eventos.

todasLasCards.forEach((card) => {
  const boton = card.querySelector(".btn--agregar");

  boton.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    console.log(`Click en "Agregar" — producto id ${id}`);
  });
});


const submit = document.querySelector('#btnEnviar');

const enviar_formulario = (e) => {
  e.preventDefault()
  console.log('ENVIANDO FORMULARIO');
  const nombre = document.querySelector('#inputNombre');
  const span_nombre = document.querySelector('#errorNombre');
  if(nombre.value == '') {
    nombre.style.border = '1px solid red';
    span_nombre.textContent = 'EL NOMBRE ES OBLIGATORIO';
  } else {
    nombre.style.border = '';
    span_nombre.textContent = '';
  }
  
}

submit.addEventListener('click', enviar_formulario)