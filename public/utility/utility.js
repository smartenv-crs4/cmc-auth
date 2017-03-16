
//var actionSave=true;

var reloadPage=false;



function getadminProfile(myToken){
    $('#admintoken').text(myToken);
}

function generateToken(serviceType,url,myToken){

        //$('#token').text('Tieni il Token ' + myToken);
    $.ajax({
        url: url+"/authms/renewtoken",
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + myToken
        },
        data: JSON.stringify({serviceType:serviceType}),
        contentType: "application/json",
        success: function(data) {
            $('#token').removeClass('alert alert-danger');
            $('#token').removeAttr("role","alert");
            $('#token').text(data.token);
        },
        error: function(data) {
            $('#token').addClass('alert alert-danger');
            $('#token').attr("role","alert");
            $('#token').text(data.responseJSON.error_message);
        }
    });
}




function saveMicroserice(url,myToken){

    //$('#token').text('Tieni il Token ' + myToken);



    var ms = {
            "name": $("input[name='name']").val(),
            "baseUrl": $("input[name='url']").val(),
            "color": $("input[name='color']").val(),
            "icon": $("input[name='icon']").val()
    };

    $.ajax({
        url: url+"/authms/signup",
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + myToken
        },
        data: JSON.stringify(ms),
        contentType: "application/json",
        success: function(data) {
            location.reload();
        },
        error: function(data) {
            $('#errMsg').show();
            // $('#errMsg').addClass('alert alert-danger');
            // $('#errMsg').attr("role","alert");
            $('#errMsg').text(data.responseJSON.error_message);
        }
    });
}



function deleteMicroservice(url,myToken,id){

    //$('#token').text('Tieni il Token ' + myToken);


    //alert();

    //$('#myAlertMsg').modal({show:true,backdrop:false});
    //bootbox.alert("Your message here…");



    $.ajax({
        url: url+"/authms/" +id,
        type: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + myToken
        },
        contentType: "application/json",
        success: function(data) {
            location.reload();
        },
        error: function(data) {
            $('[data-toggle=confirmationalert]').confirmation({title:"Warning",singleton: true , placement: 'left', popout: true, html:true,
                content:'<div class=\"alert alert-danger\" role=\"alert\">' + data.responseJSON.error_message + '</div>',
                buttons: [
                    {
                        class: 'btn btn-primary',
                        label:"Ok"
                    }]});

            $('#'+id).click();
        }
    });

}



function createNewAuth(ms,url,myToken){

    //console.log("Create new Auth:" + JSON.stringify(ms));

    $.ajax({
        url: url+"/authms/authendpoint",
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + myToken
        },
        data: JSON.stringify(ms),
        contentType: "application/json",
        success: function(data) {
            $('#tableauth').append('<tr id=\"'+data._id+'"> \
                                            <td style=\"display:none\">'+data._id+'</td> \
                                            <td>'+data.method+'</td> \
                                            <td>'+data.URI+'</td> \
                                            <td>'+data.authToken+'</td> \
                                             <td> \
                                                <button onclick=\"javascript:updateAuth(\''+data._id + '\',\'' + data.URI +'\',\'' + data.method + '\',\''+ data.authToken +'\',\'' + url + '\',\'' + myToken+'\');\" type=\"button\" class=\"btn btn-info btn-circle\"> \
                                                    <i class=\"fa fa-pencil\"></i> \
                                                </button> \
                                                <button onclick=\"javascript:deleteAuthRole(\''+ data._id + '\',\'' + url + '\',\'' + myToken+'\');\" type=\"button\" class=\"btn btn-warning btn-circle\"> \
                                                    <i class=\"fa fa-trash-o\"></i> \
                                                </button> \
                                            </td> \
                                        </tr>');
            $('#newauth').slideUp(1000);
        },
        error: function(data) {
            $('#errMsgNewAuth').show();
            // $('#errMsg').addClass('alert alert-danger');
            // $('#errMsg').attr("role","alert");
            $('#errMsgNewAuth').text(data.responseJSON.error_message);
        }
    });
}

function updateAuthById(id,ms,url,myToken){
    //console.log("Update new Auth:" + JSON.stringify(ms));

    $.ajax({
        url: url+"/authms/authendpoint/"+id,
        type: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + myToken
        },
        data: JSON.stringify(ms),
        contentType: "application/json",
        success: function(data) {
            $('#'+id).empty();
            $('#'+id).append('<td style=\"display:none\">'+id+'</td> \
                                            <td>'+ms.microservice.method+'</td> \
                                            <td>'+ms.microservice.URI+'</td> \
                                            <td>'+ms.microservice.authToken+'</td> \
                                             <td> \
                                                <button onclick=\"javascript:updateAuth(\''+ id + '\',\'' + ms.microservice.URI +'\',\'' + ms.microservice.method + '\',\''+ ms.microservice.authToken +'\',\'' + url + '\',\'' + myToken+'\');\" type=\"button\" class=\"btn btn-info btn-circle\"> \
                                                    <i class=\"fa fa-pencil\"></i> \
                                                </button> \
                                                <button onclick=\"javascript:deleteAuthRole(\''+ id + '\',\'' + url + '\',\'' + myToken+'\');\" type=\"button\" class=\"btn btn-warning btn-circle\"> \
                                                    <i class=\"fa fa-trash-o\"></i> \
                                                </button> \
                                            </td>');
            $('#newauth').slideUp(1000);
        },
        error: function(data) {
            $('#errMsgNewAuth').show();
            // $('#errMsg').addClass('alert alert-danger');
            // $('#errMsg').attr("role","alert");
            $('#errMsgNewAuth').text(data.responseJSON.error_message);
        }
    });

    // $('#newauth').slideUp(1000);
}



