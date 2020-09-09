from django.db import models
# Create your models here.


class Monitor(models.Model):
    value = models.FloatField()
    deficiency = models.CharField(max_length=254, null=True)
    variety = models.CharField(max_length=254, null=True)
    location = models.CharField(max_length=254, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.timestamp)


class Temperature(models.Model):
    value = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.timestamp)
