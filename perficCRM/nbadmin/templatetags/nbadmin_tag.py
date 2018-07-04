from django.template import Library
from django.utils.safestring import mark_safe
import datetime
register=Library()

@register.simple_tag
def build_table_row(models_obj,admin_class):
    ele = ''
    if  admin_class.list_display:
        for column_name in admin_class.list_display:
                column_obj=admin_class.model._meta.get_field(column_name)
                if column_obj.choices:
                    column_data = getattr(models_obj, 'get_%s_display'%column_name)()
                else:
                    column_data=getattr(models_obj,column_name)
                ta_ele='<td>%s</td>'%column_data
                ele=ele+ta_ele
    else:
        ele=ele+'<td>%s</td>'%models_obj
    return  mark_safe(ele)

@register.simple_tag
def build_filter_row(filter_column,admin_class):
    try:
        filter_ele = '<select name=%s>' % filter_column
        choices_obj=admin_class.model._meta.get_field(filter_column)
        selected=''
        for choices in choices_obj.get_choices():
            selected = ''
            if filter_column in admin_class.filter_dicts:
                if str(choices[0]) == admin_class.filter_dicts[filter_column]:
                    selected='selected'
            option_ele='<option value="%s" %s>%s</option>'%(choices[0],selected,choices[1])
            filter_ele=filter_ele+option_ele
    except AttributeError as  e:
        filter_ele = '<select name=%s__gte>' % filter_column
        if choices_obj.get_internal_type() in ('DateField','DateTimeField'):
            time_obj=datetime.datetime.now()
            time_list=[
                ('','---------'),
                (time_obj,'今天'),
                (time_obj-datetime.timedelta(7),'七天内'),
                (time_obj.replace(day=1), '本月内'),
                (time_obj.replace(month=1,day=1), '本年内')
            ]
            for i in time_list:
                selected = ''
                time_str='' if not i[0] else '%s-%s-%s'%(i[0].year,i[0].month,i[0].day)
                if '%s__gte'%filter_column in admin_class.filter_dicts:
                    if time_str== admin_class.filter_dicts['%s__gte'%filter_column]:
                        selected = 'selected'
                option_ele = '<option value="%s" %s>%s</option>' % (time_str,selected,i[1])
                filter_ele = filter_ele + option_ele
    filter_ele=filter_ele+'</select>'

    return mark_safe(filter_ele)