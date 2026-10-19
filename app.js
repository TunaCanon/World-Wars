// Oyun Durumu (State)
let gameState = {
    gold: 50,
    troops: 5,
    territoryCount: 1,
    tiles: []
};

// 5x5 Harita Oluşturma
const gridContainer = document.getElementById('grid-container');
const goldVal = document.getElementById('gold-val');
const troopsVal = document.getElementById('troops-val');
const territoryVal = document.getElementById('territory-val');

function initMap() {
    gridContainer.innerHTML = '';
    for (let i = 0; i < 25; i++) {
        const tile = document.createElement('div');
        tile.classList.add('map-tile');
        tile.dataset.index = i;
        
        // İlk kare oyuncunun başlangıç bölgesi olsun
        if (i === 12) {
            tile.classList.add('owned');
            tile.textContent = 'Merkez';
            gameState.tiles.push({ id: i, owned: true });
        } else {
            tile.textContent = `#${i}`;
            gameState.tiles.push({ id: i, owned: false });
        }

        tile.addEventListener('click', () => handleTileClick(i));
        gridContainer.appendChild(tile);
    }
    updateUI();
}

function updateUI() {
    goldVal.textContent = gameState.gold;
    troopsVal.textContent = gameState.troops;
    territoryVal.textContent = gameState.territoryCount;
}

// Karelere tıklama olayı
function handleTileClick(index) {
    const tileData = gameState.tiles[index];
    if (tileData.owned) {
        alert("Bu bölgeye zaten sahipsin!");
    } else {
        if (gameState.gold >= 15) {
            gameState.gold -= 15;
            tileData.owned = true;
            gameState.territoryCount++;
            
            const tileElement = gridContainer.children[index];
            tileElement.classList.add('owned');
            tileElement.textContent = 'Alındı';
            updateUI();
        } else {
            alert("Yeterli altın yok! (15 Altın gerekli)");
        }
    }
}

// Buton İşlevleri
document.getElementById('btn-recruit').addEventListener('click', () => {
    if (gameState.gold >= 5) {
        gameState.gold -= 5;
        gameState.troops += 2;
        updateUI();
    } else {
        alert("Yeterli altın yok!");
    }
});

document.getElementById('btn-expand').addEventListener('click', () => {
    gameState.gold += 10 * gameState.territoryCount; // Bölgelerden gelir elde et
    updateUI();
    alert("Tur atlandı, bölgelerden gelir toplandı!");
});

// Oyunu Başlat
initMap();