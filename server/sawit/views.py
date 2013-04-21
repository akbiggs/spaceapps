# Create your views here.
from .models import Spotting, Province
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from collections import Counter

XS_SHARING_ALLOWED_METHODS = ['POST','GET','OPTIONS', 'PUT', 'DELETE']

def retcount():
    c = Counter()
    for spot in Spotting.objects.all():
        try:
            p = Province.objects.get(geom__contains='POINT({0} {1})'.
                    format(spot.lon, spot.lat))
            c[p] = c.get(p, 0) + 1
        except:
            print('WARN: {0} {1} is nowhere'.format(spot.lon,
                                                spot.lat))
    cc = Counter()
    for el in c.elements():
        cc[el.isocode] = c[el] / el.area
    return cc


def countem(req):
    r = HttpResponse(json.dumps(retcount()), mimetype='application/json')
    r['Access-Control-Allow-Origin']  = '*'
    r['Access-Control-Allow-Methods'] = ",".join( XS_SHARING_ALLOWED_METHODS )
    return r

def max(req):
    r = HttpResponse(retcount().most_common(1)[0][1], mimetype='text/plain')
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
