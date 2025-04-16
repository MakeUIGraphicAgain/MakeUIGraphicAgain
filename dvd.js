    const dvdLogo = document.getElementById('dvdLogo');
    const container = document.getElementById('contenitore-grigio');

    let posX = Math.random() * (container.clientWidth - dvdLogo.clientWidth); // X casuale
    let posY = Math.random() * (container.clientHeight - dvdLogo.clientHeight -200); // Y casuale
    let speedX = Math.random() < 0.5 ? 2 : -2;
    let speedY = Math.random() < 0.5 ? 2 : -2;

    let counterImg = 0;

    function updatePosition() {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const logoWidth = dvdLogo.clientWidth;
        const logoHeight = dvdLogo.clientHeight;
    
        // Calcola la nuova posizione
        posX += speedX;
        posY += speedY;
    
        // Controlla se l'immagine ha toccato i bordi
        if (posX + logoWidth > containerWidth || posX < 0) {
            updateImg()
            speedX = -speedX; // Rimbalza sull'asse X
        }
        if (posY + logoHeight > containerHeight || posY < 0) {
            updateImg()
            speedY = -speedY; // Rimbalza sull'asse Y
        }
    
// Usa translate3d per migliorare le performance
dvdLogo.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;

        
        requestAnimationFrame(updatePosition); // Chiamata ricorsiva per un'animazione continua
    }

    updatePosition(); // Avvia l'animazione

function updateImg() {
    if (counterImg < 8) {
        counterImg = counterImg + 1;
    } else {
        counterImg = 0;
    }
    dvdLogo.src = `risorse/preview/${counterImg}.png`;
}

function gotoArchivio() {
    window.location.href = `interfacce.html?Capitolo=4`; 
}