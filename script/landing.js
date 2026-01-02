let ecranAccueil = document.querySelector('.ecran-accueil');
let porte = document.querySelector('.ecran-accueil__porte-cliquable');
let garage = document.querySelector('.garage');

porte.addEventListener('click', function() {
    ecranAccueil.classList.add('ecran-accueil--ouvert');

    setTimeout(function() {
        garage.classList.remove('garage--cache');
        garage.classList.add('garage--visible');

        setTimeout(function() {
            ecranAccueil.style.display = 'none';
        }, 1000);

    }, 1500);
});