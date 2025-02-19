// Variable que mantiene el estado visible del carrito
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

    document.querySelectorAll('.agregar-carrito').forEach(boton => {
        boton.addEventListener('click', agregarAlCarritoClicked);
    });

    let botonPagar = document.getElementById('btn-pagar');
    if (botonPagar) {
        botonPagar.addEventListener('click', pagarClicked);
    }

    document.getElementById('nequi').addEventListener('click', function () {
        mostrarQR("/static/img/qrn.jpeg", "Número: 3227281252");
    });

    document.getElementById('daviplata').addEventListener('click', function () {
        mostrarQR("/static/img/qrn.jpeg", "Número: 3227281252");
    });

    document.getElementById('bancolombia').addEventListener('click', function () {
        mostrarQR("/static/img/qrn.jpeg", "Cuenta: 03227281252");
    });

    document.querySelector(".cerrar").addEventListener("click", cerrarModal);
}

function pagarClicked() {
    let modalPago = document.getElementById("modal-pago");
    if (modalPago) {
        modalPago.style.display = "block";  
        document.querySelector(".opciones-pago").style.display = "block"; 
        document.getElementById("qr-container").style.display = "none";  

        // Desplazar automáticamente a la sección de métodos de pago
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
    
    let qrTexto = document.getElementById("qr-texto");
    qrTexto.innerText = texto;
    qrTexto.style.display = "block";
}

function agregarAlCarritoClicked(event) {
    var button = event.target;
    var item = button.parentElement;
    var titulo = item.querySelector('.titulo-item').innerText;
    var precio = item.querySelector('.precio-item').innerText;
    var imagenSrc = item.querySelector('.img-item').src;

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
    var item = document.createElement('div');
    item.classList.add('carrito-item');
    var itemsCarrito = document.querySelector('.carrito-items');

    var nombresItemsCarrito = itemsCarrito.querySelectorAll('.carrito-item-titulo');
    for (var i = 0; i < nombresItemsCarrito.length; i++) {
        if (nombresItemsCarrito[i].innerText === titulo) {
            alert("El item ya se encuentra en el carrito");
            return;
        }
    }

    item.innerHTML = `
        <img src="${imagenSrc}" width="80px" alt="">
        <div class="carrito-item-detalles">
            <span class="carrito-item-titulo">${titulo}</span>
            <div class="selector-cantidad">
                <i class="fa-solid fa-minus restar-cantidad"></i>
                <input type="text" value="1" class="carrito-item-cantidad" disabled>
                <i class="fa-solid fa-plus sumar-cantidad"></i>
            </div>
            <span class="carrito-item-precio">${precio}</span>
        </div>
        <button class="btn-eliminar">
            <i class="fa-solid fa-trash"></i>
        </button>`;

    itemsCarrito.appendChild(item);
    item.querySelector('.btn-eliminar').addEventListener('click', eliminarItemCarrito);
    item.querySelector('.restar-cantidad').addEventListener('click', restarCantidad);
    item.querySelector('.sumar-cantidad').addEventListener('click', sumarCantidad);

    actualizarTotalCarrito();
}

function sumarCantidad(event) {
    var selector = event.target.parentElement;
    var cantidadElemento = selector.querySelector('.carrito-item-cantidad');
    cantidadElemento.value = parseInt(cantidadElemento.value) + 1;
    actualizarTotalCarrito();
}

function restarCantidad(event) {
    var selector = event.target.parentElement;
    var cantidadElemento = selector.querySelector('.carrito-item-cantidad');
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
    var carritoItems = document.querySelector('.carrito-items');
    if (carritoItems.childElementCount === 0) {
        document.querySelector('.carrito').style.marginRight = '-100%';
        document.querySelector('.carrito').style.opacity = '0';
        carritoVisible = false;
        document.querySelector('.contenedor-items').style.width = '100%';
    }
}

function actualizarTotalCarrito() {
    var carritoItems = document.querySelector(".carrito-items");
    var carritoItem = carritoItems.querySelectorAll(".carrito-item");
    var total = 0;

    carritoItem.forEach(item => {
        var precioTexto = item.querySelector(".carrito-item-precio").innerText;
        var precio = parseFloat(precioTexto.replace(/[^\d.]/g, ""));
        var cantidad = parseInt(item.querySelector(".carrito-item-cantidad").value);
        total += precio * cantidad;
    });

    document.querySelector(".carrito-precio-total").innerText = "$" + Math.floor(total);
}
