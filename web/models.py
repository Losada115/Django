from django.db import models

class Producto(models.Model):
    nombre = models.CharField(max_length=100)    
    imagen = models.ImageField(upload_to='productos/')  
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)  

    def __str__(self):
        return self.nombre
