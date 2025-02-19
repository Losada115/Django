from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Producto  
from .models import MensajeContacto  
from django.core.mail import send_mail
from django.conf import settings

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

# Vista protegida de inicio (requiere autenticación)
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



