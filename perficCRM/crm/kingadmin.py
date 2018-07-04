from nbadmin import sites
from  crm import models
from nbadmin.admin_base_class import BaseNbAdmin
class Kl(BaseNbAdmin):
    list_display=['name','menus']
class CusromersAdmin(BaseNbAdmin):
    list_display = ['name','source','contact_type','contact','consultant','consult_content','status','date']
    list_filter = ['source','status','date']
    search_fields = ['consultant__name','contact']

sites.site.register(models.Role,Kl)
sites.site.register(models.CourseRecord)
sites.site.register(models.Course)
sites.site.register(models.Menus)
sites.site.register(models.Branch)
sites.site.register(models.UserProfile)
sites.site.register(models.CustomerInfo,CusromersAdmin)


