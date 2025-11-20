from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import LostItem
from .serializers import LostItemSerializer

class LostItemListCreateView(generics.ListCreateAPIView):
    queryset = LostItem.objects.order_by('-created_at')
    serializer_class = LostItemSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class LostItemDetailView(generics.RetrieveUpdateAPIView):
    queryset = LostItem.objects.all()
    serializer_class = LostItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        # Only allow staff (admin) to modify claimed status
        if not request.user.is_staff:
            return Response({'detail': 'Admin required to update claimed status.'}, status=403)
        claimed_value = request.data.get('claimed')
        if claimed_value in [True, 'true', 'True', '1', 1]:
            instance.claimed = True
        elif claimed_value in [False, 'false', 'False', '0', 0]:
            instance.claimed = False
        else:
            return Response({'claimed': ['Invalid value']}, status=400)
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'detail': 'Username and password required.'}, status=400)
    if User.objects.filter(username=username).exists():
        return Response({'detail': 'Username already taken.'}, status=400)
    user = User.objects.create_user(username=username, password=password)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key})

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if not user:
        return Response({'detail': 'Invalid credentials'}, status=400)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key})
