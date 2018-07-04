from django.shortcuts import render,HttpResponse,redirect
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import  login_required
from nbadmin import app_setup
from nbadmin.sites import site
from nbadmin import  pager
from django.utils.safestring import mark_safe
# Create your views here.

def acc_login(request):
    error_msg=''
    if request.method == 'GET':
        return  render(request,'nbadmin/login.html',{'error_msg':error_msg})
    username = request.POST.get('username')
    password = request.POST.get('password')
    user=authenticate(username=username,password=password)
    if user:
        login(request,user)
        url=request.GET.get('next','/')
        return  redirect(url)
    else:
        error_msg='用户密码错误'
        return render(request, 'nbadmin/login.html', {'error_msg': error_msg})

def acc_logout(request):
    logout(request)
    return redirect('/nbadmin/login/')

@login_required
def app_index(request):
    return render(request,'nbadmin/app_index.html',{'site':site})




def get_filter_result(request,models_obj):
    filter_dict={}
    for k,v in request.GET.items():
        if k == 'p':
            continue
        if v:
            filter_dict[k]=v
    current_page = request.GET.get('p', default=1)
    total_count = models_obj.objects.filter(**filter_dict).count()
    pagenator = pager.Pagination(total_count, current_page)
    models_obj=models_obj.objects.filter(**filter_dict)[pagenator.start():pagenator.end()]
    return models_obj,filter_dict,pagenator


@login_required
def table_obj_list(request,app_name,models_name):
    admin_class = site.enabled_admins[app_name][models_name]
    admin_class.models_name = models_name
    if len(request.GET) <= 1:
        total_count=admin_class.model.objects.all().count()
        current_page=request.GET.get('p',default=1)
        pagenator=pager.Pagination(total_count,current_page,1)
        models_obj=admin_class.model.objects.all()[pagenator.start():pagenator.end()]
        admin_class.filter_dicts =[]
    else:

        models_obj,filter_dicts,pagenator=get_filter_result(request,admin_class.model,)
        admin_class.filter_dicts=filter_dicts

    return render(request,'nbadmin/table_obj_list.html',{'models_obj':models_obj,'admin_class':admin_class,'page_str':mark_safe(pagenator.page_str(request.path))})