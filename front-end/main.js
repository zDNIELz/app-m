const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

const palavras = ['♡'];
const fonteSize = 32;
const columnSpacing = 20;
let columns;
let drops;
let indices = []; // controla a posição atual de cada coluna

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (canvas.width <= 400) {
        columns = Math.floor(canvas.width / columnSpacing);
    } else {
        columns = Math.floor((canvas.width / columnSpacing) + 1);
    }

    drops = Array(columns).fill(0).map(() => ({
        y: Math.floor(Math.random() * canvas.height),
        active: true
    }));

    // inicializa cada coluna com uma letra diferente (ou na posição 0)
    indices = Array(columns).fill(0).map((_, i) => i % palavras.length);
}

function Draw() {
    ctx.fillStyle = `rgba(30, 30, 30, 0.15)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#dd0e0e";
    ctx.font = `${fonteSize}px monospace`;

    drops.forEach((drop, i) => {
        if (!drop.active) return;

        const texto = palavras[indices[i]];
        const x = i * columnSpacing;
        const y = drop.y;

        ctx.fillText(texto, x, y);
        drop.y += fonteSize;

        // avança a letra dessa coluna
        indices[i] = (indices[i] + 1) % palavras.length;

        // reinicia quando sai da tela
        if (drop.y > canvas.height) {
            drop.y = 0;
        }
    });
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
setInterval(Draw, 65);
