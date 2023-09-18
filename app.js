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
let isScrolling = false;
let isAutoScrollEnabled = true;

function deshabilitarAutoScroll() {
    isAutoScrollEnabled = false;
}


function habilitarAutoScroll() {
    isAutoScrollEnabled = true;
    detectarArticuloVisible();
}


function handleButtonClick(boton) {
    botones.forEach((btn) => btn.classList.remove('btnfocus'));
    boton.classList.add('btnfocus');
}



function detectarArticuloVisible() {

    if (!isScrolling && isAutoScrollEnabled) {
        const articulos = document.querySelectorAll('article');
        const botones = document.querySelectorAll('#barranav button');

        let articuloVisible = null;

        articulos.forEach((articulo, index) => {

            const rect = articulo.getBoundingClientRect();
            const umbral = rect.height * 0.6;
            if (rect.top >= -umbral && rect.bottom <= window.innerHeight + umbral) {
                articuloVisible = index;
            }
        });


        if (articuloVisible !== null) {
            handleButtonClick(botones[articuloVisible]);
        }
    }
}


window.addEventListener('scroll', () => {
    isScrolling = true;
    clearTimeout(window.scrollTimer);
    window.scrollTimer = setTimeout(function () {
        isScrolling = false;
        detectarArticuloVisible();
    }, 50);

    if (isAutoScrollEnabled) {
        detectarArticuloVisible();
    }
});


botones.forEach((btn) => {
    btn.addEventListener('click', () => {
        handleButtonClick(btn);
        if (document.querySelector('#view')) {
            const locationValue = btn.getAttribute('onclick');
            const ubicacion = locationValue.match(/'#(.*?)'/);
            console.log(ubicacion[1]);
            volverAProyectos();
            setTimeout(() => {
                window.location.href = "index.html#" + ubicacion[1];
            }, 500);
        }
    });
});


detectarArticuloVisible();

















// FUNCIONALIDAD DE LOS PROYECTOS
document.addEventListener("DOMContentLoaded", function () {
    let proyectos;


    async function cargarProyectos() {
        try {
            const response = await fetch('proyectos.json');
            proyectos = await response.json();
        } catch (error) {
            console.error('Error al cargar proyectos.json:', error);
        }
    }


    function mostrarProyecto(id) {
        const template = document.getElementById('viewproyect');
        const proyecto = proyectos.find(item => item.id === id);

        if (!proyecto) return;

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

            const { portada, titulo, categoria, descripcion, lista_de_logros, fotos_procesos, link } = proyecto;
            const templateImg = template.content.querySelector('img');
            const templateH1 = template.content.querySelector('h1');
            const templateSpan = template.content.querySelector('span');
            const templateP = template.content.querySelector('p');
            const listaLogros = template.content.querySelector('ul');

            templateImg.src = portada;
            templateH1.textContent = titulo;
            templateSpan.textContent = categoria;
            templateP.textContent = descripcion;


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



            const visualizarButton = document.getElementById('Visualizar');
            visualizarButton.addEventListener('click', function () {
                if (link) {
                    window.open(link, '_blank');
                }
            });


            ocultarLoader();
        }, 500);
    }


    const botonesProyectos = document.querySelectorAll('.pro');
    botonesProyectos.forEach(boton => {
        boton.addEventListener('click', function () {
            const idProyecto = this.getAttribute('data-id');
            mostrarProyecto(parseInt(idProyecto));
        });
    });

    document.addEventListener('click', function (event) {
        if (event.target.closest('.volver-button')) {
            volverAProyectos();
        }
    });

    cargarProyectos();
});







function volverAProyectos() {
    mostrarLoader();
    setTimeout(() => {

        const viewContainer = document.querySelector('#view');
        if (viewContainer) {
            viewContainer.remove();
        }
        const mainArticles = document.querySelectorAll('main article');
        mainArticles.forEach(article => {
            article.style.display = 'block';
            article.style.opacity = '1';
        });
        const botonesNav = document.querySelectorAll('#barranav button');
        botonesNav.forEach(btn => {
            btn.classList.remove('btnfocus');
        });


        document.documentElement.style.scrollBehavior = 'auto';
        window.location.href = "index.html#proyectos";
        setTimeout(() => {
            document.documentElement.style.scrollBehavior = 'smooth';
        }, 50);


        ocultarLoader();
        habilitarAutoScroll();
    }, 500);
}




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