function saveNewAuth(url,myToken){

    //$('#token').text('Tieni il Token ' + myToken);

    var authtokens=[];
    var tokens = $('input[name=Tokens]:checked').each(function() {
        authtokens.push($(this).val());
    });


    var ms = {
        "name": $("input[name='msNameAuth']").val(),
        "URI": $("input[name='msUriAuth']").val(),
        "method": $("select[name='msMethodAuth']").val(),
        "authToken": authtokens
    };


    //console.log("MS-->" + JSON.stringify(ms));
    //console.log("MS-->" + url);

    var id=$("input[name='msId']").val();


    if(id) {

        //console.log("#########################################UPDATE");
        delete ms.name; // can not be updated
        updateAuthById(id, {microservice:ms}, url, myToken);
    }
    else {
        //console.log("###########################################CREATE");
        createNewAuth({microservice:ms}, url, myToken);
    }


}


function ShowOld(){
    $('#newmicroservice').slideDown(1000);
}

function closeWindow(id) {
    $(id).slideUp(1000);
}



function ShowNewAuth(url,myToken,callback){


    $('#errMsgNewAuth').hide();
    $("#tokentypeuser").empty();
    $("#tokentypeapp").empty();
    $("#buttontokentypeuser").empty();
    $("#buttontokentypeapp").empty();
    $("#tokentypems").empty();
    $("input[name='msUriAuth']").val("");
    $("select[name='msMethodAuth']").val("");
    $("input[name='msId']").val("");
    $.ajax({
        url: url + "/tokenactions/gettokentypelist",
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + myToken
        },
        contentType: "application/json",
        success: function(data) {
            for(var item in data.user){
                //console.log("get list"+ data.user[item]);
                $("#tokentypeuser").append('<div class="row"><label class=\"checkbox-inline\"> \
                                            <input name=\"Tokens\" type=\"checkbox\" value=\"'+data.user[item]+'\">' + data.user[item] + ' \
                                        </label></div>');
            }

            $("#buttontokentypeuser").append('<div class="row">' +
                '<hr/> <button data-title="Add New User Types" data-toggle="Userpopover" type="button" class="btn btn-primary btn-xs"> ' +
                '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add User Type </div>');

            for(var item in data.app){
                //console.log("get list"+ data.app[item]);
                $("#tokentypeapp").append('<div class="row"><label class=\"checkbox-inline\"> \
                                            <input name=\"Tokens\" type=\"checkbox\" value=\"'+data.app[item]+'\">' + data.app[item] + ' \
                                        </label></div>');
            }

            $("#buttontokentypeapp").append('<div class="row">' +
                '<hr/> <button data-title="Add New App Types" data-toggle="Userpopover" type="button" class="btn btn-info btn-xs"> ' +
                '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add App Type </div>');

            for(var item in data.ms){
                //console.log("get list"+ data.ms[item]);
                $("#tokentypems").append('<div  class="row"><label class=\"checkbox-inline\"> \
                                            <input name=\"Tokens\" type=\"checkbox\" value=\"'+data.ms[item]+'\">' + data.ms[item] + ' \
                                        </label></div>');
            }

            $('[data-toggle="Userpopover"]').confirmation({
                html:true,
                singleton:true,
                content:'<div class="form-group"> '+
                ' <input id="userTypesL" placeholder="\', \' to separate items" name="name" type="text" autofocus="" class="form-control"> ' +
                ' </div>',
                onConfirm: function() {

                    var tit=($('.popover-title').text());
                    var endPoint="usertypes";
                    var resource={usertype:{}};
                    var key="usertype";
                    if (tit.indexOf("App")>0){
                        key="apptype";
                        resource={apptype:{}};
                        endPoint="apptypes";
                    }

                    var list = $('#userTypesL').val().split(", ");

                    list.forEach(function(item,index){
                        resource[key]={name:item};
                        $.ajax({
                            url: url+"/"+endPoint,
                            type: 'POST',
                            headers: {
                                'Authorization': 'Bearer ' + myToken
                            },
                            data:JSON.stringify(resource),
                            contentType: "application/json",
                            success: function(data) {
                                if(index==(list.length-1))  // if it is the last item then reload the token Types
                                    ShowNewAuth(url,myToken);
                            },
                            error: function(data) {
                                $('#errMsgNewAuth').show();
                                // $('#errMsg').addClass('alert alert-danger');
                                // $('#errMsg').attr("role","alert");
                                $('#errMsgNewAuth').text(data.responseJSON.error_message);
                            }
                        });
                    });
                },
                placement:"top",
                container: 'body',
                buttons: [
                    {
                        class: 'btn btn-primary',
                        icon: 'glyphicon glyphicon-floppy-save',
                    },
                    {
                        class: 'btn btn-default',
                        icon: 'glyphicon glyphicon-remove',
                        cancel: true
                    }
                ]
            });
        },
        error: function(data) {
            console.log(JSON.stringify(data))
        }
    }).promise().done(function(){

        $('#newauth').slideDown(1000);
        if(callback) {
            callback();
        }
    });
}







function setIcon(name){
    //console.log(name);
    $('#icon').val(name);
}



function setColor(name){
    //console.log(name);
    $('#color').val(name);
}



