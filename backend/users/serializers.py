from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Expense


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email']
        extra_kwargs = {
            'password': {'write_only': True, 'style': {'input_type': 'password'}}
        }

    def create(self, validated_data):
        # Ensures password is set correctly and not just saved as plain text
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email')  # 'email' is optional, and get will return None if it's not provided
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class ExpenseSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Expense
        fields = [
            'id',
            'username',
            'month',
            'groceries',
            'transportation',
            'utilities',
            'dining',
            'entertainment',
            'healthcare',
            'total_expenses',
            'amount_paid',
            'remaining_amount',
        ]
        read_only_fields = ['id', 'total_expenses', 'remaining_amount']

    def create(self, validated_data):
        """
        Override the create method to handle the expense creation for a specific user identified by username.
        """
        username = validated_data.pop('username')
        user = User.objects.get(username=username)
        validated_data['user'] = user
        expense = Expense.objects.create(**validated_data)
        # Totals are derived in Expense.save()
        expense.save()
        return expense

    def update(self, instance, validated_data):
        """
        Override the update method to handle the expense update for a specific user identified by username.
        """
        username = validated_data.pop('username')
        user = User.objects.get(username=username)
        if instance.user == user:
            for field, value in validated_data.items():
                setattr(instance, field, value)
            instance.save()
        return instance
