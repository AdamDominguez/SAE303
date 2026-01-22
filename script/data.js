// utilisation camel case comme le demande le standard js je crois
// on démarre avec un tableau vide
let voitures = [];
let voituresFiltrees = [];
// déclaration du 'compteur' à 0
let currentIndex = 0;
let nomVoiture = document.querySelector('.panneau-titre__nom');
let dateVoiture = document.querySelector('.panneau-titre__date');
let imageVoiture = document.querySelector('.garage__voiture');
let drapeau = document.querySelector('.panneau__drapeau');
let btnPrec = document.querySelector('.navigation__fleche--gauche');
let btnSuiv = document.querySelector('.navigation__fleche--droite');
let popup = document.querySelector('.popup-info');
let blocUSA = document.querySelector('.garage__pays.pays.usa');
let blocJapon = document.querySelector('.garage__pays.pays.japon');
let blocEurope = document.querySelector('.garage__pays.pays.europe');
let body = document.querySelector('body');
blocUSA.addEventListener('click', () => filtrerParPays('usa'));
blocJapon.addEventListener('click', () => filtrerParPays('japan'));
blocEurope.addEventListener('click', () => filtrerParPays('europe'));

class Voiture {
    constructor(data) {
        this.name = data.Name || "Inconnu";
        this.origin = (data.Origin || "default").toLowerCase();
        this.dateVoiture = data.Year || data.Date || "0000-00-00";
        this.pistons = parseInt(data.Cylinders) || 0;
        this.cylindree = data.Displacement;
        this.chevaux = data.Horsepower;
        this.acceleration = data.Acceleration;
        this.conso = data.Miles_per_Gallon;
        this.poids = data.Weight_in_lbs;
    }

    date() {
        if (this.dateVoiture.includes('-')) {
            return this.dateVoiture.split('-').reverse().join('/');
        }
        return this.dateVoiture;
    }

    image() {
        // on met tout en minuscule et on remplace chaque caractères spéciaux par un autre plus approprié pour un nom de fichier
        return this.name.toLowerCase()
            .replace(/ /g, '-')
            .replace(/-+$/, '')
            .replace(/[(]/g, '')
            .replace(/[/]/g, '-')
            .replace(/[)]/g, '')
            .replace(/[']/g, '')
            .replace(/[@]/g, 'a');
    }
}

// 1)
// on récupère le fichier json, on commence par vérifier si on a une réponse
// puis on renvoie le json associé à la réponse sinon erreur http car fetch ne fonctionne
// alors pas.

// 2)
// on remplace foreach par map pour simplifier les choses et on affiche
// chaque voiture en utilisant la classe Voiture associé aux données de la voiture par
// rapport à l'index (si c'est la première ou la centième)

// 3)
// on utilise catch pour attraper les erreurs potentielles et on les met sur la console
function chargerVoiture() {
    fetch('data/cars.json')
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Erreur HTTP");
            }
        })

        .then(data => {
            voitures = data.map(v => new Voiture(v));
            voituresFiltrees = voitures;

            afficherVoiture(currentIndex);
            calculerNombreVoituresParPays();
        })

        .catch(function (error) {
            console.error("Erreur : " + error);
        });
}

function filtrerParPays(pays) {
    // on affiche en fonction du pays
    voituresFiltrees = voitures.filter(voiture => voiture.origin === pays);
    currentIndex = 0;
    afficherVoiture(currentIndex);
}

