from django.conf.urls import patterns, url

urlpatterns = patterns('sawit.views',
    url(r'^/list$', 'countem'),
    url(r'^/add$', 'addem'),
    url(r'^/max$', 'max'),
    url(r'^/lastday$', 'lastday'),
    url(r'^/mostfriendly$', 'mostfriendly'),
)
