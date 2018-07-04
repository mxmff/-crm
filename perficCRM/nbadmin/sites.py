from nbadmin.admin_base_class import BaseNbAdmin
class AdminSite(object):
    def __init__(self):
        self.enabled_admins = {}

    def register(self,models_class,admin_class=None):
        '''注册admin表'''
        if admin_class:
            admin_class=admin_class()
        else:
            admin_class=BaseNbAdmin()
        admin_class.model=models_class
        app_name=models_class._meta.app_label
        models_name=models_class._meta.model_name
        if app_name not in self.enabled_admins:
            self.enabled_admins[app_name]={}
        self.enabled_admins[app_name][models_name]=admin_class



site=AdminSite()