function afficherVoiture(index) {
    if (voitures.length === 0) { return; }

    let voiture = voituresFiltrees[index];
    // pour afficher le drapeau correspondant, on défini la source avec le chemin initial et on met l'origine
    // du véhicule + le fichier à la fin pour assembler un chemin cohérent qui est déjà existant sur nos img...
    drapeau.src = "public/img/flag/" + voiture.origin + ".png";
    nomVoiture.textContent = voiture.name.toUpperCase();
    dateVoiture.textContent = voiture.date();

    imageVoiture.src = "public/img/car/" + voiture.image() + ".png";

    // MOTEUR
    let moteurVisuel = document.querySelector('.moteur-visuel');
    let sectionMoteur = document.querySelector('.popup-info__section--moteur');

    // on remet moteurVisuel à vide sinon on duplique à chaque clic les pistons...
    moteurVisuel.innerHTML = "";

    // on constatera beaucoup de else display none, je fais ça pour ne pas afficher une info
    // si elle n'est pas présente pour un véhicule car certains modèles n'ont pas toutes les infos
    if (voiture.pistons > 0) {
        sectionMoteur.style.display = 'block';

        // aide ia pour la logique de calcul entre les
        // animations et leur délai
        for (let i = 0; i < voiture.pistons; i++) {
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
    let conteneurSvg = document.querySelector('.cylindree-svg');
    let valeurCylindree = document.querySelector('.cylindree-valeur');

    if (voiture.cylindree) {
        sectionCylindree.style.display = 'block';
        // on vide l'html pour renouveller l'affichage
        conteneurSvg.innerHTML = "";

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 200 150");
        svg.setAttribute("width", "120");

        // chambre de compression
        const chambre = document.createElementNS(svgNS, "rect");
        chambre.setAttribute("x", "60");
        chambre.setAttribute("y", "25");
        chambre.setAttribute("width", "80");
        chambre.setAttribute("height", "100");
        chambre.setAttribute("fill", "#111");
        svg.appendChild(chambre);

        // piston
        const pistonSVG = document.createElementNS(svgNS, "rect");
        pistonSVG.setAttribute("x", "62");
        pistonSVG.setAttribute("y", "35");
        pistonSVG.setAttribute("width", "76");
        pistonSVG.setAttribute("height", "60");
        pistonSVG.setAttribute("fill", "#777");
        pistonSVG.classList.add('cylindree-svg__piston');
        svg.appendChild(pistonSVG);

        // culasse
        const culasse = document.createElementNS(svgNS, "rect");
        culasse.setAttribute("x", "55");
        culasse.setAttribute("y", "15");
        culasse.setAttribute("width", "90");
        culasse.setAttribute("height", "12");
        culasse.setAttribute("fill", "#444");
        svg.appendChild(culasse);

        // explosion
        const groupeExplosion = document.createElementNS(svgNS, "g");
        let scaleFactor = voiture.cylindree / 120;
        groupeExplosion.setAttribute("transform", `translate(100, 45) scale(${scaleFactor})`);
        groupeExplosion.classList.add('cylindree-svg__explosion');

        const explosionPath = document.createElementNS(svgNS, "path");
        explosionPath.setAttribute("d", "M 0,-15 L 5,-5 L 15,-10 L 10,0 L 20,10 L 5,5 L 0,20 L -5,5 L -20,10 L -10,0 L -15,-10 L -5,-5 Z");
        explosionPath.setAttribute("fill", "#FFD700");
        groupeExplosion.appendChild(explosionPath);
        svg.appendChild(groupeExplosion);
        conteneurSvg.appendChild(svg);

        // conversion de la valeur avec le format courant français
        valeurCylindree.textContent = Math.round(voiture.cylindree * 16.387) + "cm3";
    } else {
        sectionCylindree.style.display = 'none';
    }

    // PUISSANCE
    let sectionPuissance = document.querySelector('.popup-info__section--puissance');
    if (voiture.chevaux) {
        sectionPuissance.style.display = 'block';
        let rotation = ((voiture.chevaux / 300) * 180) - 90;
        if (rotation > 90) { rotation = 90; }
        document.querySelector('.compteur__aiguille').style.transform = "rotate(" + rotation + "deg)";
        document.querySelector('.compteur__valeur').textContent = voiture.chevaux + "ch";
    } else {
        sectionPuissance.style.display = 'none';
    }

    // ACCELERATION
    let sectionAccel = document.querySelector('.popup-info__section--acceleration');
    if (voiture.acceleration) {
        sectionAccel.style.display = 'block';
        let position = (voiture.acceleration / 25) * 100;
        if (position > 100) { position = 100; }
        document.querySelector('.piste__marqueur').style.left = position + "%";
        document.querySelector('.popup-info__titre--accel').textContent = "0-100km/h (" + voiture.acceleration + "s)";
    } else {
        sectionAccel.style.display = 'none';
    }

    // CONSOMMATION
    let sectionConso = document.querySelector('.popup-info__section--conso');
    if (voiture.conso) {
        sectionConso.style.display = 'block';
        let hauteur = (voiture.conso / 50) * 100;
        if (hauteur > 100) { hauteur = 100; }
        document.querySelector('.reservoir__liquide').style.height = hauteur + "%";
        // utilisation de / 2,352 pour convertir en kg
        document.querySelector('.reservoir__texte').textContent = Math.round(voiture.conso / 2.352) + "km/l";
    } else {
        sectionConso.style.display = 'none';
    }

    // POIDS
    let sectionPoids = document.querySelector('.popup-info__section--poids');
    if (voiture.poids) {
        sectionPoids.style.display = 'block';
        let largeur = (voiture.poids / 5000) * 100;
        if (largeur > 100) { largeur = 100; }
        let barre = document.querySelector('.balance__barre');
        barre.style.width = largeur + "%";
        // utilisation de / 2.2046 pour convertir en kg
        barre.textContent = Math.round(voiture.poids / 2.2046) + "kg";
    } else {
        sectionPoids.style.display = 'none';
    }

    // CHANGEMENT DU FOND
    // on retire systématiquement les classes spécifiques pour repartir à "zéro" (USA/Défaut)
    body.classList.remove('japan', 'europe', 'usa');

    // on applique la classe selon l'origine pour charger le background CSS correspondant
    if (voiture.origin === 'japan') {
        body.classList.add('japan');
    } else if (voiture.origin === 'europe') {
        body.classList.add('europe');
    } else {
        // si c'est usa ou autre, on force la classe usa pour le background standard
        body.classList.add('usa');
    }
}

function calculerNombreVoituresParPays() {
    // on déclare nos valeurs à 0 pour pouvoir les modifier librement
    let totalEurope = 0;
    let totalUSA = 0;
    let totalJapon = 0;

    // parcourt toutes les voitures et si on trouve un correspondant de pays on rajoute au compteur avec ++
    voitures.forEach(function (voiture) {
        if (voiture.origin === 'europe') {
            totalEurope++;
        } else if (voiture.origin === 'usa') {
            totalUSA++;
        } else if (voiture.origin === 'japan') {
            totalJapon++;
        }
    });

    if (blocEurope) {
        blocEurope.innerHTML = `<img src="public/img/nations/EUROPE.png" alt="Europe"> Europe : ${totalEurope} voitures`;
    }

    if (blocUSA) {
        blocUSA.innerHTML = `<img src="public/img/nations/US.png" alt="USA"> États-Unis : ${totalUSA} voitures`;
    }

    if (blocJapon) {
        blocJapon.innerHTML = `<img src="public/img/nations/JP.png" alt="Japon"> Japon : ${totalJapon} voitures`;
    }
}

// si on clique ici, on récupère la voiture actuel et sa position
// puis on lui fait descendre d'un cran
// logique: currentIndex > 0 pour éviter d'aller à -1, -2, etc... puis permettre -1 pour aller en arrière ou le faire sur la length car ternaire nécessite toujours else!
btnPrec.addEventListener('click', function () {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : voituresFiltrees.length - 1;
    afficherVoiture(currentIndex);
});

// si on clique ici, on récupère la voiture actuel et sa position
// puis on lui fait monter d'un cran
// logique:currentIndex plus petit que le nombre de voitures et on en retire une car 0 compte pour une voiture puis on rajoute 1 pour aller à la suivante sinon 0.
btnSuiv.addEventListener('click', function () {
    currentIndex = (currentIndex < voituresFiltrees.length - 1) ? currentIndex + 1 : 0;
    afficherVoiture(currentIndex);
});

function ouvrirPopup() {
    popup.classList.add('popup-info--visible');
}

function fermerPopup() {
    popup.classList.remove('popup-info--visible');
}

imageVoiture.addEventListener('mouseenter', ouvrirPopup);
imageVoiture.addEventListener('mouseleave', fermerPopup);

popup.addEventListener('mouseenter', ouvrirPopup);
popup.addEventListener('mouseleave', fermerPopup);

chargerVoiture();