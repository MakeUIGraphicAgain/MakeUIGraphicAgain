let nome;
let numImmagini;
let numVideo;

// Recupera il parametro 'id' dall'URL
const urlParams = new URLSearchParams(window.location.search);
const albumId = parseInt(urlParams.get('id')); // Ottieni l'ID dell'album (01, 02, etc.) e lo converto in un numero



function fetchData() {
    fetch("https://api.apispreadsheets.com/data/fRcJv1NKSBi1f4dS/")
        .then(response => response.json())  // Converti la risposta in JSON
        .then(data => {
            // Estrai il dato dalla riga corrispondente all'ID dell'album
            nome = data.data[0][albumId]; // Ricorda che gli array sono indicizzati da 0, quindi sottrarre 1
            numImmagini = data.data[31][albumId];
            numVideo = data.data[32][albumId];

            // Mostra il dato nel paragrafo con id "nome"
            document.getElementById("nome").innerText = nome;
            document.getElementById("nomeDue").innerText = nome;

            document.getElementById("tipo").innerText = data.data[25][albumId];
            document.getElementById("status").innerText = data.data[26][albumId];
            document.getElementById("autore").innerText = data.data[27][albumId];
            document.getElementById("anno").innerText = data.data[28][albumId];

            // A questo punto puoi aggiungere le immagini, ora che hai 'numImmagini'
            const container = document.getElementById("flex-image-container");

            for (let i = 1; i <= numImmagini; i++) {
                const imgElement = document.createElement("img");
                imgElement.src = `risorse/interfacce/${albumId}/${i}.png`;
                imgElement.classList.add("imageInterfaccia");
                if (i == 1) {
                    imgElement.style.marginLeft = "18vw";
                } else if (i == numImmagini && numVideo == 0) {
                    imgElement.style.marginRight = "18vw";
                }

                // Aggiungi l'immagine al contenitore
                container.appendChild(imgElement);
            }

            for (let i = 1; i <= numVideo; i++) {
                const videoElement = document.createElement("video");
                videoElement.src = `risorse/interfacce/${albumId}/${i + numImmagini}.mov`;
                videoElement.classList.add("videoInterfaccia");
                videoElement.controls = true; 
                videoElement.muted = true; 
                videoElement.autoplay = true; 
                videoElement.style.margin = "0 auto";
                if (i == numVideo) {
                    videoElement.style.paddingRight = "18vw";
                }

                // Aggiungi l'immagine al contenitore
                container.appendChild(videoElement);
            }


            for (let i = 2; i <= 21; i++) {
                document.getElementById(i).style.opacity = data.data[i][albumId];
            }
            checkOpacity();
        })
        .catch(error => console.error("Errore:", error));
}

// Chiama la funzione quando la pagina è caricata
fetchData();



let notScrolling = true;
let scrollTimeout;

window.addEventListener("scroll", function () {
    notScrolling = false;

    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
        notScrolling = true;
    }, 200); // Adjust delay as needed
});




let rowNewValue;
let media;


let lastTap = 0;
let voto = 0;
let progress = 0;  // Controlla il riempimento progressivo del cerchio
let isTouching = false;  // Verifica se l'utente sta tenendo premuto
let timeoutId = null;
let holdTimeout = null; // Dichiarato fuori dal blocco di codice

let confermato = 0;

let riempimento = document.getElementById("riempimento");

document.getElementById("voto").innerText = voto;

