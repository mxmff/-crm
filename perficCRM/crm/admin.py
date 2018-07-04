from django.contrib import admin

# Register your models here.
from crm.models import *

class CustomerAdmin(admin.ModelAdmin):
    list_display = ['name','source','contact_type','contact','consultant','consult_content','status','date']
    list_filter = ['source','status','date']
    search_fields = ['consultant__name','contact']

admin.site.register(CustomerInfo,CustomerAdmin)
admin.site.register(CustomerFollowUp)
admin.site.register(UserProfile)
admin.site.register(Role)
admin.site.register(ClassList)
admin.site.register(Course)
admin.site.register(Menus)