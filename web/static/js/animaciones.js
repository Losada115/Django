// CATEGORIAS
document.addEventListener("DOMContentLoaded", function() {
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // Dejar de observar tras la animación
            }
        });
    }, observerOptions);

    const categories = document.querySelectorAll(".category-item");
    categories.forEach(category => observer.observe(category));

    const heading = document.querySelector(".heading-categories");
    observer.observe(heading);
});



// FEATURE
document.addEventListener("DOMContentLoaded", function () {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible-down");
                observer.unobserve(entry.target); // Deja de observar el elemento después de la animación
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll(".elemento-animado");
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
});


// QUIENES SOMOS

document.addEventListener("DOMContentLoaded", function () {
    const aboutUsItems = document.querySelectorAll(".about-us-item");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    aboutUsItems.forEach((item) => {
        observer.observe(item);
    });
});


// MAPA 
document.addEventListener("DOMContentLoaded", function() {
    const observerOptions = { threshold: 0.2 };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elements = document.querySelectorAll(".map-container, .video-container");
    elements.forEach(el => observer.observe(el));
});


// VIDEO
document.addEventListener("DOMContentLoaded", function () {
    const videoContainer = document.querySelector(".video-container");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(videoContainer);
});


// CARRITO

