# web/forms.py
from django import forms
from django.contrib.auth.models import User
from .validators import validar_contraseña  # Importa el validador

class RegistroForm(forms.ModelForm):
    password1 = forms.CharField(
        widget=forms.PasswordInput,
        label="Contraseña",
        validators=[validar_contraseña]  # Añade el validador aquí
    )
    password2 = forms.CharField(
        widget=forms.PasswordInput,
        label="Confirmar Contraseña",
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']


# forms.py
from django import forms
from .models import Producto

class ProductoForm(forms.ModelForm):
    class Meta:
        model = Producto
        fields = ['nombre', 'imagen','precio']

from django import forms

class PagoForm(forms.Form):
    nombre = forms.CharField(label="Nombre", max_length=100, required=True)
    apellido = forms.CharField(label="Apellido", max_length=100, required=True)
    celular = forms.CharField(label="Celular", max_length=15, required=True)
    municipio = forms.CharField(label="Municipio", max_length=100, required=True)
    residencia = forms.CharField(label="Dirrecion", max_length=255, required=True)
    email = forms.EmailField(label="Correo Electrónico", required=True)
