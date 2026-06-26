var optShow  = $('.formFloat'),
    options = $('.options'),
    noOptions = options.not($('.disabled')),
    getData = $('.getData'),
    close = $('.closeFormFloat'),
    findList = $('.findList');

var splitListId = ajaxParam.split("/");
var listId = (typeof splitListId[1] != 'undefined') ? splitListId[1] : "";
$(document).ready(function(){
	waiting();
	do_select(select_id);
});

function waiting() {
	$("#add-loading").html('<div class="loadingPage text-center"><span class="box"><img src="'+livepath+'/Assets/img/Facebook.svg"><span>Loading Page</span></span></div>');
	$('.breads').hide();
	$('.ftr').hide();
}

function removeWaiting() {
	setTimeout(function() {
		$("#add-loading").empty();
		$('.breads').show();
		$('.ftr').show();
	}, 1000);
}

function closeSearchForm(){
    $('html').css('overflow-y','auto');
    options.removeClass('disabled');
    optShow.removeClass('active');
    optShow.find('.form-control').val('');
}

function doUpdate() {
    waiting();
    tinyMCE.triggerSave();
    var formdata = new FormData($("#myForm")[0]);
    if (formdata) {
        $.ajax({
            url: ajaxFile + "/update" + ajaxParam,
            type: "POST",
            dataType: "JSON",
            data: formdata,
            cache: false,
            processData: false,
            contentType: false,
            success: completeHandler = function (obj) {
                if (obj.status != 'ok') {
					removeWaiting();
					$(".errMsgDesc").remove();
					$("input, select, textarea").removeClass("errMsg");
					var errMsg = obj.error;
					$.each(errMsg, function(kErr, vErr) {
						if(vErr != '') {
							$("#"+kErr).addClass("errMsg");
							$("#"+kErr).parent().append("<span class='errMsgDesc'>"+vErr+"</span>");
							Lobibox.notify('error', {
								msg		: vErr,
								width       : '100%',
								size		: 'mini',
								delay       : 5000,
								showClass   : 'fadeInUp',
								hideClass   : 'fadeOutDown'
							});
							
							removeErrMsg();
						}
					})
                } else {
					removeWaiting();
                    if (typeof afterUpdate == 'function') afterUpdate(obj);
					Lobibox.notify('success', {
						msg			: 'Update Successfully',
						width       : '100%',
						size		: 'mini',
						delay       : 3500,
						showClass   : 'bounceIn',
						hideClass   : 'bounceOut'
					});
					/*var gotoPage = parseInt($("#goto_table_1").val());
					getLoadData({
						'url' : ajaxFile + "/data",
						'elmTable' : "table_1",
						'loadAfter': 5,
						'showPaging':6,
						'id':listId
					}, gotoPage);*/
					/*tableData({
						'url' : ajaxFile + "/data",
						'elmTable' : "table_1",
						'loadAfter': 5,
						'showPaging':6
					});*/
					
					$(".Grid1").show();
					$(".formGrid1").hide();
					backToGrid();
                    footerFloat();
				}
            }
        });
    }
}

function doUpdateOnly() {
    waiting();
    tinyMCE.triggerSave();
    var formdata = new FormData($("#myForm")[0]);
    if (formdata) {
        $.ajax({
            url: ajaxFile + "/update" + ajaxParam,
            type: "POST",
            dataType: "JSON",
            data: formdata,
            cache: false,
            processData: false,
            contentType: false,
            success: completeHandler = function (obj) {
                if (obj.status != 'ok') {
					removeWaiting();
                   Lobibox.notify('error', {
					   msg			: obj.error,
					   width       	: '100%',
					   size			: 'mini',
					   delay       	: 3500,
					   showClass   	: 'bounceIn',
					   hideClass   	: 'bounceOut'
					});
                } else {
					removeWaiting();
                    if (typeof afterUpdateOnly == 'function') afterUpdateOnly(obj);
				}
            }
        });
    }
}

