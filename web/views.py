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

from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.core.mail import send_mail
from django.conf import settings
import json

def confirmar_pago(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            nombre = data.get("nombre")
            apellido = data.get("apellido")
            celular = data.get("celular")
            email = data.get("email")
            municipio = data.get("municipio")
            residencia = data.get("residencia")
            productos = data.get("productos", [])  # Asegurar que sea una lista
            metodo_pago = data.get("metodoPago")
            total = data.get("total")

            if not (nombre and apellido and celular and email and municipio and residencia and productos and metodo_pago and total):
                return JsonResponse({"success": False, "error": "Faltan datos en la solicitud"}, status=400)

            productos_str = "\n".join([f"{p['titulo']} - Cantidad: {p['cantidad']} - Precio: {p['precio']}" for p in productos])

            send_mail(
                "Detalles de compra",
                f"Cliente: {nombre} {apellido}\nCelular: {celular}\nEmail: {email}\n"
                f"Municipio: {municipio}\nResidencia: {residencia}\n"
                f"Producto(s):\n{productos_str}\nTotal: {total}\nMétodo de Pago: {metodo_pago}",
                settings.EMAIL_HOST_USER,
                ["sabrosurashuila@gmail.com"],
                fail_silently=False,
            )

            send_mail(
                "Confirmación de Compra",
                f"Hola {nombre}, tu compra ha sido confirmada.\n"
                f"Productos:\n{productos_str}\nTotal: {total}\nMétodo de pago: {metodo_pago}\n"
                "Gracias por tu compra.",
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )

            # Redirigir a home después del pago exitoso
            return JsonResponse({"success": True, "message": "Pago confirmado y correos enviados correctamente", "redirect": "/"})

        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Error en el formato de los datos enviados"}, status=400)
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Método no permitido"}, status=405)
