from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions
from tag.models import Tag, AppliedTag
from tag.serializers import TagSerializer, AppliedTagSerializer
from generic.response import format_api_response
from rest_framework import status
from rest_framework.response import Response


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def list(self, request):
        response = super().list(request)

        api_response = format_api_response(
            content=response.data, status=status.HTTP_200_OK
        )

        return Response(api_response, status=status.HTTP_200_OK)


class AppliedTagViewSet(viewsets.ModelViewSet):
    queryset = AppliedTag.objects.all()
    serializer_class = AppliedTagSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None