function do_select(id, type){
	waiting();
	$.ajax({
		url: ajaxFile + '/select' + ajaxParam,
		type: 'POST',
		data: {
			id: id
		},
		dataType: 'JSON',
		success: function (obj) {
			clearError();
			$(".new").hide();
			$(".viewForm").show(function () {
				backToUpdate();
				if (typeof menuAdmin[halPage].upload != 'undefined') {
					$("#hdKode").val(id);
					$(".coverUpload").show();
					getLoadData(id);
				}
			});
			
			$.each(obj.data, function (key, val) {
				$.each(val, function (keyV, valV) {
					 if (tinyMCE.get(keyV) != null) {
						if(valV != null) {
							tinyMCE.get(keyV).setContent(valV);
						}
					} else if ($("#inputImage" + keyV).is(":file")) {
						if(valV != "") {
							var btnFileImg = "";
							if(typeof type == "undefined") {
								var btnFileImg = "<a class='btn btn-warning' onclick='delImg(\""+keyV+"\", \""+val.txtId+"\", \"Grid1\")'>Remove</a>";
							}
							$("#imagePreview" + keyV).html("<img src='"+pathupload+valV+"' /> "+btnFileImg);
						}
					} else if ($("#inputFile" + keyV).is(":file")) {
						if(valV != "") {
							var btnFileImg = "";
							if(typeof type == "undefined") {
								var btnFileImg = "<a class='btn btn-warning' onclick='delImg(\""+keyV+"\", \""+val.txtId+"\", \"Grid1\")'>Remove</a>";
							}
							$("#filePreview" + keyV).html("<div class='fileNamePreview'>"+valV+"</div> "+btnFileImg);
						}
					} else if ($("input[name='"+ keyV +"']").is(":radio")) {
						$("#" + keyV + valV).prop("checked", true);
					} else if ($("input[name^='"+ keyV +"']").is(":checkbox")) {
						var val_list = valV.split(",");
						$.each(val_list, function(kL, vL) {
							$("#" + keyV + vL).prop("checked", true);
						});
					} else if ($("#"+ keyV).attr("multiple") == 'multiple') {
						var val_list = valV.split(",");
						$.each(val_list, function(kL, vL) {
							$("#"+ keyV + " option[value="+vL+"]").prop("selected", true);
						});
					} else if ($("#"+ keyV).is(":radio, :checkbox")) {
						// == Hanya untuk menu access ==	
						$("#" + keyV).prop("checked", true);
						// =============================
					} else if (typeof(obj.class[keyV]) != 'undefined' && obj.class[keyV] == 'amountprice') {
						$("#" + keyV).val(numeral(valV).format('0,0'));
					} else {
						$("#" + keyV).val(valV);
						
						changeDatepicker(keyV, valV);
					}
				});
				
				$('.datePickerTime').on('cancel.daterangepicker', function(ev, picker) {
					$(this).val('');
				 });
				  
				if (typeof afterSelect == 'function') { 
					afterSelect(val, obj);
				}else{
					removeWaiting();
				}
			});
			
			$(".selectpicker").selectpicker("refresh");
			
			if(typeof type == "undefined") {
				$(".update").show();
				$(".save, .reset, .addNew").hide();
			}else{
				$(".save, .update, .reset, .addNew").hide();
			}

		}
	});
}

function getAjax(url, dat) {
	if(typeof url == 'undefined') {
		url = "";
	}
	if(typeof dat == 'undefined') {
		dat = {};
	}
	var res = "";
	$.ajax({
		url: url,
		type: 'POST',
		data: dat,
		dataType: 'JSON',
		async:false,
		success: function (obj) {
			res = obj;
		}
	});
	return res;
}

function delImg(selector, id, typegrid){
	var msg = confirm('Are you sure you want to delete this image?');
    if (msg == true) {
		$(".overSpin").show();
        $.ajax({
            url: ajaxFile + '/unlink' + ajaxParam,
            type: 'POST',
            dataType: 'JSON',
            data: {
                id: id,
				type: typegrid,
				selector: selector
            },
            success: function (obj) {
                if (obj.status == 'error') {
					$(".overSpin").hide();
                    alert(obj.msg);
                } else {
					$(".overSpin").hide();
                    $("#imagePreview"+selector).html("");
                    $("#filePreview"+selector).html("");
                }
            }
        })
    } else {
        return false;
    }
    return false;
}

function changeDatepicker(keyV, valV) {
	if(valV == "") {
		$("#" + keyV).val("");
	}else{
		$("#" + keyV+".datePickerSingle").daterangepicker({
			singleDatePicker: true,
			showDropdowns: true,
			locale: {
				format: 'DD-MM-YYYY'
			}
		});
		
		$("#" + keyV+".datePickerTime").daterangepicker({
			singleDatePicker: true,
			timePicker: true,
			timePickerIncrement: 1,
			locale: {
				format: 'DD-MM-YYYY HH:mm:ss'
			}
		}); 
	}
}

function removeErrMsg() {
	$(".errMsgDesc").on("click", function() {
		$(this).prev().removeClass("errMsg");
		$(this).prev().focus();
		$(this).remove();
	})
}

function clearError() {
	$(".errMsg").removeClass("errMsg");
	$(".errMsgDesc").remove();
}

function checkSession(obj){
	if(obj.session == false) {
		location.href = livepath;
	}
}
