from rest_framework import serializers
from .models import LostItem

class LostItemSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    uuid = serializers.UUIDField(read_only=True)

    class Meta:
        model = LostItem
        fields = ['id', 'uuid', 'user_name', 'name', 'category', 'description', 'date_found', 'image', 'created_at', 'claimed']
        read_only_fields = ['id', 'uuid', 'user_name', 'created_at']

    def validate(self, attrs):
        # Enforce image mandatory for creation; allow existing items without image when updating
        if self.instance is None and not attrs.get('image'):
            raise serializers.ValidationError({'image': 'Image is required for a new lost item.'})
        return attrs