function refreshMs(url,myToken){
    //console.log("GET INSTANCES OUT $ " + url);
    $.ajax({
        url: url+"/authms/actions/instances",
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + myToken
        },
        contentType: "application/json",
        success: function(data) {

            //console.log("GET INSTANCES");
            for(var item in data){
                $('#' +item).text(data[item].instances);
            }

        },
        error: function(data) {
            console.log(data);
        }
    });
}


function msDetails(url,myToken,msName){

    $("#msNameAuth").val(msName); // set form name value for saving it in post
    $("#msdetails").html( "&nbsp; " + msName + " microservice Details");
    
    $.ajax({
        url: url+"/authms/actions/healt/"+msName,
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + myToken
        },
        contentType: "application/json",
        success: function(data) {

            $(".msinstancelist").remove();

            //
            //
            // console.log("MS NAME:" + msName + " Data:" +JSON.stringify(data));

            if(data.baseUrl){
                $('#msinstancelistpanel').before('<div class=\"list-group msinstancelist\">  \
                                                   <a href=\"#\" class="list-group-item\"> \
                                                           <i class=\"fa fa-retweet fa-fw\"></i>' + data.baseUrl + '  \
                                                     <span class=\"pull-right text-muted small\">  \
                                                       <em>baseUrl Gateway</em>  \
                                                     </span>  \
                                                   </a>  \
                                                </div>');
            }

            for(var item in data.nginx){

                    $('#msinstancelistpanel').before('<div class=\"list-group msinstancelist\">  \
                                                   <a href=\"#\" class="list-group-item\"> \
                                                           <i class=\"fa fa-sitemap fa-fw\"></i>' + data.nginx[item].ip + '  \
                                                     <span class=\"pull-right text-muted small\">  \
                                                       <em>Load Balance (nginx)</em>  \
                                                     </span>  \
                                                   </a>  \
                                                </div>');
            }


            for(var item in data.service){

                $('#msinstancelistpanel').before('<div class=\"list-group msinstancelist\">  \
                                                   <a href=\"#\" class="list-group-item\"> \
                                                           <i class=\"fa fa-tasks fa-fw\"></i>' + data.service[item].ip + '  \
                                                     <span style=\"color:'+ data.service[item].color  + '\" class=\"pull-right text-muted small\">  \
                                                       <em>'+ data.service[item].running + '</em>  \
                                                     </span>  \
                                                   </a>  \
                                                </div>');
            }

        },
        error: function(data) {
            console.log(data);
        }
    });

    $('#tableauth').empty();
   //get auth
    $.ajax({
        url: url+"/authms/authendpoint" +"/"+msName,
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + myToken
        },
        contentType: "application/json",
        success: function(data) {
            //
            //
            // console.log("MS NAME:" + msName + " Data:" +JSON.stringify(data));

            var results=data.authendpoints;
            for(var item in results){
                $('#tableauth').append('<tr id=\"'+results[item]._id+'"> \
                                            <td style=\"display:none\">'+results[item]._id+'</td> \
                                            <td>'+results[item].method+'</td> \
                                            <td>'+results[item].URI+'</td> \
                                            <td>'+results[item].authToken+'</td> \
                                            <td> \
                                                <button onclick=\"javascript:updateAuth(\''+ results[item]._id + '\',\'' + results[item].URI +'\',\'' + results[item].method + '\',\''+ results[item].authToken +'\',\'' + url + '\',\'' + myToken+'\');\" type=\"button\" class=\"btn btn-info btn-circle\"> \
                                                    <i class=\"fa fa-pencil\"></i> \
                                                </button> \
                                                <button onclick=\"javascript:deleteAuthRole(\''+ results[item]._id + '\',\'' + url + '\',\'' + myToken+'\');\" type=\"button\" class=\"btn btn-warning btn-circle\"> \
                                                    <i class=\"fa fa-trash-o\"></i> \
                                                </button> \
                                            </td> \
                                        </tr>');
            }
        },
        error: function(data) {
            console.log(JSON.stringify(data));
        }
    });

}


// function openAuthForm(url,token){
//     return new Promise(function(resolve, reject){
//         ShowNewAuth(url,myToken,function(){
//
//         });
//     });
// }



function updateAuth(id,uri,method,authTokens,url,myToken){

    ShowNewAuth(url,myToken,function(){
        $("input[name='msUriAuth']").val(uri);
        $("input[name='msId']").val(id);
        $("select[name='msMethodAuth']").val(method);
        var tokens=authTokens.split(",");
        tokens.forEach(function(tv,tvindex){
            //console.log("TV: " + tv);
            $(":checkbox[value="+tv +"]").attr("checked","true");
        });
    });

}


function deleteAuthRole(id,url,myToken){

    //$('#token').text('Tieni il Token ' + myToken);

    //console.log("DELETE " + id + " " + url);

    $.ajax({
        url: url+"/authms/authendpoint/" + id,
        type: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + myToken
        },
        contentType: "application/json",
        success: function(data) {
            $('#' +id).remove();
        },
        error: function(data) {
            console.log(JSON.stringify(data));
        }
    });
}


function ShowNewToken(callback){

    $('#errMsgNewTokenType').hide();
    $("input[name='TokenTypeId']").val("");
    $("input[name='TokenType']").val("");
    $('#newTokenType').slideDown(1000);
    //$("#rowTokenType").show();
    $("#optionsRadiosInline1").prop('disabled',false);
    $("#optionsRadiosInline2").prop('disabled',false);
    $("#optionschecksuper").prop('checked',false);
    if(callback) {
        callback();
    }
}


