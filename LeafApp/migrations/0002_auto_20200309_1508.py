# Generated by Django 2.1.5 on 2020-03-09 07:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('LeafApp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='monitor',
            name='deficiency',
            field=models.CharField(max_length=254, null=True),
        ),
        migrations.AddField(
            model_name='monitor',
            name='variety',
            field=models.CharField(max_length=254, null=True),
        ),
        migrations.AlterField(
            model_name='monitor',
            name='location',
            field=models.CharField(max_length=254, null=True),
        ),
    ]
