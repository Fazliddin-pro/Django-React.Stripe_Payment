import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView

from rest_framework import status
from .models import Payment
from .serializers import PaymentSerializer

stripe.api_key = settings.STRIPE_SECRET_KEY


class PaymentListView(ListAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer


class CreatePaymentIntentView(APIView):
    def post(self, request):
        amount = request.data.get("amount")
        currency = request.data.get("currency")
        email = request.data.get("user_email")

        if not email:
            return Response({"error": "Invalid email"}, status=status.HTTP_400_BAD_REQUEST)
        if not amount or int(amount) <= 0:
            return Response({"error": "Invalid amount"}, status=status.HTTP_400_BAD_REQUEST)
        if not currency:
            return Response({"error": "Currency is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        supported_currencies = ['usd', 'eur', 'rub', 'uzb']
        if currency.lower() not in supported_currencies:
            return Response({"error": "Unsupported currency"}, status=status.HTTP_400_BAD_REQUEST)


        try:
            intent = stripe.PaymentIntent.create(
                amount=int(amount),
                currency=currency,
            )
            # Save to the database
            payment_data = {
                'amount': amount,
                'currency': currency,
                'stripe_payment_id': intent['id'],
                'user_email': email,
            }
            serializer = PaymentSerializer(data=payment_data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'clientSecret': intent['client_secret'],
                    'payment': serializer.data}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except stripe.StripeError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)