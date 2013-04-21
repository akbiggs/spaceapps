from .models import Spotting, Province
from math import floor
from random import shuffle

def howmany(prov, dens):
    return prov.area * dens


tiers = [(100, 0.1), (500, 0.08), (1000, 0.06), (1000, 0.02)]

def makestuffup():
    provs = list(Province.objects.all())
    shuffle(provs)
    i = 0
    for num, dens in tiers:
        for prov in provs[i:i+num]:
            numtomake = howmany(prov, dens)
            print("Making {0} for {1}".format(numtomake, prov.isocode))
            ctr = prov.geom.centroid
            for n in range(int(floor(numtomake))):
                Spotting(lon=ctr.x, lat=ctr.y, value=True).save()
        i += num