function saveNewToken(url,myToken){

    //$('#token').text('Tieni il Token ' + myToken);


    var tokenType = $('input[name=optionsRadiosInline]:checked').val();
    var superuser = $('#optionschecksuper').is(":checked");

    var endPoint="usertypes";
    var resource={usertype:{}};
    var key="usertype";
    var tabletype="tableusertype";
    if (tokenType=="app"){
        key="apptype";
        resource={apptype:{}};
        endPoint="apptypes";
        tabletype="tableapptype";
    }



    var id=$("input[name='TokenTypeId']").val();


    if(id) { // if id is set then the action is update
        var nt = {
            "name": $("input[name='TokenType']").val(),
            "type": tokenType,
            "super":superuser
        };

        resource[key]=nt;

        $.ajax({
            url: url+"/"+endPoint+"/" + id,
            type: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + myToken
            },
            data:JSON.stringify(resource),
            contentType: "application/json",
            success: function(data) {
                $('#'+id).empty();
                $('#'+id).append('<td style=\"display:none\">'+id+'</td> \
                                            <td>'+nt.name+'</td> \
                                            <td>'+nt.super+'</td> \
                                            <td> \
                                                <button onclick=\"javascript:updateTokenType(\''+ id + '\',\'' + nt.name +'\',\'' + nt.type +'\',\''+ nt.super +'\');\" type=\"button\" class=\"btn btn-info btn-circle\"> \
                                                    <i class=\"fa fa-pencil\"></i> \
                                                </button> \
                                                <button onclick=\"javascript:deleteTokenType(\''+ id +'\',\'' + nt.type+ '\',\'' + url + '\',\'' + myToken+'\');\" type=\"button\" class=\"btn btn-warning btn-circle\"> \
                                                    <i class=\"fa fa-trash-o\"></i> \
                                                </button> \
                                                <a id=\"'+id+ "delete" +'" data-toggle=\"deleteTokenAlert\" class="whiteString"></a> \
                                            </td>');
                $('#newTokenType').slideUp(1000);
            },
            error: function(data) {
                $('#errMsgNewTokenType').show();
                // $('#errMsg').addClass('alert alert-danger');
                // $('#errMsg').attr("role","alert");
                $('#errMsgNewTokenType').text(data.responseJSON.error_message);
            }
        });



    }
    else {

        var nt = {
            "name": null ,
            "type": tokenType,
            "super":superuser
        };

        var list = $("input[name='TokenType']").val().split(", ");

        list.forEach(function(item,index){
            nt.name=item;
            resource[key]=nt;
            $.ajax({
                url: url+"/"+endPoint,
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + myToken
                },
                data:JSON.stringify(resource),
                contentType: "application/json",
                success: function(data) {
                    $('#'+tabletype).append('<tr id=\"'+data._id+'"> \
                                            <td style=\"display:none\">'+data._id+'</td> \
                                            <td>'+data.name+'</td> \
                                            <td>'+data.super+'</td> \
                                             <td> \
                                                <button onclick=\"javascript:updateTokenType(\''+ data._id + '\',\'' + data.name +'\',\'' + data.type + '\',\''+data.super  +'\');\" type=\"button\" class=\"btn btn-info btn-circle\"> \
                                                    <i class=\"fa fa-pencil\"></i> \
                                                </button> \
                                                <button onclick=\"javascript:deleteTokenType(\''+ data._id +'\',\'' + data.type+ '\',\'' + url + '\',\'' + myToken+'\');\" type=\"button\" class=\"btn btn-warning btn-circle\"> \
                                                    <i class=\"fa fa-trash-o\"></i> \
                                                </button> \
                                                <a id=\"'+data._id+ "delete" +'" data-toggle=\"deleteTokenAlert\" class="whiteString"></a> \
                                            </td> \
                                        </tr>');
                    if(index==(list.length-1))
                        $('#newTokenType').slideUp(1000);
                },
                error: function(data) {
                    $('#errMsgNewTokenType').show();
                    // $('#errMsg').addClass('alert alert-danger');
                    // $('#errMsg').attr("role","alert");
                    $('#errMsgNewTokenType').text(data.responseJSON.error_message);
                }
            });
        });


    }


}