document.getElementById("inputter").addEventListener("touchstart", function (event) {
    let currentTime = new Date().getTime();
    let tapLength = currentTime - lastTap;

    // Se il tempo tra i due tocchi è inferiore a 300ms, consideriamo un doppio tocco
    if (tapLength < 300 && tapLength > 0 && confermato == 0) {
        // Se è un doppio tocco, incrementa il voto e ferma il riempimento del cerchio
        if (voto === 5) {
            voto = 0;
            document.getElementById("incremento").innerHTML = "Max: 5";
        } else {
            voto += 1;
            document.getElementById("incremento").innerHTML = "+1";
        }
        document.getElementById("incremento").style.opacity = 1;
        document.getElementById("voto").innerText = voto;
        setTimeout(function () {
            document.getElementById("incremento").style.opacity = 0;
        }, 500);

        // Interrompe il riempimento del cerchio, se c'era un "tieni premuto"
        isTouching = false;
        clearTimeout(timeoutId);  // Ferma il timeout associato al "tieni premuto"
        progress = 0;  // Resetta il progresso del cerchio
        riempimento.style.width = "0%";
        riempimento.style.height = "0%";
    } else {
        // Se non è un doppio tocco, procedi con il riempimento del cerchio
        event.preventDefault();  // Impedisce lo scroll e altre azioni di default durante il tocco
        isTouching = true;
        progress = 0;  // Resetta il progresso
        riempimento.style.width = "0%";
        riempimento.style.height = "0%";

        // Inizia a disegnare il cerchio progressivo solo se non c'è stato un doppio tocco
        timeoutId = setTimeout(function () {
            if (isTouching & notScrolling) {
                let startTime = Date.now();
                holdTimeout = setInterval(function () {
                    let elapsedTime = Date.now() - startTime;
                    progress = Math.min(elapsedTime / 2400, 0.8);  // Incrementa progressivamente il cerchio in 3 secondi
                    riempimento.style.width = 20 + progress * 100 + "%";
                    riempimento.style.height = 20 + progress * 100 + "%";
                    if (confermato == 0) {
                        document.getElementById("long-press").style.color = "#FFFF0A"
                    }

                    // Se il cerchio è completo, ferma l'animazione e incrementa il voto
                    if (progress === 0.8) {
                        clearInterval(holdTimeout);
                        progress = 0;  // Resetta il progresso
                        riempimento.style.width = "0%";  // Reset del progresso visivo
                        riempimento.style.height = "0%";  // Reset del progresso visivo  
                        if (confermato == 0) {
                            confermato = 1;
                            leggiRow();
                            makeYellow();
                        } else {
                            confermato = 0;
                            makeGrey();
                        }

                    }
                }, 50);  // Aggiorna il progresso ogni 50ms
            }
        }, 200);  // Dopo 200ms, se non c'è stato un doppio tocco, inizia il riempimento progressivo del cerchio
    }

    // Imposta il nuovo valore di lastTap
    lastTap = currentTime;
});

// Gestione del "touchend" per fermare il disegno
document.getElementById("inputter").addEventListener("touchend", function (event) {
    isTouching = false;  // L'utente ha smesso di tenere premuto
    clearTimeout(timeoutId);  // Ferma il timeout del "tieni premuto" se è stato interrotto
    clearInterval(holdTimeout);  // Ferma il riempimento del cerchio in corso
    event.preventDefault();  // Impedisce il comportamento predefinito
    progress = 0;  // Resetta il progresso
    riempimento.style.width = "0%";  // Reset del progresso visivo
    riempimento.style.height = "0%";  // Reset del progresso visivo
    if (confermato == 0) {
        document.getElementById("long-press").style.color = "var(--bianco)";
    }
});


function makeYellow() {
    document.getElementById("inputter").style.backgroundColor = "var(--giallo)";
    document.getElementById("riempimento").style.backgroundColor = "var(--bianco)";
    document.getElementById("maiuscoletti").style.color = "var(--grigioScuro)";

    document.getElementById("doppio-tocco").innerHTML = "MEDIA VOTI: Calcolo...";

    document.getElementById("incremento").style.color = "var(--grigioScuro)";
    document.getElementById("incremento").style.opacity = 1;
    document.getElementById("incremento").innerHTML = "HAI VOTATO:";

    document.getElementById("long-press").style.color = "var(--grigioScuro)";
    document.getElementById("long-press").innerHTML = "TIENI PREMUTO<br>PER VOTARE ANCORA";
}

