from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import confirmar_pago


urlpatterns = [
    path('registro/', views.register_view, name='registro'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('', views.home, name='home'),
    path('contactanos/', views.contactanos, name='contactanos'),
    path('confirmar_pago/', confirmar_pago, name='confirmar_pago')


]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


