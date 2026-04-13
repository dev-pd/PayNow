from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now

class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    # year = models.IntegerField(help_text="Year of the expense")
    # month = models.IntegerField(help_text="Month of the expense")
    month = models.DateField(help_text="Use the first day of the month for consistency.", default=now)
    groceries = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    transportation = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    utilities = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    dining = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    entertainment = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    healthcare = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_expenses = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    remaining_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        self.total_expenses = sum([
            self.groceries, self.transportation,
            self.utilities, self.dining,
            self.entertainment, self.healthcare
        ])
        self.remaining_amount = max(0, self.total_expenses - self.amount_paid)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.month.strftime('%Y-%m')}"
