# Create your views here.
from .models import Spotting, Province
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from collections import Counter
from datetime import timedelta, datetime

XS_SHARING_ALLOWED_METHODS = ['POST','GET','OPTIONS', 'PUT', 'DELETE']

def retcount():
    c = Counter()
    for prov in Province.objects.all():
        c[prov] = 1 # ew

    for spot in Spotting.objects.all():
        try:
            p = Province.objects.get(geom__contains='POINT({0} {1})'.
                    format(spot.lon, spot.lat))
            c[p] = c.get(p, 0) + 1
        except:
            print('WARN: {0} {1} is nowhere'.format(spot.lon,
                                                spot.lat))
    cc = Counter()
    ccc = {}
    for el in c.elements():
        if c[el] == 1:
            ccc[el.isocode] = {'density': 0,
                            'sightings': 0,
                            'name': el.name
                            }
        else:
            cc[el.isocode] = (c[el] - 1) / el.area
            ccc[el.isocode] = {'density': (c[el] - 1) / el.area,
                            'sightings': c[el] - 1,
                            'name': el.name
                            }
    return cc, ccc


def countem(req):
    r = HttpResponse(json.dumps(retcount()[1]), mimetype='application/json')
    r['Access-Control-Allow-Origin']  = '*'
    r['Access-Control-Allow-Methods'] = ",".join( XS_SHARING_ALLOWED_METHODS )
    return r

def max(req):
    r = HttpResponse(retcount()[0].most_common(1)[0][1], mimetype='text/plain')
    r['Access-Control-Allow-Origin']  = '*'
    r['Access-Control-Allow-Methods'] = ",".join( XS_SHARING_ALLOWED_METHODS )
    return r


def lastday(req):
    spots = Spotting.objects.filter(date__gte=datetime.now() - timedelta(hours=24))
    r = HttpResponse(spots.count())
    r['Access-Control-Allow-Origin']  = '*'
    r['Access-Control-Allow-Methods'] = ",".join( XS_SHARING_ALLOWED_METHODS )
    return r


def mostfriendly(req):
    r = HttpResponse(Province.objects.get(isocode=retcount()[0].most_common(1)[0][0]).name, mimetype='text/plain')
    r['Access-Control-Allow-Origin']  = '*'
    r['Access-Control-Allow-Methods'] = ",".join( XS_SHARING_ALLOWED_METHODS )
    return r


@csrf_exempt
def addem(req):
    try:
        Spotting(lat=float(req.POST['lat']), lon=float(req.POST['lon']),
                value=req.POST['value']).save()
        return countem(req)
    except:
        print('Something went wrong in save')
        return HttpResponse('ERROR', status=500)
