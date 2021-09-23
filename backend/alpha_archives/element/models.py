from django.db import models

class Image(models.Model):
    image = models.ImageField()

class Hash_Image(models.Model):
    image_path = models.CharField(max_length=300)
    image_hash = models.CharField(max_length=50)

class Element(models.Model):
    name = models.CharField(max_length=300)
    path = models.CharField(max_length=500)
    parent = models.CharField(max_length=300)
    is_file = models.BooleanField()
    image = models.ForeignKey(Hash_Image, on_delete=models.CASCADE, null=True, blank=True)
