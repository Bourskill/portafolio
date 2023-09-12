// Agregar evento de cambio de tamaño al textarea
var mensajeTextarea = document.getElementById("mensaje");
mensajeTextarea.addEventListener("input", function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});



// Desplegue de menu flotante
const barraNav = document.querySelector("#barranav");
const closeNav = barraNav.querySelector(".navclose");
const buttonsNav = barraNav.querySelectorAll("button");
const menuFlotante = document.querySelector(".hropciones");

menuFlotante.addEventListener("click", (e) => {
    if (e.target.closest(".hrmenu")) {
        barraNav.style.left = "2.5%";
        barraNav.style.transform = "translateX(0%)";
        menuFlotante.style.transform = "translateY(-120px)";
    }
});

function normalidadNav() {
    barraNav.style.left = "";
    barraNav.style.transform = "";
    menuFlotante.style.transform = "";
};

buttonsNav.forEach(element => {
    element.addEventListener("click", () => {
        normalidadNav();
    });
});

closeNav.addEventListener("click", () => {
    normalidadNav();
});



// animacion header scroll
window.addEventListener("scroll", () => {
    menuFlotante.classList.toggle("scrollhr", window.scrollY > 0);
});




//animacion nav btns
// Esta función maneja lo que sucede cuando haces clic en los botones de navegación
function handleButtonClick(boton) {
    // Primero, obtenemos todos los botones de navegación
    const botones = document.querySelectorAll('#barranav button');
    
    // Luego, quitamos la clase "btnfocus" de todos los botones
    botones.forEach((btn) => btn.classList.remove('btnfocus'));
    
    // Finalmente, añadimos la clase "btnfocus" al botón en el que hiciste clic
    boton.classList.add('btnfocus');
}

// Usamos esta variable para saber si la página está siendo desplazada o no
let isScrolling = false;

// Ahora, esta función detecta qué artículo se está viendo en la pantalla
function detectarArticuloVisible() {
    // Verificamos si la página no se está desplazando en ese momento
    if (!isScrolling) {
        // Obtenemos todos los artículos y botones de navegación
        const articulos = document.querySelectorAll('article');
        const botones = document.querySelectorAll('#barranav button');
        
        // Inicializamos una variable para rastrear el artículo visible
        let articuloVisible = null;

        // Luego, revisamos cada artículo
        articulos.forEach((articulo, index) => {
            // Obtenemos su posición en la pantalla
            const rect = articulo.getBoundingClientRect();
            
            // Ajustamos un valor de visibilidad en función de la altura del artículo
            const umbral = rect.height * 0.6; // Puedes cambiar esto según quieras
            
            // Si el artículo está en gran parte visible en la pantalla
            if (rect.top >= -umbral && rect.bottom <= window.innerHeight + umbral) {
                // Lo marcamos como el artículo visible
                articuloVisible = index;
            }
        });

        // Si encontramos un artículo visible
        if (articuloVisible !== null) {
            // Cambiamos la clase del botón correspondiente
            handleButtonClick(botones[articuloVisible]);
        }
    }
}

// Asociamos la función de manejo de clics a cada botón
const botones = document.querySelectorAll('#barranav button');
botones.forEach((btn) => {
    btn.addEventListener('click', () => handleButtonClick(btn));
});

// Detectamos si la página está siendo desplazada
window.addEventListener('scroll', () => {
    isScrolling = true;
    
    // Limpiamos el temporizador anterior (si existe) y configuramos uno nuevo
    clearTimeout(window.scrollTimer);
    window.scrollTimer = setTimeout(function () {
        isScrolling = false; // Cuando termina el desplazamiento, marcamos que no se está desplazando
        detectarArticuloVisible(); // Llamamos a la función para actualizar la clase del botón
    }, 50); // Redujimos el tiempo de espera a 100 milisegundos (puedes cambiar esto)
});

// Llamamos a la función para asegurarnos de que se marque el botón correcto al cargar la página
detectarArticuloVisible();



