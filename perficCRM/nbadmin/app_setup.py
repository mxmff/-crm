from django import  conf
import importlib

def nbadmin_setup_discover():
    installed_apps=conf.settings.INSTALLED_APPS
    app_list=[]
    for app_name in installed_apps:
        try:
            app=importlib.import_module('%s.%s'%(app_name,'kingadmin'))
            print(dir(app))
            app_list.append(dir(app))
        except ModuleNotFoundError as e:
            pass

    return app_list


app_list=nbadmin_setup_discover()