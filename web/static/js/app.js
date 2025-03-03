var carritoVisible = false;

// Esperamos que la página cargue completamente
document.addEventListener('DOMContentLoaded', ready);

function ready() {
    document.querySelectorAll('.btn-eliminar').forEach(boton => {
        boton.addEventListener('click', eliminarItemCarrito);
    });

    document.querySelectorAll('.sumar-cantidad').forEach(boton => {
        boton.addEventListener('click', sumarCantidad);
    });

    document.querySelectorAll('.restar-cantidad').forEach(boton => {
        boton.addEventListener('click', restarCantidad);
    });

    document.getElementById("confirmarPago").addEventListener("click", function () {
        confirmarPago();
    });

    document.querySelectorAll('.agregar-carrito').forEach(boton => {
        boton.addEventListener('click', agregarAlCarritoClicked);
    });

    let botonPagar = document.getElementById('btn-pagar');
    if (botonPagar) {
        botonPagar.addEventListener('click', mostrarModalPago);
    }

    document.getElementById('nequi').addEventListener('click', () => mostrarQR("/static/img/qrn.jpeg", "Número: 3227281252"));
    document.getElementById('daviplata').addEventListener('click', () => mostrarQR("/static/img/qrn.jpeg", "Número: 3227281252"));

    document.querySelector(".cerrar").addEventListener("click", cerrarModal);

    window.addEventListener("click", function (event) {
        let modal = document.getElementById("modal-pago");
        if (event.target === modal) {
            cerrarModal();
        }
    });
}

function mostrarModalPago() {
    let modalPago = document.getElementById("modal-pago");
    if (modalPago) {
        modalPago.style.display = "block";
        document.querySelector(".opciones-pago").style.display = "block";
        document.getElementById("qr-container").style.display = "none";
        mostrarProductosEnPago();
        actualizarTotalPago();
        modalPago.scrollIntoView({ behavior: "smooth" });
    }
}

function cerrarModal() {
    document.getElementById("modal-pago").style.display = "none";
}

function mostrarQR(imagen, texto) {
    document.querySelector(".opciones-pago").style.display = "none";
    document.getElementById("qr-container").style.display = "block";
    document.getElementById("qr-imagen").src = imagen;
    document.getElementById("qr-texto").innerText = texto;
}

function actualizarTotalCarrito() {
    let total = 0;

    document.querySelectorAll(".carrito-item").forEach(item => {
        let precioTexto = item.querySelector(".carrito-item-precio").innerText;
        let precio = parseFloat(precioTexto.replace(/[^0-9.]/g, "")) || 0; 
        let cantidad = parseInt(item.querySelector(".carrito-item-cantidad").value) || 0;

        total += precio * cantidad;
    });

    total = Math.round(total);

    let totalElemento = document.querySelector(".carrito-precio-total");
    if (totalElemento) {
        totalElemento.innerText = `$${total}`;
    }

    actualizarTotalPago();
}

function actualizarTotalPago() {
    let totalElemento = document.querySelector(".carrito-precio-total");
    let total = totalElemento ? parseInt(totalElemento.innerText.replace(/[^0-9]/g, "")) : 0;

    let montoTotalElemento = document.getElementById("monto-total");
    if (montoTotalElemento) {
        montoTotalElemento.innerText = `$${total}`;
    }
}

function mostrarProductosEnPago() {
    let productosHTML = [...document.querySelectorAll(".carrito-item")].map(item => 
        `<div class="producto-pago">
            <img src="${item.querySelector('img').src}" width="50" alt="${item.querySelector('.carrito-item-titulo').innerText}">
            <p>${item.querySelector('.carrito-item-titulo').innerText} x${item.querySelector('.carrito-item-cantidad').value} - ${item.querySelector('.carrito-item-precio').innerText}</p>
        </div>`
    ).join('');

    document.getElementById("productos-pago").innerHTML = productosHTML;

    actualizarTotalPago();
}

function agregarAlCarritoClicked(event) {
    let item = event.target.parentElement;
    let titulo = item.querySelector('.titulo-item').innerText;
    let precio = item.querySelector('.precio-item').innerText;
    let imagenSrc = item.querySelector('.img-item').src;
    agregarItemAlCarrito(titulo, precio, imagenSrc);
    hacerVisibleCarrito();
}

function hacerVisibleCarrito() {
    carritoVisible = true;
    document.querySelector('.carrito').style.marginRight = '0';
    document.querySelector('.carrito').style.opacity = '1';
    document.querySelector('.contenedor-items').style.width = '60%';
}

function agregarItemAlCarrito(titulo, precio, imagenSrc) {
    let itemsCarrito = document.querySelector('.carrito-items');
    if ([...itemsCarrito.querySelectorAll('.carrito-item-titulo')].some(item => item.innerText === titulo)) {
        alert("El item ya se encuentra en el carrito");
        return;
    }

    let item = document.createElement('div');
    item.classList.add('carrito-item');
    item.innerHTML = 
        `<img src="${imagenSrc}" width="80px" alt="Imagen del producto">
        <div class="carrito-item-detalles">
            <span class="carrito-item-titulo">${titulo}</span>
            <div class="selector-cantidad">
                <i class="fa-solid fa-minus restar-cantidad"></i>
                <input type="text" value="1" class="carrito-item-cantidad" disabled>
                <i class="fa-solid fa-plus sumar-cantidad"></i>
            </div>
            <span class="carrito-item-precio">${precio}</span>
        </div>
        <button class="btn-eliminar"><i class="fa-solid fa-trash"></i></button>`;

    itemsCarrito.appendChild(item);
    item.querySelector('.btn-eliminar').addEventListener('click', eliminarItemCarrito);
    item.querySelector('.restar-cantidad').addEventListener('click', restarCantidad);
    item.querySelector('.sumar-cantidad').addEventListener('click', sumarCantidad);
    actualizarTotalCarrito();
}

