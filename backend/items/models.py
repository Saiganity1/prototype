from django.db import models
from django.contrib.auth.models import User
import uuid

class LostItem(models.Model):
    CATEGORY_CHOICES = [
        ("electronics", "Electronics"),
        ("documents", "Documents"),
        ("clothing", "Clothing"),
        ("accessories", "Accessories"),
        ("other", "Other"),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="items")
    name = models.CharField(max_length=120)
    category = models.CharField(max_length=32, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    date_found = models.DateField()
    image = models.ImageField(upload_to="item_images/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    claimed = models.BooleanField(default=False, help_text="Marked true when verified claimed by rightful owner")
    uuid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False, help_text="Public unique identifier")

    def __str__(self):
        return f"{self.name} ({self.category})"
