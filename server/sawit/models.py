from django.contrib.gis.db import models

# Create your models here.

class Spotting(models.Model):
    lat = models.FloatField()
    lon = models.FloatField()
    date = models.DateTimeField(auto_now=True)
    value = models.BooleanField()

class Counts(models.Model):
    polyid = models.CharField(max_length=10)
    count = models.IntegerField()


class Province(models.Model):
    name = models.CharField(max_length=100)
    geom = models.MultiPolygonField(srid=4326)
    isocode = models.CharField(max_length=10)
    area = models.FloatField()
    objects = models.GeoManager()

    def __unicode__(self):
        return self.name
