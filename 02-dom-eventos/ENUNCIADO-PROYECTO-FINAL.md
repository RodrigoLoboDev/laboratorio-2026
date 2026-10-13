# Proyecto final — Laboratorio de Programación (2° año)

**Tecnicatura en Desarrollo de Software**
**Tema:** DOM Scripting con JavaScript puro

---

## 1. Consigna

Cada alumno debe desarrollar **de forma individual** una aplicación web de tipo
**catálogo con carrito**, usando únicamente **HTML, CSS y JavaScript puro**
(sin frameworks ni librerías de JS), aplicando todo lo visto en clase con el
proyecto TechStore.

**El rubro es de elección propia** (indumentaria, libros, comida, juegos,
repuestos, etc.). **No se acepta TechStore ni su temática**: el proyecto debe
tener datos, diseño e identidad propios.

---

## 2. Requisitos obligatorios

El proyecto debe incluir **todo** lo siguiente:

### 2.1 Datos y renderizado (Clase 3)
- Los productos deben estar en un **array de objetos** en un archivo propio
  (por ejemplo `datos.js`). **Mínimo 8 productos**, con al menos
  `id`, `nombre`, `precio`, `categoria` e imagen.
- Las cards **no se escriben a mano en el HTML**: se generan desde el array con
  `map()` y template strings.
- **Filtro por categoría** (mínimo 3 categorías).
- **Búsqueda por texto** con *debounce*.
- Mensaje de **"sin resultados"** cuando ningún producto coincide.

### 2.2 Eventos y delegación (Clases 1 y 2)
- Selección de elementos con `querySelector` / `querySelectorAll`.
- Uso de **delegación de eventos** (un solo listener en el contenedor, con
  `e.target.closest(...)`) para los botones de las cards y del carrito.
- Uso de atributos `data-*` y `dataset`.
- Uso correcto de `preventDefault()` donde corresponda.

### 2.3 Carrito (Clase 4)
- Agregar productos, **aumentar y disminuir cantidad**, y **eliminar** ítems.
- Si el producto ya está en el carrito, se incrementa la cantidad (no se duplica).
- **Total** y **contador de ítems** actualizados en pantalla.
- Mensaje de carrito vacío.

### 2.4 Persistencia (Clase 5)
- El carrito se guarda en **`localStorage`** y se recupera al recargar la página.
- Manejo de datos corruptos o inexistentes con `try/catch`.

### 2.5 Extras de interfaz (Clase 6)
- **Favoritos** persistentes.
- **Notificaciones tipo toast** (al agregar, quitar, etc.).
- **Modo oscuro** que recuerde la preferencia del usuario.

### 2.6 Formulario validado (Clase 7)
- Formulario de **checkout o contacto** con al menos 4 campos (por ejemplo:
  nombre, email, teléfono, mensaje/dirección).
- Validación en JavaScript, con **mensajes de error por campo** y sin recargar
  la página (`preventDefault()` en `submit`).
- Al enviarse correctamente, se informa al usuario y se vacía el carrito.

### 2.7 Cierre y organización (Clase 8)
- Indicador de **carga (spinner)** simulado al iniciar o al confirmar la compra.
- Código **modularizado con ES Modules** (`import` / `export`): un `main.js`
  y una carpeta `js/` con archivos separados por responsabilidad
  (datos, productos, carrito, favoritos, formulario, helpers, ui).

---

## 3. Requisitos de calidad del código

- Nombres de variables y funciones **claros y en un mismo idioma**.
- Sin código repetido: lo que se usa más de una vez va en una función.
- Sin código comentado sin uso ni `console.log` de depuración.
- Uso de `const` / `let` (no `var`).
- Estructura de carpetas ordenada (`index.html`, `css/`, `js/`, `img/`).
- La página debe verse correctamente en **escritorio y celular** (responsive).
- El proyecto debe abrirse con **Live Server** sin errores en consola.

---

## 4. Entrega (repositorio en GitHub)

1. Crear un **repositorio público** en GitHub con el proyecto.
2. Incluir un **`README.md`** con: nombre del proyecto, rubro elegido,
   funcionalidades y cómo ejecutarlo.
3. Hacer **commits frecuentes y con mensajes descriptivos** (no un único
   commit con todo el proyecto). Se revisará el historial.
4. Enviar el **link del repositorio** al docente por el medio acordado.

---

## 5. Proceso de aprobación previa

**Para rendir la materia, el proyecto debe estar aprobado antes de la defensa oral.**

1. **Entrega para revisión:** el alumno envía el link del repositorio.
2. **Corrección:** el docente revisa y devuelve las **observaciones**
   (correcciones obligatorias y sugerencias).
3. **Reentrega:** el alumno corrige y vuelve a enviar (nuevos commits en el
   mismo repositorio). Se puede repetir este ciclo las veces necesarias dentro
   del plazo.
4. **Aprobación:** cuando el docente confirma que el proyecto cumple todos los
   requisitos, el alumno queda **habilitado para rendir**.
5. **Defensa oral** (ver punto 6).

> ⚠️ **Sin proyecto aprobado no se puede rendir.** No se aceptan entregas
> el mismo día de la defensa.

Fechas (completar):
- Primera entrega para revisión: `__ / __ / ____`
- Última fecha de reentrega: `__ / __ / ____`
- Defensas orales: `__ / __ / ____`

---

## 6. Defensa oral

Es **individual** y dura aproximadamente 15 minutos. Consta de:

1. **Demostración:** el alumno muestra la aplicación funcionando y recorre
   todas las funcionalidades.
2. **Explicación del código:** el docente elige partes del proyecto y el alumno
   explica **qué hace cada línea y por qué lo resolvió así** (por ejemplo:
   delegación de eventos, `map`, `localStorage`, validación, módulos).
3. **Modificación en vivo:** el docente pide un cambio pequeño (agregar un
   campo, un filtro, cambiar un comportamiento) y el alumno lo implementa en el
   momento.

### Criterios de evaluación

| Criterio | Qué se evalúa |
|---|---|
| Cumplimiento del enunciado | Están todos los requisitos de la sección 2 y funcionan |
| Calidad del código | Orden, nombres claros, modularización, sin repetición |
| Comprensión | Explica su código con sus palabras y justifica decisiones |
| Autonomía | Resuelve la modificación en vivo |
| Originalidad | Proyecto propio, no copia de TechStore ni de otro compañero |

---

## 7. Condiciones y causas de desaprobación

- El proyecto **no fue aprobado antes** de la fecha de defensa.
- El alumno **no puede explicar** el código que entregó.
- Se detecta **copia total o parcial** de otro proyecto (incluido TechStore o
  trabajos de compañeros). Aplica a quien copia y a quien presta el código.
- Uso de librerías o frameworks de JS no permitidos.
- El proyecto no funciona o presenta errores en consola al ejecutarse.

**Uso de IA:** se puede usar como herramienta de consulta, pero el alumno es
responsable de entender todo lo que entrega. Lo que no pueda explicar en la
defensa se considera no propio.
