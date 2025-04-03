const container = document.getElementById("flex-image-container");

for (let i = 0; i < 27; i++) {
    const imgElement = document.createElement("img");
    imgElement.src = `risorse/interfacce/${i}/1.png`;
    imgElement.classList.add("interfacce-carosello");
    if (i == 0) {
        imgElement.style.marginLeft = "26vw";
    } else if (i ==26) {
        imgElement.style.paddingRight = "22vw";
    }

    imgElement.onclick = function () {
        window.location.href = `paginaInterfaccia.html?id=${i}&Capitolo=4`; 
    };

    // Aggiungi l'immagine al contenitore
    container.appendChild(imgElement);
}


let nomi = [];

function fetchData() {
    fetch("https://api.apispreadsheets.com/data/fRcJv1NKSBi1f4dS/")
        .then(response => response.json())  
        .then(data => {
            nomi = []; // Svuota l'array prima di riempirlo
            
            // Supponiamo che i dati siano in data.data e contengano almeno 9 elementi
            for (let i = 0; i < 27; i++) {
                    nomi.push(data.data[0][i]); // Sostituisci "Nome" con la colonna corretta
            }

            console.log("Nomi salvati:", nomi);
        })
        .catch(error => console.error("Errore:", error));
}

// Chiama la funzione quando la pagina è caricata
fetchData();

const titleElement = document.getElementById("nome");

// Funzione per rilevare l'immagine al centro
function updateTitle() {
    let containerRect = container.getBoundingClientRect();
    let centerX = containerRect.left + containerRect.width / 2; // Centro del contenitore

    let images = document.querySelectorAll(".interfacce-carosello");
    let closestImage = null;
    let minDistance = Infinity;

    images.forEach((img, index) => {
        let imgRect = img.getBoundingClientRect();
        let imgCenterX = imgRect.left + imgRect.width / 2; // Centro dell'immagine
        let distance = Math.abs(centerX - imgCenterX);

        if (distance < minDistance) {
            minDistance = distance;
            closestImage = index;
        }
    });

    if (closestImage !== null) {
        titleElement.textContent = nomi[closestImage];
    }
}

// Ascolta lo scroll del contenitore per aggiornare il titolo
container.addEventListener("scroll", updateTitle);