function TokenTypeDetails(url,myToken){

    //get auth
    $('#tableapptype').empty();
    closeWindow('#newTokenType');

    $.ajax({
        url: url+"/apptypes",
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + myToken
        },
        contentType: "application/json",
        success: function(data) {



            //
            //
            // console.log("MS NAME:" + msName + " Data:" +JSON.stringify(data));

            if(data){
                var results=data.userandapptypes;

                for(var item in results){
                    $('#tableapptype').append('<tr id=\"'+results[item]._id+'"> \
                                                <td style=\"display:none\">'+results[item]._id+'</td> \
                                                <td>'+results[item].name+'</td> \
                                                <td>'+results[item].super+'</td> \
                                                <td> \
                                                    <button onclick=\"javascript:updateTokenType(\''+ results[item]._id + '\',\'' + results[item].name +'\',\'' + results[item].type +'\',\''+ results[item].super +'\');\" type=\"button\" class=\"btn btn-info btn-circle\"> \
                                                        <i class=\"fa fa-pencil\"></i> \
                                                    </button> \
                                                    <button onclick=\"javascript:deleteTokenType(\''+ results[item]._id +'\',\'' + results[item].type+ '\',\'' + url + '\',\'' + myToken+'\');\" type=\"button\" class=\"btn btn-warning btn-circle\"> \
                                                        <i class=\"fa fa-trash-o\"></i> \
                                                    </button> \
                                                    <a id=\"'+results[item]._id+ "delete" +'" data-toggle=\"deleteTokenAlert\" class="whiteString"></a> \
                                                </td> \
                                            </tr>');
                }
            }
        },
        error: function(data) {
            console.log(JSON.stringify(data));
        }
    });


    $('#tableusertype').empty();

    //get auth
    $.ajax({
        url: url+"/usertypes",
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + myToken
        },
        contentType: "application/json",
        success: function(data) {


            //
            //
            // console.log("MS NAME:" + msName + " Data:" +JSON.stringify(data));
            if(data){
                var results=data.userandapptypes;
                for(var item in results){
                    $('#tableusertype').append('<tr id=\"'+results[item]._id+'"> \
                                            <td style=\"display:none\">'+results[item]._id+'</td> \
                                            <td>'+results[item].name+'</td> \
                                            <td>'+results[item].super+'</td> \
                                            <td> \
                                                <button onclick=\"javascript:updateTokenType(\''+ results[item]._id + '\',\'' + results[item].name +'\',\'' + results[item].type +'\',\''+ results[item].super + '\');\" type=\"button\" class=\"btn btn-info btn-circle\"> \
                                                    <i class=\"fa fa-pencil\"></i> \
                                                </button> \
                                                <button onclick=\"javascript:deleteTokenType(\''+ results[item]._id +'\',\'' + results[item].type+ '\',\'' + url + '\',\'' + myToken+'\');\" type=\"button\" class=\"btn btn-warning btn-circle\"> \
                                                    <i class=\"fa fa-trash-o\"></i> \
                                                </button> \
                                                <a id=\"'+results[item]._id+ "delete" +'" data-toggle=\"deleteTokenAlert\" class="whiteString"></a> \
                                            </td> \
                                        </tr>');
                }
            }


        },
        error: function(data) {
            console.log(JSON.stringify(data));
        }
    });

}




function updateTokenType(id,name,type,superuser){

    ShowNewToken(function(){
        $("input[name='TokenTypeId']").val(id);
        $("input[name='TokenType']").val(name);

        $("#optionsRadiosInline1").prop('disabled',true);
        $("#optionsRadiosInline2").prop('disabled',true);



        if(superuser=="true")
            $("#optionschecksuper").prop('checked',true);
        else
            $("#optionschecksuper").prop('checked',false);

        if(type=="app"){
            //console.log("APP");
            $(":radio[value='app']").prop('checked',true);
        }else{
            //console.log("USER");
            $(":radio[value='user']").prop('checked',true);
        }


        //$("#rowTokenType").hide();

    });

}


function deleteTokenType(id,type,url,myToken){

    //$('#token').text('Tieni il Token ' + myToken);

    //console.log("DELETE " + id + " " + url);




    var eP="/usertypes/";
    if(type=="app")
        eP="/apptypes/";

    $.ajax({
        url: url+eP + id,
        type: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + myToken
        },
        contentType: "application/json",
        success: function(data) {
            $('#' +id).remove();
        },
        error: function(data) {
            $('[data-toggle=deleteTokenAlert]').confirmation({title:"Warning",singleton: true , placement: 'top', popout: true, html:true,
                content:'<div class=\"alert alert-danger\" role=\"alert\">' + data.responseJSON.error_message + '</div>',
                buttons: [
                    {
                        class: 'btn btn-primary',
                        label:"Ok"
                    }]});

            $('#'+id+'delete').click();
            //console.log("EROOR inDELETE"+JSON.stringify(data));
        }
    });
}



function getToken(){
    var token=sessionStorage.getItem("token");
    if(token) {
        retV=true;
        $("#wrapper").show();
        $("#login").hide();
    }else{
        $("#wrapper").hide();
        $("#login").show();
    }
    return;
}



function login(url,myToken){

    var ms = {
        "username": $("input[name='username']").val(),
        "password": $("input[name='password']").val(),
        "next": $("input[name='at']").val(),
    };

    $.ajax({
        url: url+"/authuser/signin",
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + myToken
        },
        data: JSON.stringify(ms),
        contentType: "application/json",
        success: function(data) {
           sessionStorage.setItem("token",data.apiKey);
           getToken();
        },
        error: function(data) {
            $('#loginErrorpanel').show();
            $('#loginErrorpanel').text(data.responseJSON.error_message);
        }
    });
}


function logout(url){
    $.ajax({
        url: url+"/logout",
        type: 'POST',
        contentType: "application/json",
        success: function(data) {
            sessionStorage.clear();
            //console.log("LOGOUT");
            document.open();
            document.write(data);
            document.close();
            //$('#logout').submit();

        },
        error: function(data) {
            console.log("LOGOUT ERROR");
        }
    });
}


function showError(msg){
    $('#myAlertMsgModalLabel').text("Something blew up");
    $('#AlertMsgMessage').text(msg);
    $('#myAlertMsg').modal({show: true, backdrop: false});
}

