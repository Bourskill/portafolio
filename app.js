// Ajuste dinámico de tamaño del textarea
const mensajeTextarea = document.getElementById("mensaje");
mensajeTextarea.addEventListener("input", function () {
    const newHeight = this.scrollHeight + 'px';
    if (this.style.height !== newHeight) {
        this.style.height = 'auto';
        this.style.height = newHeight;
    }
});

// Animación del header al hacer scroll
const menuFlotante = document.querySelector(".hropciones");
window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
        menuFlotante.classList.add("scrollhr");
    } else {
        menuFlotante.classList.remove("scrollhr");
    }
}, { passive: true });

// Despliegue y cierre del menú flotante
const barraNav = document.querySelector("#barranav");
const closeNav = barraNav.querySelector(".navclose");
const buttonsNav = barraNav.querySelectorAll("button");
menuFlotante.addEventListener("click", (e) => {
    if (e.target.closest(".hrmenu")) {
        barraNav.style.cssText = "left: 2.5%; transform: translateX(0%);";
        menuFlotante.style.transform = "translateY(-120px)";
    }
});
function normalidadNav() {
    barraNav.style.cssText = "";
    menuFlotante.style.transform = "";
}
buttonsNav.forEach(element => element.addEventListener("click", normalidadNav));
closeNav.addEventListener("click", normalidadNav);

// Navegación interactiva entre secciones
const botones = document.querySelectorAll("#barranav button");
let isScrolling = false;
let isAutoScrollEnabled = true;
function deshabilitarAutoScroll() { isAutoScrollEnabled = false; }
function habilitarAutoScroll() { isAutoScrollEnabled = true; detectarArticuloVisible(); }
function handleButtonClick(boton) {
    botones.forEach((btn) => btn.classList.remove("btnfocus"));
    boton.classList.add("btnfocus");
}
function detectarArticuloVisible() {
    if (!isScrolling && isAutoScrollEnabled) {
        const articulos = document.querySelectorAll("article");
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
window.addEventListener("scroll", () => {
    isScrolling = true;
    clearTimeout(window.scrollTimer);
    window.scrollTimer = setTimeout(() => {
        isScrolling = false;
        detectarArticuloVisible();
    }, 50);
    if (isAutoScrollEnabled) detectarArticuloVisible();
}, { passive: true });
botones.forEach((btn) => {
    btn.addEventListener("click", () => {
        handleButtonClick(btn);
        if (document.querySelector("#view")) {
            volverAProyectos();
            const locationValue = btn.getAttribute("onclick");
            const ubicacion = locationValue.match(/'#(.*?)'/);
            setTimeout(() => {
                window.location.href = "index.html#" + ubicacion[1];
            }, 500);
        }
    });
});
detectarArticuloVisible();

// Funcionalidad de proyectos
const loader = document.querySelector(".lightloader");
document.addEventListener("DOMContentLoaded", async function () {
    let proyectos = [];
    try {
        const response = await fetch("proyectos.json");
        proyectos = await response.json();
    } catch (error) {
        console.error("Error al cargar proyectos.json:", error);
    }
    const botonesProyectos = document.querySelectorAll(".pro");
    botonesProyectos.forEach(boton => boton.addEventListener("click", function () {
        const idProyecto = parseInt(this.getAttribute("data-id"));
        mostrarProyecto(idProyecto);
    }));
    document.addEventListener("click", function (event) {
        if (event.target.closest(".volver-button")) {
            volverAProyectos();
        }
    });

    function mostrarProyecto(id) {
        const template = document.getElementById("viewproyect");
        const proyecto = proyectos.find(item => item.id === id);
        if (!proyecto) return;

        mostrarLoader();
        const viewContainer = document.querySelector("main");
        const viewContainerArticles = viewContainer.querySelectorAll("article");
        viewContainer.style.height = "calc(100vh - 40px)";
        viewContainerArticles.forEach(element => {
            element.style.opacity = "0";
            element.style.display = "none";
        });
        setTimeout(() => {
            viewContainer.style.height = "";
            const { portada, titulo, categoria, descripcion, lista_de_logros, fotos_procesos, link } = proyecto;
            const templateImg = template.content.querySelector("img");
            const templateH1 = template.content.querySelector("h1");
            const templateSpan = template.content.querySelector("span");
            const templateP = template.content.querySelector("p");
            const listaLogros = template.content.querySelector("ul");

            templateImg.src = portada;
            templateH1.textContent = titulo;
            templateSpan.textContent = categoria;
            templateP.textContent = descripcion;

            listaLogros.innerHTML = "";
            lista_de_logros.forEach(logro => {
                const listItem = document.createElement("li");
                const parts = logro.split(": ");
                if (parts.length === 2) {
                    const strong = document.createElement("strong");
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

            const carouselContainer = document.querySelector(".carousel");
            carouselContainer.innerHTML = "";
            const flickity = new Flickity(carouselContainer, { draggable: "true" });
            Object.values(fotos_procesos).forEach(imgUrl => {
                const cell = document.createElement('div');
                cell.className = 'carousel-cell';
                const img = document.createElement('img');
                img.src = imgUrl;
                cell.appendChild(img);
                flickity.append(cell);
            });
            

            const visualizarButton = document.getElementById("Visualizar");
            visualizarButton.addEventListener("click", () => {
                if (link) window.open(link, "_blank");
            });
            ocultarLoader();
        }, 500);
    }
});

function volverAProyectos() {
    mostrarLoader();
    setTimeout(() => {
        const viewContainer = document.querySelector("#view");
        if (viewContainer) viewContainer.remove();
        const mainArticles = document.querySelectorAll("main article");
        mainArticles.forEach(article => {
            article.style.display = "block";
            article.style.opacity = "1";
        });
        botones.forEach(btn => btn.classList.remove("btnfocus"));
        document.documentElement.style.scrollBehavior = "auto";
        window.location.href = "index.html#proyectos";
        setTimeout(() => {
            document.documentElement.style.scrollBehavior = "smooth";
        }, 50);
        ocultarLoader();
        habilitarAutoScroll();
    }, 500);
}

function mostrarLoader() {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    loader.style.cssText = "display: flex; opacity: 1;";
}
function ocultarLoader() {
    botones.forEach(btn => btn.classList.remove("btnfocus"));
    deshabilitarAutoScroll();
    loader.style.opacity = "0";
    setTimeout(() => {
        loader.style.display = "none";
        document.body.style.overflow = "auto";
    }, 500);
}
