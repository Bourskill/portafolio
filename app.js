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










//ANIMACION NSV BTNS
const botones = document.querySelectorAll('#barranav button');
let isScrolling = false; // Variable para controlar el estado del scroll
let isAutoScrollEnabled = true; // Variable para controlar la funcionalidad automática de scroll

// Función para deshabilitar la funcionalidad automática de scroll
function deshabilitarAutoScroll() {
    isAutoScrollEnabled = false;
}

// Función para habilitar la funcionalidad automática de scroll
function habilitarAutoScroll() {
    isAutoScrollEnabled = true;
    // Llamamos a la función para asegurarnos de que se marque el botón correcto al cargar la página
    detectarArticuloVisible();
}

// Función para manejar lo que sucede cuando haces clic en los botones de navegación
function handleButtonClick(boton) {
    // Quitamos la clase "btnfocus" de todos los botones
    botones.forEach((btn) => btn.classList.remove('btnfocus'));

    // Añadimos la clase "btnfocus" al botón en el que hiciste clic
    boton.classList.add('btnfocus');
}

// Función para detectar qué artículo se está viendo en la pantalla
function detectarArticuloVisible() {
    // Verificamos si la página no se está desplazando en ese momento y la funcionalidad automática está habilitada
    if (!isScrolling && isAutoScrollEnabled) {
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

// Detectamos si la página está siendo desplazada
window.addEventListener('scroll', () => {
    isScrolling = true;

    // Limpiamos el temporizador anterior (si existe) y configuramos uno nuevo
    clearTimeout(window.scrollTimer);
    window.scrollTimer = setTimeout(function () {
        isScrolling = false; // Cuando termina el desplazamiento, marcamos que no se está desplazando
        detectarArticuloVisible(); // Llamamos a la función para actualizar la clase del botón
    }, 50); // Redujimos el tiempo de espera a 50 milisegundos (puedes cambiar esto)

    // Llamamos a la función de detección de artículo visible si la funcionalidad automática está habilitada
    if (isAutoScrollEnabled) {
        detectarArticuloVisible();
    }
});

// Asociamos la función de manejo de clics a cada botón
botones.forEach((btn) => {
    btn.addEventListener('click', () => handleButtonClick(btn));
});

// Llamamos a la función para asegurarnos de que se marque el botón correcto al cargar la página
detectarArticuloVisible();










const loader = document.querySelector('.lightloader');

function mostrarLoader() {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    loader.style.display = 'flex';
    setTimeout(() => {
        loader.style.opacity = '1';
    }, 0);
}

function ocultarLoader() {
    botones.forEach((btn) => btn.classList.remove('btnfocus'));
    deshabilitarAutoScroll()
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 500);
}

document.addEventListener("DOMContentLoaded", function () {
    let proyectos;

    // Función para cargar proyectos desde JSON
    async function cargarProyectos() {
        try {
            const response = await fetch('proyectos.json');
            proyectos = await response.json();
        } catch (error) {
            console.error('Error al cargar proyectos.json:', error);
        }
    }

    // Función para mostrar un proyecto
    function mostrarProyecto(id) {
        const template = document.getElementById('viewproyect');
        const proyecto = proyectos.find(item => item.id === id);

        if (!proyecto) return;

        console.log('Mostrando proyecto:', proyecto);

        mostrarLoader();

        const viewContainer = document.querySelector('main');
        const viewContainerArticles = viewContainer.querySelectorAll("article");
        viewContainer.style.height = "calc(100vh - 40px)";
        viewContainerArticles.forEach(element => {
            element.style.opacity = "0";
            element.style.display = "none";
        });

        setTimeout(() => {
            viewContainer.style.height = "";

            // Llenar el contenido del proyecto
            const { portada, titulo, categoria, descripcion, lista_de_logros, fotos_procesos, link } = proyecto;
            const view = template.content.querySelector('#view');
            view.querySelector('img').src = portada;
            view.querySelector('h1').textContent = titulo;
            view.querySelector('span').textContent = categoria;
            view.querySelector('p').textContent = descripcion;

            const listaLogros = view.querySelector('ul');
            listaLogros.innerHTML = '';
            lista_de_logros.forEach(logro => {
                const listItem = document.createElement('li');
                const parts = logro.split(': ');
                if (parts.length === 2) {
                    const strong = document.createElement('strong');
                    strong.textContent = parts[0];
                    const textNode = document.createTextNode(`: ${parts[1]}`);
                    listItem.appendChild(strong);
                    listItem.appendChild(textNode);
                } else {
                    listItem.textContent = logro;
                }
                listaLogros.appendChild(listItem);
            });

            const clone = document.importNode(template.content, true);
            viewContainer.appendChild(clone);

            // Crear el carrusel de fotos
            const carouselContainer = document.querySelector('.carousel');
            carouselContainer.innerHTML = '';
            const flickity = new Flickity(carouselContainer, { draggable: "true" });

            Object.values(fotos_procesos).forEach(imgUrl => {
                const cell = document.createElement('div');
                cell.className = 'carousel-cell';
                const img = document.createElement('img');
                img.src = imgUrl;
                cell.appendChild(img);
                flickity.append(cell);
            });

            // Obtener el botón "Visualizar proyecto"
            const visualizarButton = view.querySelector('#Visualizar');

            // Agregar un evento click al botón para abrir el enlace
            visualizarButton.addEventListener('click', function () {
                if (link) {
                    window.open(link, '_blank');
                }
            });

            ocultarLoader();

            // Agregar evento click al botón "Volver" utilizando event delegation
            document.addEventListener('click', function (event) {
                if (event.target.closest('.volver-button')) {
                    mostrarLoader();
                    setTimeout(() => {
                        console.log('Botón Volver clickeado');
                        const viewContainer = document.querySelector('#view');
                        if (viewContainer) {
                            viewContainer.remove(); // Elimina el elemento del DOM
                        }
                        const mainArticles = document.querySelectorAll('main article');
                        mainArticles.forEach(article => {
                            article.style.display = 'block';
                            article.style.opacity = '1';
                        });
                        const proyectoContainer = viewContainer.querySelector('.contenidov');
                        proyectoContainer.innerHTML = '';
                        const botonesNav = document.querySelectorAll('#barranav button');
                        botonesNav.forEach(btn => {
                            btn.classList.remove('btnfocus');
                        });
                        ocultarLoader();
                        habilitarAutoScroll();
                    }, 500);
                }
            });

        }, 500);
    }

    // Agregar eventos click a los botones de proyectos
    const botonesProyectos = document.querySelectorAll('.pro');
    botonesProyectos.forEach(boton => {
        boton.addEventListener('click', function () {
            const idProyecto = this.getAttribute('data-id');
            mostrarProyecto(parseInt(idProyecto));
        });
    });

    // Cargar proyectos al iniciar la página
    cargarProyectos();
});



