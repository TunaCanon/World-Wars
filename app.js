<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terra Nullius - Piksel Strateji</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="game-container">
        <header id="header">
            <h2>Terra Nullius / FrontWars</h2>
            <div id="stats">
                <span>Altın: <b id="gold-val">100</b></span>
                <span>Asker: <b id="troop-count">50</b></span>
                <span>Bölge: <b id="territory-count">25</b></span>
            </div>
        </header>

        <div id="canvas-wrapper">
            <canvas id="gameCanvas" width="700" height="450"></canvas>
        </div>

        <footer id="controls">
            <button id="btn-recruit" class="game-btn">Asker Eğit (20 Altın)</button>
            <div class="slider-group">
                <label>Saldırı Gücü Oranı: </label>
                <input type="range" id="attackRatio" min="10" max="100" value="50">
                <span id="send-percent">50%</span>
            </div>
        </footer>
    </div>

    <script src="app.js"></script>
</body>
</html>
