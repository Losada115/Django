from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Producto, MensajeContacto  
from django.core.mail import send_mail
from django.conf import settings
import json

# Vista para registrar usuario
def register_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Registro exitoso')
            return redirect('login')  
        else:
            messages.error(request, 'Error en el registro')
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
    else:
        form = UserCreationForm()
    return render(request, 'registro.html', {'form': form})

# Vista para iniciar sesión
def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')  
        else:
            messages.error(request, 'Nombre de usuario o contraseña incorrectos')
    return render(request, 'login.html')

# Vista para cerrar sesión
def logout_view(request):
    logout(request)
    messages.success(request, 'Has cerrado sesión exitosamente')
    return redirect('home')

# Vista protegida de inicio
def home(request):
    productos = Producto.objects.all()  
    return render(request, 'home.html', {'productos': productos})  

# Vista para la página de contacto
def contactanos(request):
    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        message = request.POST.get("message")

        # Guardar en la base de datos
        MensajeContacto.objects.create(nombre=name, email=email, mensaje=message)

        # Enviar un correo con la información del contacto
        send_mail(
            subject=f"Nuevo mensaje de {name}",
            message=f"Nombre: {name}\nCorreo: {email}\nMensaje: {message}",
            from_email=settings.EMAIL_HOST_USER,  
            recipient_list=[settings.EMAIL_HOST_USER],  
            fail_silently=False,
        )

        messages.success(request, 'Mensaje enviado correctamente')
        return render(request, "contactanos.html", {"message_sent": True})

    return render(request, "contactanos.html")

from django.core.mail import send_mail
from django.http import JsonResponse
import json

def enviar_correo_confirmacion(request):
    if request.method == "POST":
        try:
            # Cargar los datos del cuerpo de la solicitud
            data = json.loads(request.body)

            # 🔍 Verificar qué datos está recibiendo Django
            print("Datos recibidos en el backend:", data)

            email_cliente = data.get("email")  # Correo del cliente
            nombre = data.get("nombre")
            apellido = data.get("apellido")
            celular = data.get("celular")
            municipio = data.get("municipio")
            residencia = data.get("residencia")
            productos = data.get("productos")
            metodo_pago = data.get("metodo_pago")
            total = data.get("total")

            # 🚨 Verificar si el email del cliente está vacío
            if not email_cliente:
                return JsonResponse({"error": "No se recibió el email del cliente"}, status=400)

            print(f"Email cliente recibido: {email_cliente}")

            # Construcción del mensaje
            mensaje = f"""
            ¡Hola {nombre} {apellido}!

            Gracias por tu compra. Aquí están los detalles:

            📌 Productos comprados:
            {productos}

            💰 Total: ${total}
            💳 Método de pago: {metodo_pago}

            📍 Datos del comprador:
            - Celular: {celular}
            - Municipio: {municipio}
            - Residencia: {residencia}

            📧 Te enviaremos cualquier actualización sobre tu pedido.

            ¡Gracias por confiar en nosotros!
            """

            # Enviar correo al cliente
            send_mail(
                "Confirmación de compra",
                mensaje,
                "tu_correo@gmail.com",  # Remitente
                [email_cliente],  # Destinatario
                fail_silently=False,
            )

            # Enviar correo a la empresa
            send_mail(
                "Nueva compra realizada",
                f"Se ha realizado una nueva compra con estos datos:\n\n{mensaje}",
                "tu_correo@gmail.com",
                ["sabrosurashuila@gmail.com"],  # Reemplaza con el correo de la empresa
                fail_silently=False,
            )

            return JsonResponse({"mensaje": "Correo enviado correctamente"})

        except Exception as e:
            print(f"Error en el envío de correo: {e}")  # Imprime el error en la consola
            return JsonResponse({"error": str(e)}, status=400)