function exportEnvironmentConfig(url,myToken){

    exportMicroserviceList(false,url,myToken,function(err,response){
        console.log("ERRML:"+ err);
        if(err) showError("Incomplete export due " + err + " in Microservice list generation");
        var microservice=response||[];
        exportAuthendpoint(false,true,url,myToken,function(err,response){
            console.log("AUTH:"+ err);
            if(err) showError("Incomplete export due " + err + " in resource access list roles generation");
            var roles=response||{};
            exportTokenTypeList(false,url,myToken,function(err,response){
                console.log("TOKENTYPE:"+ err);
                if(err) showError("Incomplete export due " + err + " in Token type list generation");
                var tokenTypes=response||[];
                var exportJson={
                    microservice:microservice,
                    roles:roles,
                    token:tokenTypes
                };

                var blob = new Blob([JSON.stringify(exportJson)], {type: "text/plain;charset=utf-8"});
                var d = new Date();
                var filename = "Port2020Architecture" + d.toJSON() + ".json";
                saveAs(blob, filename);
            });
        });
    });
}



function ImportEnvironmentConfig(url,myToken){


    var file=$('#fileID')[0].files[0];
    var reader = new FileReader();
    var problems=null;
    reader.onload = function(e) {
        var contents = JSON.parse(e.target.result);
        console.log(contents);
        importMicroservicesListCall({ microservicelist: contents.microservice },url,myToken,function(err){
            if(err) problems="----------------------------IMPORT MICROSERVICE LIST---------------------------\n\r" + err;
            importAuthendpointCall({authendpoint:contents.roles},url,url+"/authms/authendpoint/actions/import",myToken,function(err){
                if(err) problems=(problems||"") + "----------------------------IMPORT AUTHORIZATION ROLES LIST---------------------------\n\r" + err;
                importTokenTypeListCall(contents.token,url,myToken,function(err){
                    if(err) problems=(problems||"") + "----------------------------IMPORT TOKEN TYPES LIST---------------------------\n\r" + err;

                    if(problems) return showError(problems);

                    $('#myInfoMsgModalLabel').text("Import Results");
                    $('#InfoMsgMessage').text("Architecture import setting Done");
                    $('#myInfoMsg').modal({show: true, backdrop: false});
                    reloadPage=true;
                    $('#myInfoMsg').on('hidden.bs.modal', function (e) {
                        if (reloadPage) {
                            reloadPage = false;
                            location.reload();
                        }
                    });

                })
            });
        });
    };
    reader.readAsText(file);
    $('#BrowseFile').remove();
}


function loadEnviromnmentSetting(url,myToken){
    $('#importarchitecture').append("<form id=\"BrowseFile\"> " +
        "<input name=\"filename\" type=\"file\" id=\"fileID\" onchange=\"ImportEnvironmentConfig('"+url+"','"+myToken+"')\"> " +
        "</form>");
    $('#fileID').click();
}


function exportMicroserviceList(save,url,myToken,callback){

    $.ajax({
        url: url + "/authms/actions/microservicelist/export",
        type: 'POST',
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + myToken
        },
        success: function(data) {
            if(save) {
                var blob = new Blob([JSON.stringify(data)], {type: "text/plain;charset=utf-8"});
                var d = new Date();
                var filename = "microservicesListExport_" + d.toJSON() + "_.json";
                saveAs(blob, filename);
            }else{
                callback(null,data);
            }
        },
        error: function(data) {
            //console.log(data);
            var msg = data.responseJSON ? data.responseJSON.error_message : data.statusText;
            if(save) {
                $('#myAlertMsgModalLabel').text("Something blew up");
                $('#AlertMsgMessage').text(msg);
                $('#myAlertMsg').modal({show: true, backdrop: false});
            }else{
                callback(msg,null);
            }
        }
    });
}

function loadMicroserviceList(url,myToken){
    $('#importmicroservicelist').append("<form id=\"BrowseFile\"> " +
        "<input name=\"filename\" type=\"file\" id=\"fileID\" onchange=\"importMicroservicesList('"+url+"','"+myToken+"')\"> " +
        "</form>");
    $('#fileID').click();
}



function importMicroservicesListCall(contents,url,myToken,callback){

    $.ajax({
        url: url+"/authms/actions/microservicelist/import",
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(contents),
        headers: {
            'Authorization': 'Bearer ' + myToken
        },
        success: function(data) {
            //console.log(data);
            if(callback){
             callback(null);
            }else {
                $('#myInfoMsgModalLabel').text("Import Results");
                $('#InfoMsgMessage').text("Microservice List import Done");
                $('#myInfoMsg').modal({show: true, backdrop: false});
                reloadPage=true;
                $('#myInfoMsg').on('hidden.bs.modal', function (e) {
                    if (reloadPage) {
                        reloadPage = false;
                        location.reload();
                    }
                });

            }

        },
        error: function(data) {
            //console.log(data);
            var msg= data.responseJSON ? data.responseJSON.error_message : data.statusText;
            if(callback){
                callback(msg);
            }else {
                reloadPage = true;
                $('#myAlertMsgModalLabel').text(data.responseJSON.error);
                $('#AlertMsgMessage').text(msg);
                $('#myAlertMsg').modal({show: true, backdrop: false});
                $('#myAlertMsg').on('hidden.bs.modal', function (e) {
                    if (reloadPage) {
                        reloadPage = false;
                        location.reload();
                    }
                });
            }

        }
    });
}


function importMicroservicesList(url,myToken){
    var file=$('#fileID')[0].files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var contents ={ microservicelist: JSON.parse(e.target.result)};
        importMicroservicesListCall(contents,url,myToken);
    };
    reader.readAsText(file);
    $('#BrowseFile').remove();
}



