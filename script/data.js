let cars = [];
let currentIndex = 0;
let nomVoiture = document.querySelector('.panneau-titre__nom');
let dateVoiture = document.querySelector('.panneau-titre__date');
let drapeau = document.querySelector('.panneau__drapeau');
let imageVoiture = document.querySelector('.garage__voiture');
let btnPrec = document.querySelector('.navigation__fleche--gauche');
let btnSuiv = document.querySelector('.navigation__fleche--droite');
let popupInfo = document.querySelector('.popup-info');

function loadCars() {
    fetch('data/cars.json')
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Erreur HTTP");
            }
        })
        .then(function (data) {
            cars = data;
            afficherVoiture(currentIndex);
        })
        .catch(function (error) {
            console.error("Erreur : " + error);
            nomVoiture.textContent = "Erreur Données";
        });
}

function afficherVoiture(index) {
    if (cars.length === 0) { return; }

    let car = cars[index];

    let origin = 'default';
    if (car.Origin) {
        origin = car.Origin.toLowerCase();
    }
    drapeau.src = "public/img/flag/" + origin + ".png";

    nomVoiture.textContent = car.Name.toUpperCase();

    let annee = "0000-00-00";
    if (car.Year) {
        annee = car.Year;
    } else if (car.Date) {
        annee = car.Date;
    }
    dateVoiture.textContent = annee;

    // très redondant, à modifier
    let fileName = car.Name.toLowerCase();
    fileName = fileName.replace(/ /g, '-');
    fileName = fileName.replace(/-+$/, '');
    fileName = fileName.replace(/[(]/, '');
    fileName = fileName.replace(/[/]/, '-');
    fileName = fileName.replace(/[)]/, '');
    fileName = fileName.replace(/[']/, '');
    fileName = fileName.replace(/[@]/, 'a');
    // !

    imageVoiture.src = "public/img/car/" + fileName + ".png";

    // MOTEUR
    let moteurVisuel = document.querySelector('.moteur-visuel');
    let sectionMoteur = document.querySelector('.popup-info__section--moteur');

    moteurVisuel.innerHTML = "";

    let nbCylindres = parseInt(car.Cylinders);

    if (nbCylindres > 0) {
        sectionMoteur.style.display = 'block';

        for (let i = 0; i < nbCylindres; i++) {
            let piston = document.createElement('div');
            piston.className = 'moteur-visuel__piston';
            piston.style.animationDelay = (i * 0.15) + "s";
            moteurVisuel.appendChild(piston);
        }
    } else {
        sectionMoteur.style.display = 'none';
    }

    // CYLINDRÉE
    let sectionCylindree = document.querySelector('.popup-info__section--cylindree');
    let barreSvg = document.querySelector('.cylindree-svg__barre');
    let valeurCylindree = document.querySelector('.cylindree-valeur');

    if (car.Displacement) {
        sectionCylindree.style.display = 'block';

        let largeur = (car.Displacement / 500) * 80;

        if (largeur > 80) { largeur = 80; }

        barreSvg.setAttribute('width', largeur);
        valeurCylindree.textContent = car.Displacement + " ci";
    } else {
        sectionCylindree.style.display = 'none';
    }

    // PUISSANCE
    let sectionPuissance = document.querySelector('.popup-info__section--puissance');

    if (car.Horsepower) {
        sectionPuissance.style.display = 'block';

        let rotation = ((car.Horsepower / 300) * 180) - 90;
        if (rotation > 90) { rotation = 90; }

        document.querySelector('.compteur__aiguille').style.transform = "rotate(" + rotation + "deg)";
        document.querySelector('.compteur__valeur').textContent = car.Horsepower + " HP";
    } else {
        sectionPuissance.style.display = 'none';
    }

    // ACCELERATION
    let sectionAccel = document.querySelector('.popup-info__section--acceleration');

    if (car.Acceleration) {
        sectionAccel.style.display = 'block';

        let position = (car.Acceleration / 25) * 100;
        if (position > 100) { position = 100; }

        document.querySelector('.piste__marqueur').style.left = position + "%";
        document.querySelector('.popup-info__titre--accel').textContent = "0-60 MPH (" + car.Acceleration + "s)";
    } else {
        sectionAccel.style.display = 'none';
    }

    // CONSOMMATION
    let sectionConso = document.querySelector('.popup-info__section--conso');

    if (car.Miles_per_Gallon) {
        sectionConso.style.display = 'block';

        let hauteur = (car.Miles_per_Gallon / 50) * 100;
        if (hauteur > 100) { hauteur = 100; }

        document.querySelector('.reservoir__liquide').style.height = hauteur + "%";
        document.querySelector('.reservoir__texte').textContent = car.Miles_per_Gallon + " MPG";
    } else {
        sectionConso.style.display = 'none';
    }

    // POIDS
    let sectionPoids = document.querySelector('.popup-info__section--poids');

    if (car.Weight_in_lbs) {
        sectionPoids.style.display = 'block';

        let largeur = (car.Weight_in_lbs / 5000) * 100;
        if (largeur > 100) { largeur = 100; }

        let barre = document.querySelector('.balance__barre');
        barre.style.width = largeur + "%";
        barre.textContent = car.Weight_in_lbs + " LBS";
    } else {
        sectionPoids.style.display = 'none';
    }
}

btnPrec.addEventListener('click', function () {
    if (cars.length === 0) return;

    if (currentIndex > 0) {
        currentIndex = currentIndex - 1;
    } else {
        currentIndex = cars.length - 1;
    }
    afficherVoiture(currentIndex);
});

btnSuiv.addEventListener('click', function () {
    if (cars.length === 0) return;

    if (currentIndex < cars.length - 1) {
        currentIndex = currentIndex + 1;
    } else {
        currentIndex = 0;
    }
    afficherVoiture(currentIndex);
});

imageVoiture.addEventListener('mouseenter', function () {
    popupInfo.classList.add('popup-info--visible');
});

imageVoiture.addEventListener('mouseleave', function () {
    setTimeout(function () {
        if (!popupInfo.matches(':hover')) {
            popupInfo.classList.remove('popup-info--visible');
        }
    }, 100);
});

popupInfo.addEventListener('mouseleave', function () {
    popupInfo.classList.remove('popup-info--visible');
});

loadCars();