import logging
import stripe
from rest_framework import status, views, generics
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.conf import settings
from django.contrib.auth.models import User
from django.db import transaction
from decimal import Decimal
from django.urls import reverse
from django.http import HttpResponseRedirect
from .tasks import send_payment_confirmation_email
from django.shortcuts import get_object_or_404

logger = logging.getLogger(__name__)

stripe.api_key = getattr(settings, "STRIPE_SECRET_KEY", "")

from .models import Expense
from .serializers import UserSerializer, ExpenseSerializer

class UserCreate(views.APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(views.APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            return Response({'message': 'Login Successful'}, status=status.HTTP_200_OK)
        return Response({'message': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class ExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        username = self.request.query_params.get('username', None)
        if username is not None:
            user = get_object_or_404(User, username=username)
            return Expense.objects.filter(user=user)
        return Expense.objects.none()
    
    def perform_create(self, serializer):
        """
        Include the username in the validated data before saving.
        """
        username = self.request.data.get('username')
        serializer.save(username=username)
    
class CreatePayment(views.APIView):
    def post(self, request):
        payment_method_id = request.data.get('payment_method_id')
        username = request.data.get('username')
        amount_cents = int(float(request.data.get('amount', 0)) * 100)  # Convert dollars to cents

        return_url = request.build_absolute_uri(reverse('payment-complete'))

        try:
            payment_intent = stripe.PaymentIntent.create(
                amount=amount_cents,
                currency='usd',
                payment_method=payment_method_id,
                confirmation_method='manual',
                confirm=True,
                return_url=return_url,
            )

            with transaction.atomic():
                user = get_object_or_404(User, username=username)
                expenses = Expense.objects.filter(user=user)

                for expense in expenses:
                    received_amount = Decimal(payment_intent.amount_received) / Decimal(100)
                    new_amount_paid = expense.amount_paid + received_amount
                    expense.amount_paid = new_amount_paid
                    expense.remaining_amount = max(expense.total_expenses - new_amount_paid, 0)
                    expense.save()
                    # TODO: Replace with user's email when profile supports it.
                    send_payment_confirmation_email.delay("test@example.com", new_amount_paid)
                    logger.info("Updated expense %s after payment", expense.id)

            return Response({
                'status': 'requires_action',
                'payment_intent_id': payment_intent.id,
                'payment_intent_client_secret': payment_intent.client_secret
            }, status=status.HTTP_200_OK)
        
        except stripe.error.StripeError as e:
            return Response({'status': 'failed', 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
def payment_complete(request):
    payment_intent_id = request.GET.get('payment_intent', '')
    payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
    logger.info("Payment intent status: %s", payment_intent.status)

    if payment_intent.status == 'succeeded':
        try:
            with transaction.atomic():
                # Assuming you've added username to metadata during payment intent creation
                username = payment_intent.metadata.get('username')
                if not username:
                    logger.warning("Username metadata is missing on payment intent")
                    return HttpResponseRedirect(
                        f"{settings.FRONTEND_BASE_URL}/dashboard?payment_status=failed&error=Username missing"
                    )

                user = get_object_or_404(User, username=username)
                expenses = Expense.objects.filter(user=user)

                for expense in expenses:
                    received_amount = Decimal(payment_intent.amount_received) / Decimal(100)
                    new_amount_paid = expense.amount_paid + received_amount
                    expense.amount_paid = new_amount_paid
                    expense.remaining_amount = max(expense.total_expenses - new_amount_paid, 0)
                    expense.save()
                    send_payment_confirmation_email.delay("test@example.com", new_amount_paid)
                    logger.info("Updated expense %s after payment completion", expense.id)

            return HttpResponseRedirect(
                f"{settings.FRONTEND_BASE_URL}/dashboard?payment_status=succeeded"
            )
        
        except Exception as e:
            logger.exception("Error during payment completion")
            return HttpResponseRedirect(
                f"{settings.FRONTEND_BASE_URL}/dashboard?payment_status=failed&error={str(e)}"
            )

    return HttpResponseRedirect(
        f"{settings.FRONTEND_BASE_URL}/dashboard?payment_status=failed&error=Payment not successful"
    )