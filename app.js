const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const troopCountEl = document.getElementById('troop-count');
const goldValEl = document.getElementById('gold-val');
const territoryCountEl = document.getElementById('territory-count');
const sendPercentEl = document.getElementById('send-percent');
const attackRatioInput = document.getElementById('attackRatio');
const btnRecruit = document.getElementById('btn-recruit');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PIXEL_SIZE = 6; // Piksel boyutu

const cols = Math.floor(WIDTH / PIXEL_SIZE);
const rows = Math.floor(HEIGHT / PIXEL_SIZE);

// 0: Boş/Tarafsız, 1: Oyuncu (Mavi), 2: Düşبان/Yapay Zeka (Kırmızı)
let grid = Array(cols).fill(null).map(() => Array(rows).fill(0)); 

let playerTroops = 150;
let playerGold = 100;
let territoryCount = 0;
let attackRatio = 0.5;

// Oyuncuyu haritanın sol orta kısmına konumlandır
const startX = Math.floor(cols / 4);
const startY = Math.floor(rows / 2);

for (let x = startX - 3; x <= startX + 3; x++) {
    for (let y = startY - 3; y <= startY + 3; y++) {
        if (x >= 0 && x < cols && y >= 0 && y < rows) {
            grid[x][y] = 1;
            territoryCount++;
        }
    }
}

// Rastgele Tarafsız/Düşman Bölgeler Oluştur
for (let i = 0; i < 600; i++) {
    let rx = Math.floor(Math.random() * cols);
    let ry = Math.floor(Math.random() * rows);
    if (grid[rx][ry] === 0) {
        grid[rx][ry] = 2;
    }
}

let troopsInTransit = [];

// Haritaya Tıklayarak Asker Gönderme ve Piksel Yayılımı
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const targetX = Math.floor((e.clientX - rect.left) / PIXEL_SIZE);
    const targetY = Math.floor((e.clientY - rect.top) / PIXEL_SIZE);

    let sentTroops = Math.floor(playerTroops * attackRatio);
    if (sentTroops < 2) return;

    playerTroops -= sentTroops;

    troopsInTransit.push({
        x: startX,
        y: startY,
        targetX: targetX,
        targetY: targetY,
        count: sentTroops
    });
});

attackRatioInput.addEventListener('input', (e) => {
    attackRatio = e.target.value / 100;
    sendPercentEl.textContent = `${e.target.value}%`;
});

btnRecruit.addEventListener('click', () => {
    if (playerGold >= 20) {
        playerGold -= 20;
        playerTroops += 30;
    }
});

function update() {
    // Kaynak Üretimi (Bölge başına altın ve asker)
    playerGold += territoryCount * 0.005;
    playerTroops += territoryCount * 0.02;

    goldValEl.textContent = Math.floor(playerGold);
    troopCountEl.textContent = Math.floor(playerTroops);
    territoryCountEl.textContent = territoryCount;

    // Yoldaki Birlikleri Hareket Ettir
    for (let i = troopsInTransit.length - 1; i >= 0; i--) {
        let t = troopsInTransit[i];
        let dx = t.targetX - t.x;
        let dy = t.targetY - t.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 1.5) {
            conquerPixels(t.targetX, t.targetY, t.count);
            troopsInTransit.splice(i, 1);
        } else {
            t.x += (dx / dist) * 3;
            t.y += (dy / dist) * 3;
        }
    }
}

function conquerPixels(cx, cy, count) {
    let queue = [{x: cx, y: cy}];
    let captured = 0;
    let currentTerritory = 0;

    while (queue.length > 0 && captured < count) {
        let curr = queue.shift();
        let x = Math.round(curr.x);
        let y = Math.round(curr.y);

        if (x >= 0 && x < cols && y >= 0 && y < rows) {
            if (grid[x][y] !== 1) {
                if (grid[x][y] === 0) currentTerritory++;
                grid[x][y] = 1;
                captured++;
                territoryCount++;
            }

            let neighbors = [
                {x: x+1, y: y}, {x: x-1, y: y},
                {x: x, y: y+1}, {x: x, y: y-1}
            ];
            for (let n of neighbors) {
                if (n.x >= 0 && n.x < cols && n.y >= 0 && n.y < rows && grid[n.x][n.y] !== 1) {
                    queue.push(n);
                }
            }
        }
    }
}

function draw() {
    ctx.fillStyle = '#111318';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Grid ve Bölgeleri Çiz
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            if (grid[x][y] === 1) {
                ctx.fillStyle = '#2196F3'; // Oyuncu (Mavi)
                ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE - 0.5, PIXEL_SIZE - 0.5);
            } else if (grid[x][y] === 2) {
                ctx.fillStyle = '#d32f2f'; // Düşman/Tarafsız (Kırmızı)
                ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE - 0.5, PIXEL_SIZE - 0.5);
            }
        }
    }

    // Hareket Eden Asker Noktalarını Çiz
    for (let t of troopsInTransit) {
        ctx.fillStyle = '#FFEB3B';
        ctx.beginPath();
        ctx.arc(t.x * PIXEL_SIZE, t.y * PIXEL_SIZE, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
