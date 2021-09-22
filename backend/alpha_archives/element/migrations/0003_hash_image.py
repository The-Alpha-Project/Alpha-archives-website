# Generated by Django 3.2.7 on 2021-09-20 22:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('element', '0002_auto_20210920_2124'),
    ]

    operations = [
        migrations.CreateModel(
            name='Hash_Image',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image_hash', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='element.hash')),
                ('image_path', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='element.image')),
            ],
        ),
    ]