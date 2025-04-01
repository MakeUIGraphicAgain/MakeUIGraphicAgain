const parametro = new URLSearchParams(window.location.search);
const capitolo = parseInt(parametro.get('Capitolo')); // Ottieni l'ID dell'album (01, 02, etc.) e lo converto in un numero

let stato = 0;
let scrittaMenu = document.getElementById("scritta-menu");
let scrittaClose = document.getElementById("scritta-close");
let box = document.getElementById("contenitore-grigio");
let box2 = document.getElementById("contenitore-Overlay");


let lista = document.getElementById("lista");
let titles = document.getElementsByClassName("titles");
let spazio;

function calculateValue() {
    spazio = titles[1].offsetHeight + window.innerHeight / 100;
    let vwValue = -(spazio*capitolo) - 8;
    lista.style.top = `${vwValue}px`;
    console.log(spazio);
}
calculateValue()

window.addEventListener("resize", () => {
    calculateValue();
});

document.getElementById("hamburger").addEventListener("click", function () {

    if (stato == 0) {
        box.style.top = "52vh";
        titles[capitolo].style.opacity = "0.2";
        lista.style.top = "-8px";
        box2.style.opacity = "0.3";
        scrittaMenu.style.display = "none";
        scrittaClose.style.display = "block";
        stato = 1;

    } else {
        box.style.top = "5.4vh";
        titles[capitolo].style.opacity = "1";
        let vwValue = -(spazio*capitolo) - 8;
        lista.style.top = `${vwValue}px`;
        box2.style.opacity = "1";
        scrittaMenu.style.display = "block";
        scrittaClose.style.display = "none";
        stato = 0;
    }
});

document.getElementById("contenitore-grigio").addEventListener("click", function () {
    if (stato == 1) {
        this.style.top = "5.4vh";
        box2.style.opacity = "1";
        scrittaMenu.style.display = "block";
        scrittaClose.style.display = "none";
        stato = 0;
    }
});


