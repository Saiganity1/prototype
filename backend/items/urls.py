from django.urls import path
from .views import LostItemListCreateView, register, login, LostItemDetailView

urlpatterns = [
    path('', LostItemListCreateView.as_view(), name='item-list-create'),
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('<int:pk>/', LostItemDetailView.as_view(), name='item-detail'),
]