function exportAuthendpoint(save,all,url,myToken,callback){
    var filename="";
    if (!all){
        var name= $("input[name='msNameAuth']").val();
        filename=name+"_";
        url=url+"/authms/authendpoint/actions/export/" + name;
    }else{
        url=url+"/authms/authendpoint/actions/export";
    }

    $.ajax({
        url: url,
        type: 'POST',
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + myToken
        },
        success: function(data) {
            if(save) {
                var blob = new Blob([JSON.stringify(data)], {type: "text/plain;charset=utf-8"});
                var d = new Date();
                filename = filename + "authEndPointRolesExport_" + d.toJSON() + "_.json";
                saveAs(blob, filename);
            }else{
                callback (null,data);
            }

        },
        error: function(data) {
            //console.log(data);
            var msg = data.responseJSON ? data.responseJSON.error_message : data.statusText;
            if(save) {
                $('#myAlertMsgModalLabel').text("Something blew up");
                $('#AlertMsgMessage').text(msg);
                $('#myAlertMsg').modal({show: true, backdrop: false});
            }else{
                callback(msg,null);
            }
        }
    });
}

function importAuthendpointCall(contents,baseUrl,urlToCall,myToken,callback){
    $.ajax({
        url: urlToCall,
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(contents),
        headers: {
            'Authorization': 'Bearer ' + myToken
        },
        success: function(data) {
            //console.log(data);
            if(callback){
                callback(null);
            }else {
                $('#myInfoMsgModalLabel').text("Import Results");
                $('#InfoMsgMessage').text("AuthEndpoint import Done");
                $('#myInfoMsg').modal({show: true, backdrop: false});
                msDetails(baseUrl, myToken, name || "authms");
            }

        },
        error: function(data) {
            //console.log(data);
            var msg= data.responseJSON ? data.responseJSON.error_message : data.statusText;
            if(callback){
                callback(msg);
            }else {
                $('#myAlertMsgModalLabel').text("Something blew up");
                $('#AlertMsgMessage').text(msg);
                $('#myAlertMsg').modal({show: true, backdrop: false});
            }
        }
    });
}

function importAuthendpoint(all,url,myToken){

    var file=$('#fileID')[0].files[0];
    var reader = new FileReader();
    var originalUrl=url;
    reader.onload = function(e) {
        var contents ={ authendpoint: JSON.parse(e.target.result)};
        if (!all){
            var name= $("input[name='msNameAuth']").val();
            url=url+"/authms/authendpoint/actions/import/" + name;
        }else{
            url=url+"/authms/authendpoint/actions/import";
        }

        importAuthendpointCall(contents,originalUrl,url,myToken);

    };
    reader.readAsText(file);
    $('#BrowseFile').remove();
}

function deleteOpenDialog(){
    $('#BrowseFile').remove();
}

function openDialog(all,url,myToken){
    // $('#importauthroles').append("<form method='POST' action='http://localhost:3005/authms/authendpoint/actions/import/userms?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoibXMiLCJpc3MiOiJub3QgdXNlZCBmbyBtcyIsImVtYWlsIjoibm90IHVzZWQgZm8gbXMiLCJ0eXBlIjoiYXV0aG1zIiwiZW5hYmxlZCI6dHJ1ZSwiZXhwIjoxNzk2NDc4ODc4MzE1fQ.we6pV7Rn3iYUfJD5T-T8cj7Her4S6lIMQUoZbmlA7a0' enctype='multipart/form-data'> " +
    //                                 "<input name=\"filename\" type=\"file\" id=\"fileID\"> " +
    //                                 "CAMPO TESTO <input type=\"text\" name=\"testo1\">" +
    //                                 "<input type=\"submit\"> " +
    //                              "</form>");
    $('#importauthroles').append("<form id=\"BrowseFile\"> " +
                                    "<input name=\"filename\" type=\"file\" id=\"fileID\" onchange=\"importAuthendpoint("+all+",'"+url+"','"+myToken+"')\"> " +
                                 "</form>");
    $('#fileID').click();
}


function exportUserTokenTypeList(url,myToken,callback){
    $.ajax({
        url: url+ "/usertypes?skip=-1&limit=-1",
        type: 'GET',
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + myToken
        },
        success: function(datauser) {
           callback(null,datauser);

        },
        error: function(data) {
            var msg = data.responseJSON ? data.responseJSON.error_message : data.statusText;
            callback(msg,null);
        }
    });
}

function exportApplicationTokenTypeList(url,myToken,callback){
    $.ajax({
        url: url+ "/apptypes?skip=-1&limit=-1",
        type: 'GET',
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + myToken
        },
        success: function(dataapp) {
            callback(null,dataapp);


        },
        error: function(data) {
            var msg = data.responseJSON ? data.responseJSON.error_message : data.statusText;
            callback(msg,null);
        }
    });
}


function exportTokenTypeList(save,url,myToken,callback){


    exportApplicationTokenTypeList(url,myToken,function(errapp,dataapp){
        exportUserTokenTypeList(url,myToken,function(erruser,datauser){
            var data;
            if(erruser && errapp) return showError("Incomplete export  in token type list generation");
            if(errapp){
                data=datauser.userandapptypes;
                showError("Incomplete export due " + errapp + " in application token type list generation");
            } else if(erruser){
                data=dataapp.userandapptypes;
                showError("Incomplete export due " + erruser + " in user token type list generation");
            } else data = datauser.userandapptypes.concat(dataapp.userandapptypes);

            if(save) {
                var blob = new Blob([JSON.stringify(data)], {type: "text/plain;charset=utf-8"});
                var d = new Date();
                var filename = "tokenTypeList_" + d.toJSON() + "_.json";
                saveAs(blob, filename);
            }else{
                callback(null,data);
            }
        });
    });
}


