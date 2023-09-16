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
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 500);
}






document.addEventListener("DOMContentLoaded", function () {
    let proyectos;
    fetch('proyectos.json')
        .then(response => response.json())
        .then(data => {
            proyectos = data;
        })
        .catch(error => console.error('Error al cargar proyectos.json:', error));


    const botonesProyectos = document.querySelectorAll('.pro');


    function mostrarProyecto(id) {
        const template = document.getElementById('viewproyect');
        const proyecto = proyectos.find(item => item.id === id);

        if (proyecto) {
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

                template.content.querySelector('img').src = proyecto.portada;
                template.content.querySelector('h1').textContent = proyecto.titulo;
                template.content.querySelector('span').textContent = proyecto.categoria;
                template.content.querySelector('p').textContent = proyecto.descripcion;
                const listaLogros = template.content.querySelector('ul');
                listaLogros.innerHTML = '';
                proyecto.lista_de_logros.forEach(logro => {
                    const listItem = document.createElement('li');
                    listItem.textContent = logro;
                    listaLogros.appendChild(listItem);
                });

                const clone = document.importNode(template.content, true);
                viewContainer.appendChild(clone);

                const fotosProcesos = proyecto.fotos_procesos;
                const carouselContainer = document.querySelector('.carousel');
                carouselContainer.innerHTML = '';


                const flickity = new Flickity(carouselContainer, {
                    cellAlign: 'left',
                    contain: true, 
                });

                for (const key in fotosProcesos) {
                    if (fotosProcesos.hasOwnProperty(key)) {
                        const imgUrl = fotosProcesos[key];
                        const cell = document.createElement('div');
                        cell.className = 'carousel-cell';
                        const img = document.createElement('img');
                        img.src = imgUrl;
                        cell.appendChild(img);
                        flickity.append(cell);
                    }
                }


                setTimeout(() => {
                    ocultarLoader();
                }, 1000);
            }, 500);
        }
    }


    botonesProyectos.forEach(botonesProyecto => {
        botonesProyecto.addEventListener('click', function () {
            const idProyecto = this.getAttribute('data-id');
            mostrarProyecto(parseInt(idProyecto));
        });
    });
});