function makeGrey() {
    document.getElementById("inputter").style.backgroundColor = "var(--grigioMedio)";
    document.getElementById("riempimento").style.backgroundColor = "var(--grigioChiaro)";
    document.getElementById("maiuscoletti").style.color = "var(--bianco)";

    document.getElementById("doppio-tocco").innerHTML = "TOCCA DUE VOLTE<br>PER AGGIUNGERE UN VOTO";

    document.getElementById("incremento").style.color = "var(--giallo)";
    document.getElementById("incremento").style.opacity = 0;
    document.getElementById("incremento").innerHTML = "+1";

    document.getElementById("long-press").style.color = "var(--bianco)";
    document.getElementById("long-press").innerHTML = "TIENI PREMUTO<br>PER CONFERMARE";
}


function leggiRow() {
    fetch("https://api.apispreadsheets.com/data/lxAd7WptmVviNqcu/")
        .then(response => response.json())  // Converti la risposta in JSON
        .then(data => {
            console.log(data);
            rowNewValue = data.data[0][albumId];
            sendVoto();
        })
        .catch(error => console.error("Errore:", error));

}

function sendVoto() {
    let votoConfermato = document.getElementById("voto").innerText;
    let quale = urlParams.get('id');
    console.log(albumId);

    // Crea il corpo della richiesta con i dati da inviare
    const requestBody = {
        data: {
            [quale]: votoConfermato  // Assicurati che il nome della colonna sia esattamente quello nel foglio
        },
        query: `select * from 1 where id = ${rowNewValue}` // Usa la query per specificare la riga da aggiornare
    };

    console.log("Request Body:", requestBody);

    // Invia la richiesta POST
    fetch("https://api.apispreadsheets.com/data/lxAd7WptmVviNqcu/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => {
            if (response.ok) {
                leggiVoti();
            } else {
                alert("Errore durante l'aggiornamento. Riprova");
            }
        })
        .catch(error => console.error("Errore:", error));
}


function leggiVoti() {
    fetch("https://api.apispreadsheets.com/data/lxAd7WptmVviNqcu/")
        .then(response => response.json())  // Converti la risposta in JSON
        .then(data => {
            media = data.data[1][albumId];
            rowNewValue = data.data[0][albumId];
            if (confermato == 1) {
                document.getElementById("doppio-tocco").innerHTML = "MEDIA VOTI: " + media + "/5<br>(" + (rowNewValue - 3) + " voti)";
            }
        })
        .catch(error => console.error("Errore:", error));
}





function checkOpacity() {
    let macros = document.querySelectorAll(".macro"); // Seleziona tutti gli elementi con classe "macro"

    for (let i = 0; i < macros.length; i++) {
        let caratteristiche = macros[i].querySelectorAll(".caratteristica"); // Trova i figli "caratteristica"
        let spans = macros[i].querySelectorAll("span"); // Trova gli <span> dentro il .macro

        let hasFullOpacity = false; // Flag per verificare se almeno un "caratteristica" ha opacity: 1

        for (let y = 0; y < caratteristiche.length; y++) {
            let opy = getComputedStyle(caratteristiche[y]).opacity;
            if (opy === "1") {
                hasFullOpacity = true; // Se almeno un "caratteristica" ha opacity: 1, lo memorizziamo
            }
            caratteristiche[y].style.display = "none"; // Nascondi tutti i "caratteristica"
        }

        // Se almeno un "caratteristica" ha opacity: 1, lasciamo gli <span> normali, altrimenti li rendiamo semi-trasparenti
        for (let span of spans) {
            span.style.opacity = hasFullOpacity ? "1" : "0.2";
        }
    }
}











function showChildren(element) {
    let children = element.querySelectorAll('.caratteristica');
    let icon = element.querySelector("img");
    icon.classList.toggle('specchia-verticale');
    children.forEach(child => {
        child.style.display = (child.style.display === 'block') ? 'none' : 'block';
    });
}