function importTokenTypeListCall(list,url,myToken,respnsecallback){

    var problems=null;
    var originalUrl=url;
    var content;

    var tokeTypelist=[];


    async.series([
            function(clb) {   // get all application token type
                $.ajax({
                    url: url + "/apptypes",
                    type: 'GET',
                    contentType: "application/json",
                    headers: {
                        'Authorization': 'Bearer ' + myToken
                    },
                    success: function (data) {
                        console.log(JSON.stringify(data));
                        if(data){
                            tokeTypelist=tokeTypelist.concat(data.userandapptypes);
                        }
                        clb(null,"one");
                    },
                    error: function (data) {
                        clb(null,"one");
                    }
                });
            },
            function(clb) {  // get all user token type
                $.ajax({
                    url: url + "/usertypes",
                    type: 'GET',
                    contentType: "application/json",
                    headers: {
                        'Authorization': 'Bearer ' + myToken
                    },
                    success: function (data) {
                        if(data){
                            tokeTypelist=tokeTypelist.concat(data.userandapptypes);
                        }
                        clb(null,"Two");
                    },
                    error: function (data) {
                        clb(null,"Two");
                    }
                });
            },
            function(clb) {  // delete token types
                async.forEach(tokeTypelist, function (element,next) {

                    if(element.type=="user") {
                        originalUrl = "/usertypes";
                    }
                    else {
                        originalUrl = "/apptypes";
                    }

                    $.ajax({
                        url: url + originalUrl+ "/" + element._id ,
                        type: 'DELETE',
                        contentType: "application/json",
                        headers: {
                            'Authorization': 'Bearer ' + myToken
                        },
                        success: function(data) {
                            next();

                        },
                        error: function(data) {
                           next();
                        }
                    });

                },function(err){
                    clb();
                });
            },
            function(clb) {  // import token types
                async.forEachOf(list, function (element, key, callback) {

                    if(element.type=="user") {
                        content={"usertype":element};
                        originalUrl = "/usertypes";
                    }
                    else {
                        content={"apptype":element};
                        originalUrl = "/apptypes";
                    }

                    $.ajax({
                        url: url + originalUrl+ "?name=" + element.name +"&type=" + element.type ,
                        type: 'GET',
                        contentType: "application/json",
                        headers: {
                            'Authorization': 'Bearer ' + myToken
                        },
                        success: function(data) {
                            if(data){
                                callback();
                            } else {
                                $.ajax({
                                    url: url + originalUrl,
                                    type: 'POST',
                                    contentType: "application/json",
                                    data: JSON.stringify(content),
                                    headers: {
                                        'Authorization': 'Bearer ' + myToken
                                    },
                                    success: function (data) {
                                        callback();

                                    },
                                    error: function (data) {
                                        problems = (problems || "") + " " + (data.responseJSON ? data.responseJSON.error_message : data.statusText);
                                        callback();
                                    }
                                });
                            }
                        },
                        error: function(data) {
                            console.log(data);
                            problems=(problems || "") + " "+ (data.responseJSON ? data.responseJSON.error_message : data.statusText);
                            callback();
                        }
                    });

                }, function (err) {
                    clb();
                });
            }
        ],
// optional callback
        function(err, results) {
            if(problems){
                if(respnsecallback){
                    respnsecallback(problems);
                }else {
                    $('#myAlertMsgModalLabel').text("Something blew up");
                    $('#AlertMsgMessage').text(problems);
                    $('#myAlertMsg').modal({show: true, backdrop: false});
                }
            }else{
                if(respnsecallback){
                    respnsecallback(null);
                }else {
                    $('#myInfoMsgModalLabel').text("Import Results");
                    $('#InfoMsgMessage').text("Token Types list import Done!");
                    $('#myInfoMsg').modal({show: true, backdrop: false});
                }
            }
        });

}

function importTokenTypeList(url,myToken){

    var file=$('#fileID')[0].files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var list =JSON.parse(e.target.result);
       importTokenTypeListCall(list,url,myToken);
    };
    
    reader.readAsText(file);
    $('#BrowseFile').remove();
}


function loadTokenTypeList(url,myToken){
    // $('#importauthroles').append("<form method='POST' action='http://localhost:3005/authms/authendpoint/actions/import/userms?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoibXMiLCJpc3MiOiJub3QgdXNlZCBmbyBtcyIsImVtYWlsIjoibm90IHVzZWQgZm8gbXMiLCJ0eXBlIjoiYXV0aG1zIiwiZW5hYmxlZCI6dHJ1ZSwiZXhwIjoxNzk2NDc4ODc4MzE1fQ.we6pV7Rn3iYUfJD5T-T8cj7Her4S6lIMQUoZbmlA7a0' enctype='multipart/form-data'> " +
    //                                 "<input name=\"filename\" type=\"file\" id=\"fileID\"> " +
    //                                 "CAMPO TESTO <input type=\"text\" name=\"testo1\">" +
    //                                 "<input type=\"submit\"> " +
    //                              "</form>");
    $('#importtokentypelist').append("<form id=\"BrowseFile\"> " +
        "<input name=\"filename\" type=\"file\" id=\"fileID\" onchange=\"importTokenTypeList('"+url+"','"+myToken+"')\"> " +
        "</form>");
    $('#fileID').click();
}

// refresh microservice inf 

//setInterval(function(){ refreshMs()}, 60000);