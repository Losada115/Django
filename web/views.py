# from django.contrib.auth.forms import UserCreationForm
# from django.contrib import messages
# from django.contrib.auth import authenticate, login
# from django.shortcuts import render, redirect
# from django.contrib.auth.decorators import login_required
# from .models import Producto  # Importar el modelo de productos

# def register_view(request):
#     if request.method == 'POST':
#         form = UserCreationForm(request.POST)
#         if form.is_valid():
#             form.save()
#             messages.success(request, 'Registro exitoso')
#             return redirect('login')  # Redirige a login después de registrarse
#         else:
#             messages.error(request, 'Error en el registro')
#             for field, errors in form.errors.items():
#                 for error in errors:
#                     messages.error(request, f"{field}: {error}")
#     else:
#         form = UserCreationForm()
#     return render(request, 'registro.html', {'form': form})




# def login_view(request):
#     if request.method == 'POST':
#         username = request.POST['username']
#         password = request.POST['password']
#         user = authenticate(request, username=username, password=password)
#         if user is not None:
#             login(request, user)
#             return redirect('home')  # Redirige a la página de inicio después de iniciar sesión
#         else:
#             messages.error(request, 'Nombre de usuario o contraseña incorrectos')
#     return render(request, 'login.html')

# @login_required
# def home(request):
#     productos = Producto.objects.all()  # Obtiene todos los productos de la base de datos
#     return render(request, 'home.html', {'productos': productos})  # Envia productos al template


from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from .models import Producto  # Importar el modelo de productos

def register_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Registro exitoso')
            return redirect('login')  # Redirige a login después de registrarse
        else:
            messages.error(request, 'Error en el registro')
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
    else:
        form = UserCreationForm()
    return render(request, 'registro.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')  # Redirige a la página de inicio después de iniciar sesión
        else:
            messages.error(request, 'Nombre de usuario o contraseña incorrectos')
    return render(request, 'login.html')

@login_required
def home(request):
    productos = Producto.objects.all()  # Obtiene todos los productos de la base de datos
    return render(request, 'home.html', {'productos': productos})  # Envia productos al template

def contactanos(request):
    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        message = request.POST.get("message")
        
        # Opcional: Enviar un correo con la información del contacto
        send_mail(
            f"Nuevo mensaje de {name}",
            message,
            email,
            [settings.EMAIL_HOST_USER],  # Cambia esto por el correo receptor
        )
        messages.success(request, 'Mensaje enviado correctamente')
        return render(request, "contact.html", {"message_sent": True})
    
    return render(request, "contactanos.html")



