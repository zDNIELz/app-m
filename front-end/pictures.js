let pictures = [];
let index = 1;
let startX = 0;
let currentX = 0;
let isDragging = false;

async function uploadPictures() {
    try {
        const response = await fetch('/dates.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const pictures = await response.json();
        return pictures;
    } catch (error) {
        console.error('Erro ao carregar JSON', error);
        return null;
    }
}

uploadPictures().then(() => console.log('JSON carregado com sucesso!'));

async function initPictures() {
    pictures = await uploadPictures();
    if (!pictures) return;

    const container = document.getElementById("ContainerPictures");
    container.innerHTML = "";

    pictures.forEach((pictures) => {
        const div = document.createElement("div");

        if (pictures.id === 0) {
            div.className = "space";
        } else {
            div.className = "pictures";
            div.innerHTML = `
                <img src="${pictures.imagem}" class="foto">
                <h3>${pictures.title}</h3>
                <p>${pictures.date}</p>
            `;
        }

        container.appendChild(div);
    });

    dinamicStyles();
    update();

    // Adiciona eventos de toque
    addTouchEvents(container);
}

function dinamicStyles() {
    const pictures = document.querySelectorAll(".pictures");
    if (!pictures.length) return;

    const cartaLargura = window.innerWidth * 0.45;
    const cartaAltura = cartaLargura * 1.2;

    pictures.forEach(pictures => {
        pictures.style.width = `${cartaLargura}px`;
        pictures.style.height = `${cartaAltura}px`;
    });

    const space = document.querySelector(".space");
    const spaceLargura = cartaLargura * 0.6;
    space.style.width = `${spaceLargura}px`;
}

function update() {
    const container = document.getElementById("ContainerPictures");
    const picturesDivs = container.children;

    for (let i = 0; i < picturesDivs.length; i++) {
        picturesDivs[i].classList.remove("destaque");
    }

    if (picturesDivs[index]) picturesDivs[index].classList.add("destaque");

    const cartaLargura = window.innerWidth * 0.45;
    const espaço = cartaLargura; // largura da pictures + gap
    const deslocamento = (index - 1) * espaço;
    container.style.transition = "transform 0.3s ease";
    container.style.transform = `translateX(-${deslocamento}px)`;
}

function moveNext() { 
    if (index < pictures.length - 2) { 
        index++; update(); 
    } 
} 

function movePrev() { 
    if (index > 1) { 
        index--; update(); 
    } 
}



function bounce() {
    const container = document.getElementById("ContainerPictures");
    container.style.transition = "transform 0.2s ease";
    container.style.transform += " translateX(20px)";
    setTimeout(update, 150); // volta à posição original
}



// Eventos de toque
// substitua a função addTouchEvents existente por esta
function addTouchEvents(container) {
    const SWIPE_THRESHOLD = 50; // mínimo para considerar swipe
    let recentTouch = false; // evita clique duplo após toque

    // TOUCH (celular/tablet)
    container.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        currentX = startX;
        isDragging = true;
        container.style.transition = "none";
    }, { passive: true });

    container.addEventListener("touchmove", (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;

        const cartaLargura = window.innerWidth * 0.45;
        const espaço = cartaLargura;
        const deslocamento = (index - 1) * espaço - deltaX;
        container.style.transform = `translateX(-${deslocamento}px)`;
    }, { passive: true });

    container.addEventListener("touchend", (e) => {
        isDragging = false;
        const endX = (e.changedTouches && e.changedTouches[0])
            ? e.changedTouches[0].clientX
            : currentX;
        const deltaX = endX - startX;

        if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
            if (deltaX < 0) moveNext(); // deslizou p/ esquerda
            else movePrev();            // deslizou p/ direita
        } else {
            // toque curto → decide pela metade da tela
            const screenMid = window.innerWidth / 2;
            if (endX < screenMid) movePrev();
            else moveNext();
        }

        startX = 0;
        currentX = 0;

        // evita clique fantasma
        recentTouch = true;
        setTimeout(() => { recentTouch = false; }, 300);
    });

    // CLICK (desktop)
    container.addEventListener("click", (e) => {
        // ignora clique se acabou de haver um toque
        if (recentTouch) return;

        const screenMid = window.innerWidth / 2;
        if (e.clientX < screenMid) movePrev();
        else moveNext();
    });
}



document.getElementById("nextBtn").addEventListener("click", moveNext);
document.getElementById("prevBtn").addEventListener("click", movePrev);

document.addEventListener("DOMContentLoaded", initPictures);
