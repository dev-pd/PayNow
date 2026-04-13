from django.contrib import admin
from django.http import HttpResponse
from django.urls import path
from .views import UserCreate, LoginView, ExpenseListCreateView, CreatePayment, payment_complete

urlpatterns = [
    path('api/register/', UserCreate.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/expenses/', ExpenseListCreateView.as_view(), name='expense-list-create'),
    # # path('api/expenses/<str:month>', ExpenseListCreateView.as_view(), name='expense-month'),
    # # path('api/expenses/<int:year>/<int:month>', ExpenseListCreateView.as_view(), name='expense-month'),
    # path('api/expenses/<int:year>/<int:month>', ExpenseListCreateView.as_view(), name='expense-month'),
    path('api/payments/', CreatePayment.as_view(), name='create_payment'),
    path('payment-complete/', payment_complete, name='payment-complete'),
]
