from nbadmin import sites
from  studentes import models


class Kl(object):
    display_list=['name','menus']
sites.site.register(models.duan,Kl)