function sumarCantidad(event) {
    let cantidadElemento = event.target.parentElement.querySelector('.carrito-item-cantidad');
    cantidadElemento.value = parseInt(cantidadElemento.value) + 1;
    actualizarTotalCarrito();
}

function restarCantidad(event) {
    let cantidadElemento = event.target.parentElement.querySelector('.carrito-item-cantidad');
    if (parseInt(cantidadElemento.value) > 1) {
        cantidadElemento.value = parseInt(cantidadElemento.value) - 1;
        actualizarTotalCarrito();
    }
}

function eliminarItemCarrito(event) {
    event.target.closest('.carrito-item').remove();
    actualizarTotalCarrito();
    ocultarCarrito();
}

function ocultarCarrito() {
    let carrito = document.querySelector(".carrito-items");
    if (carrito && carrito.children.length === 0) {
        document.querySelector(".carrito").style.marginRight = "-100%";
        document.querySelector(".carrito").style.opacity = "0";
        document.querySelector(".contenedor-items").style.width = "100%";
        carritoVisible = false;
    }
}
let metodoSeleccionado = "";
let qrSeleccionado = ""; // Variable para la URL del QR

document.getElementById('nequi').addEventListener('click', function() {
    metodoSeleccionado = "Nequi";
    qrSeleccionado = "/static/img/qrn.jpeg";
    mostrarQR(qrSeleccionado, "Número: 3227281252");
});

document.getElementById('daviplata').addEventListener('click', function() {
    metodoSeleccionado = "Daviplata";
    qrSeleccionado = "/static/img/qrd.jpeg";
    mostrarQR(qrSeleccionado, "Número: 3204500034");
});

function mostrarQR(imagenSrc, textoQR) {
    let qrImagen = document.getElementById("qr-imagen");
    let qrTexto = document.getElementById("qr-texto");
    let qrContainer = document.getElementById("qr-container");

    if (qrImagen) {
        qrImagen.src = imagenSrc + "?t=" + new Date().getTime(); // Evitar caché
        qrImagen.style.display = "block";  
    }

    if (qrTexto) {
        qrTexto.innerText = textoQR;
        qrTexto.style.display = "block";
    }

    if (qrContainer) {
        qrContainer.style.display = "block"; 
    }
}

document.getElementById("confirmarPago").addEventListener("click", function() {
    confirmarPago();
});

function confirmarPago() {
    let emailCliente = document.getElementById("email").value.trim();
    let nombre = document.getElementById("nombre").value;
    let apellido = document.getElementById("apellido").value;
    let celular = document.getElementById("celular").value;
    let municipio = document.getElementById("municipio").value;
    let residencia = document.getElementById("residencia").value;

    if (!metodoSeleccionado) {
        alert("Por favor, selecciona un método de pago.");
        return;
    }

    let totalElemento = document.getElementById("monto-total");
    let total = totalElemento ? totalElemento.innerText.replace(/[^0-9]/g, "") : "0";

    let productos = [...document.querySelectorAll(".carrito-item")].map(item => ({
        titulo: item.querySelector(".carrito-item-titulo").innerText,
        cantidad: item.querySelector(".carrito-item-cantidad").value,
        precio: item.querySelector(".carrito-item-precio").innerText
    }));

    let productosTexto = productos.map(p => `${p.titulo} x${p.cantidad} - ${p.precio}`).join("\n");

    fetch("/enviar-correo/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken()
        },
        body: JSON.stringify({
            email: emailCliente,
            nombre: nombre,
            apellido: apellido,
            celular: celular,
            municipio: municipio,
            residencia: residencia,
            productos: productosTexto,
            metodo_pago: metodoSeleccionado,
            total: total,
            qr_imagen: qrSeleccionado // Enviar la URL del QR en el JSON
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensaje) {
            alert("Pago confirmado. La factura ha sido enviada.");
            document.querySelector(".carrito-items").innerHTML = "";
            actualizarTotalCarrito();
            cerrarModal();
        } else {
            alert("Error al enviar la factura.");
        }
    })
    .catch(error => console.error("Error:", error));
}

function getCSRFToken() {
    let cookieValue = null;
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith("csrftoken=")) {
            cookieValue = cookie.substring("csrftoken=".length, cookie.length);
            break;
        }
    }
    return cookieValue;
}

document.getElementById('btn-pagar').addEventListener('click', function() {
    verificarLoginYProceder();
});

function verificarLoginYProceder() {
    fetch("/verificar-login/", {
        method: "GET",
        headers: {
            "X-CSRFToken": getCSRFToken()
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.loggedIn) {
            // Si el usuario está logueado, proceder con el pago
            mostrarModalPago();
        } else {
            // Si el usuario no está logueado, redirigir al login con un mensaje
            alert("Por favor, inicia sesión antes de realizar la compra.");
            window.location.href = "/login";  // Redirige al login
        }
    })
    .catch(error => console.error("Error:", error));
}
<<<<<<< HEAD
=======

>>>>>>> b1a3155c67ff43baa7b033976ae58a1ae75a6fea
