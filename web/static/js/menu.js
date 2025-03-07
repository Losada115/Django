// const hamburguer = document.querySelector('.hamburguer')
// const menu = document.querySelector('.menu-navegacion')


// hamburguer.addEventListener('click', ()=>{
//     menu.classList.toggle("spread")
// })

// window.addEventListener('click', e =>{
//     if(menu.classList.contains('spread') 
//         && e.target != menu && e.target != hamburguer){
//         console.log('cerrar')
//         menu.classList.toggle("spread")
//     }
// })


// Código para el menú hamburguesa
const hamburguer = document.querySelector('.hamburguer');
const menu = document.querySelector('.menu-navegacion');

hamburguer.addEventListener('click', () => {
    menu.classList.toggle("spread");
});

window.addEventListener('click', e => {
    if (menu.classList.contains('spread') && e.target != menu && e.target != hamburguer) {
        console.log('cerrar');
        menu.classList.toggle("spread");
    }
});

// Código para el menú desplegable del usuario
const dropdownToggle = document.querySelector(".dropdown-toggle");
const dropdownMenu = document.querySelector(".dropdown-menu");

if (dropdownToggle && dropdownMenu) {
    // Mostrar/ocultar el menú desplegable al hacer clic
    dropdownToggle.addEventListener("click", function(e) {
        e.stopPropagation();  // Evitar que el evento se propague al window
        dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
    });

    // Si se hace clic fuera del menú desplegable, cerrarlo
    window.addEventListener("click", function(event) {
        if (!dropdownToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = "none";
        }
    });
}



const userDropdown = document.querySelector('.user-dropdown');
const dropdownContent = document.querySelector('.dropdown-content');
const manualToggle = document.querySelector('.manual-toggle');
const manualContent = document.querySelector('.manual-content');

// Variables para gestionar el tiempo de espera
let timeout;

// Mostrar el menú desplegable cuando el ratón pasa por encima
userDropdown.addEventListener('mouseover', () => {
    clearTimeout(timeout);
    dropdownContent.style.display = 'block'; // Muestra el menú
});

// Mantener el menú desplegable visible mientras el ratón está sobre él
dropdownContent.addEventListener('mouseover', () => {
    clearTimeout(timeout);
    dropdownContent.style.display = 'block'; // Mantiene el menú visible
});

// Ocultar el menú después de un retraso cuando el ratón sale
userDropdown.addEventListener('mouseout', () => {
    timeout = setTimeout(() => {
        dropdownContent.style.display = 'none'; // Oculta el menú después de un retraso
    }, 300); // Tiempo de espera de 300ms
});

manualToggle.addEventListener('mouseover', () => {
    clearTimeout(timeout);
    manualContent.style.display = 'block'; // Muestra el manual de usuario
});

manualToggle.add

