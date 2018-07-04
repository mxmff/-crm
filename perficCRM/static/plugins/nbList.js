(function () {
    requestUrl=null;
    String.prototype.format = function (kwargs) {
            // this ="laiying: {age} - {gender}";
            // kwargs =  {'age':18,'gender': '女'}
            var ret = this.replace(/\{(\w+)\}/g,function (km,m) {
                return kwargs[m];
            });
            return ret;
        };
    function init() {
        $.ajax({
            url:requestUrl,
            type:'GET',
            datatype:'JSON',
            success:function (arg) {
                var result=JSON.parse(arg);
                var config_tabl=result['config_table'];
                var data_lis=result['data_list'];
                initGlobalData(result['global_dict']);
                initHead(config_tabl);
                initBody(config_tabl,data_lis);

            }
        })
    }
    function initHead(arg) {
        var tr=document.createElement('tr');
        $('#table-th').empty();
        $('#table-th').append(tr);
        $.each(arg,function (index,item) {
            var ele=document.createElement('th');
            if(item.display){
                ele.innerHTML=item['title'];
                $(tr).append(ele)
            }
        })

    }
    function initBody(arg,data) {
        $('#table-td').empty();
        $.each(data,function (index,item) {
            var tr=document.createElement('tr');
            // 给tr绑定id
            tr.setAttribute('item-id',item['id']);
            $('#table-td').append(tr);
            $.each(arg,function (i,clo) {
                if(clo.display){
                    var td=document.createElement('td');
                    var text_content=clo['text'].content;
                    var text_kwargs=clo['text'].kwargs;
                    var kvalues={};
                    $.each(text_kwargs,function (k,value) {
                        if (value.substring(0,2) == '@@'){
                            var glaob_name=value.substring(2,value.length)
                            var glaob_id=item[clo.q]
                            kvalues[k]=getGlobalTextById(glaob_name,glaob_id);
                        }
                        else if(value.substring(0,1)=='@'){
                        kvalues[k]=item[value.substring(1,value.length)]
                    }
                        else {
                             kvalues[k]=value
                        }

                    })
                    $.each(clo['attr'],function (kk,vv) {
                        if(vv.substring(0,1) == '@'){
                            var format_value=item[vv.substring(1,vv.length)];
                            td.setAttribute(kk,format_value)
                        }
                        else{
                            td.setAttribute(kk,vv)
                        }

                    })
                    var ktext=text_content.format(kvalues)
                    td.innerHTML=ktext
                    $(tr).append(td)
            }
            })
        })

    }
    function initGlobalData(global_dict) {
        $.each(global_dict,function (k,v) {
            window[k]=v;
        })
    }
    function getGlobalTextById(glaob_name,glaob_id) {
        var ret =null
        $.each(window[glaob_name],function (index,item) {
            if(item[0] == glaob_id){
                ret=item[1]
            }
        })
        return ret
    }
    function innerEditMode() {
        $('#idEditMode').click(function () {
            var classAttr=$(this).hasClass('btn-warning')
            if(classAttr){
                // {#退出编辑模式#}
                $(this).removeClass('btn-warning');
                  $('#table-td').find(':checked').each(function () {
                     var $tr=$(this).parent().parent()
                     trQuitEditMode($tr);
                 })
            }
            else{
                // {#进入编辑模式#}
                 $(this).addClass('btn-warning');
                 // {#找到已被选中的checkBox,让其所在的行进入编辑模式#}
                 $('#table-td').find(':checked').each(function () {
                     var $tr=$(this).parent().parent()
                     trIntoEditMode($tr);
                 })
            }
        })
    }
    function bindCheckBox() {
        $('#table-td').on('click',':checkbox',function () {
             var classAttr=$('#idEditMode').hasClass('btn-warning');
            if(classAttr){
                 var checked=$(this).prop('checked');
                  var $tr=$(this).parent().parent();
                 if(checked){
                     trIntoEditMode($tr)
                 }
                 else{
                     trQuitEditMode($tr)
                 }
            }
        })
    }
    function trIntoEditMode($tr) {
        $tr.children().each(function () {
            var edit_enable=$(this).attr('edit-enable')
            if(edit_enable == 'True'){
                $tr.addClass('success');
                $tr.attr('has-edit','True');
                var edit_type=$(this).attr('edit-type');
                if(edit_type == 'select'){

                    var global_name=$(this).attr('global-name');
                    var select=document.createElement('select');
                    select.setAttribute('class','form-control')
                    var origin=$(this).attr('origin')
                    var new_origin=$(this).attr('new-origin')
                    $.each(window[global_name],function (kk,vv) {
                      var option=document.createElement('option');
                      // {#判断是否有新值，即是否是再次编辑，是则保留上次编辑的值#}
                      if(new_origin==vv[0]){
                          option.selected='selected';
                      }
                        else if(origin==vv[0]){
                          option.selected='selected';
                        }
                      option.value=vv[0];
                      option.innerHTML=vv[1];
                        $(select).append(option)

                    })
                     $(this).html(select)
                }
                else if(edit_type == 'input'){
                    var input = document.createElement('input')
                    input.setAttribute('class','form-control')
                    $(input).prop('type', 'text')
                    var innerText = $(this).text()
                    $(input).val(innerText)
                    $(this).html(input)
                }
                else {
                }
            }
        })
    }
    function trQuitEditMode($tr){
            $tr.removeClass('success');
            $tr.children().each(function () {
            var edit_enable=$(this).attr('edit-enable')
            if(edit_enable == 'True'){
                var $ele=$(this).children().first();
                var edit_type=$(this).attr('edit-type');
                if(edit_type=='select'){
                    var $option=$ele.children(':selected').first()
                    var optionValue=$option.val()
                    $(this).attr('new-origin',optionValue)
                     var innerText=$option.text();
                }
                else if(edit_type=='input'){
                    var innerText=$ele.val();
                     $(this).attr('new-origin',innerText)
                }

                $(this).text(innerText)
                $ele.remove()
            }
        })
    }
    function checkAll() {
        $('#idCheckAll').click(function () {
            var editMode=$('#idEditMode').hasClass('btn-warning');
            $('#table-td').find(':checkbox').each(function () {
                $(this).prop('checked','checked');
                $tr=$(this).parent().parent();
            if(editMode){
                    trClass=$tr.hasClass('success');
                    if(!trClass){
                        trIntoEditMode($tr);
                    }
            }
        })
    })}
    function reverseCheck() {
            $('#idReverseAll').click(function () {
                // {#判断是否进入编辑模式#}
            var editMode=$('#idEditMode').hasClass('btn-warning');
            $('#table-td').find(':checkbox').each(function () {
                var checked=$(this).prop('checked');
                $tr=$(this).parent().parent();
                // {#判断是for已经处于编辑#}
                trClass=$tr.hasClass('success');
                if(checked){
                    $(this).prop('checked',false);
                    if(editMode){
                    if(trClass){
                        trQuitEditMode($tr);
                    }}
                    var dd=$(this).prop('checked');
                    console.log(dd)
                }
                else {
                    $(this).prop('checked', 'checked');
                    if(editMode){
                    if (!trClass) {
                        trIntoEditMode($tr);
                    }}
                }


        })
    })
    }
    function quitALL() {
            var editMode=$('#idEditMode').hasClass('btn-warning');
             $('#table-td').find(':checkbox').each(function () {
                 $(this).prop('checked',false);
                 $tr=$(this).parent().parent();
                 trClass=$tr.hasClass('success');
                 if(editMode){
                     if(trClass){
                         trQuitEditMode($tr);
                     }
                 }
             })
            $('#idEditMode').removeClass('btn-warning');
        }
    function cancelAll() {
        $('#idCancelAll').click(function () {
            quitALL();
        })
    }
    function bindSave() {
        $('#idSave').click(function () {
             quitALL();
            var postList=[];
            $('#table-td').find('tr[has-edit="True"]').each(function () {
                var dict={};
                var id=$(this).attr('item-id');
                dict['id']=id;
                $(this).children('[edit-enable="True"]').each(function (index,that) {
                    var name=$(this).attr('name');
                    var origin=$(this).attr('origin');
                    var new_origin=$(this).attr('new-origin');
                    if(origin != new_origin){
                        dict[name]=new_origin;
                    }
                })
                postList.push(dict)


            })
            $.ajax({
                url:requestUrl,
                type:'PUT',
                data:{'postlist':JSON.stringify(postList)},
                success:function (arg) {

                       init()
                }
            })
        })
    }
    jQuery.extend({
        'NB':function (url) {
            requestUrl=url;
            init();
            innerEditMode();
            bindCheckBox();
            checkAll();
            reverseCheck();
            cancelAll();
            bindSave();
        },
        'changePage':function () {
            init();
        }
    })
})();