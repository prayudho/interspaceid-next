var optShow  = $('.formFloat'),
    options = $('.options'),
    noOptions = options.not($('.disabled')),
    getData = $('.getData'),
    close = $('.closeFormFloat'),
    findList = $('.findList');


$(document).ready(function(){
	tableData({
		'url' : ajaxFile + "/data",
		'elmTable' : "table_1",
		'loadAfter': 5,
		'showPaging':6
	});
});

function closeSearchForm(){
    $('html').css('overflow-y','auto');
    options.removeClass('disabled');
    optShow.removeClass('active');
    optShow.find('.form-control').val('');
}

function waiting() {
	$("#add-loading").html('<div class="loadingPage text-center"><span class="box"><img src="'+livepath+'/assets/img/Facebook.svg"><span>Loading Page</span></span></div>');
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

function afterLoadTable(urlAjaxFile) {
	// SELECT GRID 1
	$(".Grid1 .editRow").on("click", function() {
		$(".formGrid1 .group-btn").html(
			'<span class="btn btn-sm btn-outline-success font-weight-bold mr-2 submitForm update" id="update" onclick="doUpdate()"><i class="fa fa-refresh"></i> Update</span>'+
			'<span class="btn btn-sm btn-outline-danger font-weight-bold mr-2 cancelForm cancel" onclick="doCancel()"><i class="fa fa-ban"></i> Cancel</span>'
		);
		$(".formGrid1").show();
		$(".Grid1").hide();
		var id = $(this).attr('id');
		do_select(id);
        closeSearchForm();
	});

    $(".Grid1 .viewRow").on("click", function() {
        var id = $(this).attr('id');
        $(".Grid1").hide();
        $(".Grid2, .backToMain").show();
        do_select(id);
        closeSearchForm();
	});
	
	// ADD FROM GRID 1
	$(".Grid1 .addForm").on('click', function() {
		$(".formGrid1 .group-btn").html(
			'<span class="btn btn-sm btn-outline-success font-weight-bold mr-2 submitForm save" id="save" onclick="doSave()"><i class="fa fa-save"></i> Save</span>'+
			'<button type="reset" class="btn btn-sm btn-outline-warning font-weight-bold mr-2 reset" ><i class="fa fa-eraser"></i> Reset</button>'+
			'<span class="btn btn-sm btn-outline-danger font-weight-bold mr-2 cancelForm cancel" onclick="doCancel()"><i class="fa fa-ban"></i> Cancel</span>'
		);
		backToGrid();
		$(".Grid1").hide();
		$(".formGrid1").show();
        closeSearchForm();
		if (typeof afterNewForm == 'function') afterNewForm();
	});
	
	// CONFIRM DELETE GRID 1
	$(".Grid1 .deleteRow").on('click', function() {
		var id = $(this).attr("id");
		Lobibox.confirm({
			title   : 'Confirm Delete',
			width   : '300',
			msg     : "Are you sure you want to delete this item?",
			callback: function ($this, type, ev) {
				if(type == 'yes') {
					do_delete(id);
				}
			}
		});
	});
	
	// CANCEL GRID 1
	/*$(".formGrid1 .cancel").on('click', function() {
		$(".Grid1").show();
		$(".formGrid1, .formGrid2, .Grid2").hide();
		backToGrid();
	})*/
	
	// CANCEL GRID 2
	/*$(".formGrid2 .cancel").on('click', function() {
		$(".Grid2").show();
		$(".formGrid2").hide();
		backToGridDetail();
	})*/
}

function afterLoadTableDetail(urlAjaxFile) {
	// ADD FROM GRID 2
	$(".Grid2 .addForm").on('click', function() {
		$(".formGrid1").addClass("overlays");
		$(".formGrid2 .group-btn").html(
			'<span class="btn btn-sm btn-outline-success font-weight-bold mr-2 submitForm save" id="save" onclick="doSaveDetail()"><i class="fa fa-save"></i> Save Detail</span>'+
			'<button type="reset" class="btn btn-sm btn-outline-warning font-weight-bold mr-2 reset" ><i class="fa fa-eraser"></i> Reset Detail</button>'+
			'<span class="btn btn-sm btn-outline-danger font-weight-bold mr-2 cancelForm cancel" onclick="doCancelDetail()"><i class="fa fa-ban"></i> Cancel Detail</span>'
		);
		backToGridDetail();
		$(".Grid2").hide();
		$(".formGrid2").show();
        closeSearchForm();
		if (typeof afterNewFormDetail == 'function') afterNewFormDetail();
	});
	
	// SELECT GRID 2
	$(".Grid2 .backToMain").on("click", function() {

	});

	$(".Grid2 .editRow").on("click", function() {
		$(".formGrid2 .group-btn").html(
			'<span class="btn btn-sm btn-outline-success font-weight-bold mr-2 submitForm update" id="update" onclick="doUpdateDetail()"><i class="fa fa-refresh"></i> Update Detail</span>'+
			'<span class="btn btn-sm btn-outline-danger font-weight-bold mr-2 cancelForm cancel" onclick="doCancelDetail()"><i class="fa fa-ban"></i> Cancel Detail</span>'
		);
		$(".formGrid2").show();
		// $(".formGrid1").addClass("overlays");
		$(".Grid2").hide();
		var id = $(this).attr('id');
		do_selectDetail(id);
        closeSearchForm();
	});
	
	// CONFIRM DELETE GRID 2
	$(".Grid2 .deleteRow").on('click', function() {
		var id = $(this).attr("id");
		var idHeader = $("#txtIdHeader").val();
		Lobibox.confirm({
			title   : 'Confirm Delete',
			width   : '300',
			msg     : "Are you sure you want to delete this item?",
			callback: function ($this, type, ev) {
				if(type == 'yes') {
					do_deleteDetail(id, idHeader);
				}
			}
		});
	});
}

function doSave() {
    $(".overSpin").show();
    tinyMCE.triggerSave();
    //$(".btn-primary").addClass('loading');
    var formdata = new FormData($("#myForm")[0]);
    if (formdata) {
        $.ajax({
            url: ajaxFile + "/save",
            type: "POST",
            dataType: "JSON",
            data: formdata,
            cache: false,
            processData: false,
            contentType: false,
            success: completeHandler = function (obj) {
                if (obj.status != 'ok') {
					checkSession(obj);
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
					if (typeof afterMainSave == 'function') afterMainSave();
					Lobibox.notify('success', {
						msg       : 'Save Successfully',
						width       : '100%',
						size		: 'mini',
                        delay       : 5000,
                        showClass   : 'fadeInUp',
                        hideClass   : 'fadeOutDown'
					});

					
					$(".formGrid1 .group-btn").html(
						'<span class="btn btn-sm btn-outline-success font-weight-bold mr-2 submitForm update" id="update" onclick="doUpdate()"><i class="fa fa-refresh"></i> Update</span>'+
						'<span class="btn btn-sm btn-outline-danger font-weight-bold mr-2 cancelForm cancel" onclick="doCancel()"><i class="fa fa-arrow-left"></i> Back to Main List</span>'
					);
					$('.backToMain').hide();
					
					tableData({
						'url' : ajaxFile + "/data",
						'elmTable' : "table_1",
						'loadAfter': 5,
						'showPaging':6
					});
					
					tableData({
						'url' : ajaxFile + "/datadetail",
						'elmTable' : "table_2",
						'loadAfter': 5,
						'showPaging':6,
						'id' : obj.id
					});
					
					$("#txtId, #txtIdHeader").val(obj.id);
                    //$('.table-cont, .pagingWraps, .wrapsBtns').hide();
					$(".formGrid1").removeClass("overlays");
					$(".Grid2").show();
					// $(".Grid2").hide();
					$(".formGrid2").hide();
					updateTable();
                    //backToGrid();

					/*tableData({
						'url' : ajaxFile + "/data",
						'elmTable' : "table_1",
						'loadAfter': 5,
						'showPaging':6
					});
					
					$(".Grid1").show();
					$(".formGrid1").hide();
					backToGrid();*/ 
                }
            }
        });
    }
}

function doSaveDetail() {
    $(".overSpin").show();
    tinyMCE.triggerSave();
    //$(".btn-primary").addClass('loading');
    var formdata = new FormData($("#myFormDetail")[0]);
    if (formdata) {
        $.ajax({
            url: ajaxFile + "/saveDetail",
            type: "POST",
            dataType: "JSON",
            data: formdata,
            cache: false,
            processData: false,
            contentType: false,
            success: completeHandler = function (obj) {
                if (obj.status != 'ok') {
					checkSession(obj);
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
					Lobibox.notify('success', {
						msg			: 'Save Successfully',
						width       : '100%',
						size		: 'mini',
                        delay       : 5000,
                        showClass   : 'fadeInUp',
                        hideClass   : 'fadeOutDown'
					});
					
					tableData({
						'url' : ajaxFile + "/datadetail",
						'elmTable' : "table_2",
						'loadAfter': 5,
						'showPaging':6,
						'id' : obj.idheader
					});
					
					$(".formGrid1").removeClass("overlays");
					$(".Grid2").show();
					$(".formGrid2").hide();
					backToGridDetail(); 
                }
            }
        });
    }
}

function doUpdate() {
    waiting();
    tinyMCE.triggerSave();
    var formdata = new FormData($("#myForm")[0]);
    if (formdata) {
        $.ajax({
            url: ajaxFile + "/update",
            type: "POST",
            dataType: "JSON",
            data: formdata,
            cache: false,
            processData: false,
            contentType: false,
            success: completeHandler = function (obj) {
                if (obj.status != 'ok') {
					// removeWaiting();
                   /*Lobibox.notify('error', {
					    msg			: 'Error',
					    width       : '100%',
					    size		: 'mini',
					    delay       : 5000,
					    showClass   : 'fadeInUp',
					    hideClass   : 'fadeOutDown'
				   });*/
				   checkSession(obj);
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
					Lobibox.notify('success', {
						msg			: 'Update Successfully',
						width       : '100%',
						size		: 'mini',
						delay       : 5000,
                        showClass   : 'fadeInUp',
                        hideClass   : 'fadeOutDown'
					});
					
					var gotoPage = parseInt($("#goto_table_1").val());
					getLoadData({
						'url' : ajaxFile + "/data",
						'elmTable' : "table_1",
						'loadAfter': 5,
						'showPaging':6
					}, gotoPage);
					/*tableData({
						'url' : ajaxFile + "/data",
						'elmTable' : "table_1",
						'loadAfter': 5,
						'showPaging':6
					});*/
					
					// $(".Grid1, .Grid2").show();
					$(".Grid1").show();
					// $(".formGrid1, .formGrid2").hide();
					$(".formGrid1").hide();
					backToGrid();
					// backToGridDetail();
				}
            }
        });
    }

}

function doUpdateDetail() {
    waiting();
    tinyMCE.triggerSave();
    var formdata = new FormData($("#myFormDetail")[0]);
    if (formdata) {
        $.ajax({
            url: ajaxFile + "/updatedetail",
            type: "POST",
            dataType: "JSON",
            data: formdata,
            cache: false,
            processData: false,
            contentType: false,
            success: completeHandler = function (obj) {
                if (obj.status != 'ok') {
					checkSession(obj);
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
					Lobibox.notify('success', {
						msg			: 'Update Successfully',
						width       : '100%',
						size		: 'mini',
                        delay       : 5000,
                        showClass   : 'fadeInUp',
                        hideClass   : 'fadeOutDown'
					});
					
					var gotoPage = parseInt($("#goto_table_2").val());
					getLoadData({
						'url' : ajaxFile + "/datadetail",
						'elmTable' : "table_2",
						'loadAfter': 5,
						'showPaging':6,
						'id' : obj.idheader
					}, gotoPage);
					
					/*tableData({
						'url' : ajaxFile + "/datadetail",
						'elmTable' : "table_2",
						'loadAfter': 5,
						'showPaging':6,
						'id' : obj.idheader
					});*/
					
					$(".formGrid1").removeClass("overlays");
					$(".Grid2").show();
					$(".formGrid2").hide();
					backToGridDetail();
				}
            }
        });
    }
}

function do_select(id){
	waiting();
	$.ajax({
		url: ajaxFile + '/select',
		type: 'POST',
		data: {
			id: id
		},
		dataType: 'JSON',
		success: function (obj) {
			checkSession(obj);
			$(".new").hide();
			/*$(".viewForm").show(function () {
				backToUpdate();
				if (typeof menuAdmin[halPage].upload != 'undefined') {
					$("#hdKode").val(id);
					$(".coverUpload").show();
					getLoadData(id);
				}
			});*/
			$.each(obj.data, function (key, val) {
				$.each(val, function (keyV, valV) {
					 if (tinyMCE.get(keyV) != null) {
						if(valV != null) {
							tinyMCE.get(keyV).setContent(valV);
						}
					} else if ($("#inputImage" + keyV).is(":file")) {
						if(valV != "") {
							$("#imagePreview" + keyV).html("<img src='"+pathupload+valV+"' /> <a class='btn btn-sm btn-danger mt-3' onclick='delImg(\""+keyV+"\", \""+val.txtId+"\", \"Grid1\")'><i class='fa fa-trash'></i> Remove</a>");
						}
					} else if ($("#inputFile" + keyV).is(":file")) {
						if(valV != "") {
							$("#filePreview" + keyV).html("<div class='fileNamePreview'>"+valV+"</div> <a class='btn btn-sm btn-danger mt-3' onclick='delImg(\""+keyV+"\", \""+val.txtId+"\", \"Grid1\")'><i class='fa fa-trash'></i> Remove</a>");
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
				
				if (typeof afterSelect == 'function') afterSelect(val, obj);
			});
			
			$('.datePickerTime').on('cancel.daterangepicker', function(ev, picker) {
				$(this).val('');
			 });
			
			tableData({
				'url' : ajaxFile + "/datadetail",
				'elmTable' : "table_2",
				'loadAfter': 5,
				'showPaging':6,
				'id' : id
			});
			
			$(".Grid2 #exportCont a").attr("href", $(".Grid2 #exportCont a").attr("href") + '/' + id);
			$("#txtIdHeader").val(id);
			
			$(".selectpicker").selectpicker("refresh");
			
			/*$(".update").show();
			$(".save, .reset, .addNew").hide();*/
		}
	})
}

function do_selectDetail(id){
	waiting();
	$.ajax({
		url: ajaxFile + '/selectdetail',
		type: 'POST',
		data: {
			id: id
		},
		dataType: 'JSON',
		success: function (obj) {
			checkSession(obj);
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
							$("#imagePreview" + keyV).html("<img src='"+pathupload+valV+"' /> <a class='btn btn-sm btn-danger mt-3' onclick='delImg(\""+keyV+"\", \""+val.txtIdDetail+"\", \"Grid2\")'><i class='fa fa-trash'></i></a>");
						}
					} else if ($("#inputFile" + keyV).is(":file")) {
						if(valV != "") {
							$("#filePreview" + keyV).html("<div class='fileNamePreview'>"+valV+"</div> <a class='btn btn-sm btn-danger mt-3' onclick='delImg(\""+keyV+"\", \""+val.txtIdDetail+"\", \"Grid2\")'><i class='fa fa-trash'></i> Remove</a>");
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
				if (typeof afterSelectDetail == 'function') afterSelectDetail(val, obj);
			});
			
			$('.datePickerTime').on('cancel.daterangepicker', function(ev, picker) {
				$(this).val('');
			 });
			 
			$(".selectpicker").selectpicker("refresh"); 
			
			/*$(".update").show();
			$(".save, .reset, .addNew").hide();*/
		}
	});
	// removeWaiting();
}

function do_delete(id) {
    if(typeof id == 'undefined'){
        id = $("#txtId").val();
    }
        $.ajax({
            url: ajaxFile + '/delete',
            type: 'POST',
            dataType: 'JSON',
            data: {
                txtId: id
            },
            success: function (obj) {
                if (obj.status == 'error') {
					checkSession(obj);
					Lobibox.notify('error', {
						msg			: 'Error',
						width       : '100%',
						size		: 'mini',
                        delay       : 5000,
                        showClass   : 'fadeInUp',
                        hideClass   : 'fadeOutDown'
					});
                } else {
					Lobibox.notify('success', {
						msg			: 'Delete Successfully',
						width       : '100%',
						size		: 'mini',
                        delay       : 5000,
                        showClass   : 'fadeInUp',
                        hideClass   : 'fadeOutDown'
					});
					
					var gotoPage = parseInt($("#goto_table_1").val());
					getLoadData({
						'url' : ajaxFile + "/data",
						'elmTable' : "table_1",
						'loadAfter': 5,
						'showPaging':6
					}, gotoPage);
					
                    /*tableData({
						'url' : ajaxFile + "/data",
						'elmTable' : "table_1",
						'loadAfter': 5,
						'showPaging':6
					});*/
                }
            }
        });

}

function do_deleteDetail(id, idHeader) {
    if(typeof id == 'undefined'){
        id = $("#txtIdDetail").val();
    }
	    $.ajax({
            url: ajaxFile + '/deletedetail',
            type: 'POST',
            dataType: 'JSON',
            data: {
                txtId: id,
				txtIdHeader: idHeader
            },
            success: function (obj) {
                if (obj.status == 'error') {
					checkSession(obj);
					Lobibox.notify('error', {
						msg			: 'Error',
						width       : '100%',
						size		: 'mini',
                        delay       : 5000,
                        showClass   : 'fadeInUp',
                        hideClass   : 'fadeOutDown'
					});
                } else {
					Lobibox.notify('success', {
						msg			: 'Delete Successfully',
						width       : '100%',
						size		: 'mini',
                        delay       : 5000,
                        showClass   : 'fadeInUp',
                        hideClass   : 'fadeOutDown'
					});
                    
					var gotoPage = parseInt($("#goto_table_2").val());
					getLoadData({
						'url' : ajaxFile + "/datadetail",
						'elmTable' : "table_2",
						'loadAfter': 5,
						'showPaging':6,
						'id' : obj.idheader
					}, gotoPage);
					/*tableData({
						'url' : ajaxFile + "/datadetail",
						'elmTable' : "table_2",
						'loadAfter': 5,
						'showPaging':6,
						'id' : obj.idheader
					});*/
					
                }
            }
        });

}

function doCancel() {
	$(".Grid1").show();
	$(".formGrid1, .formGrid2, .Grid2").hide();
	$('.tables').removeClass('emptyOn');
    $('.table-cont, .pagingWraps, .wrapsBtns').show();
    updateTable();
	backToGrid();
}

function doCancelDetail() {
	$(".formGrid1").removeClass("overlays");
	$(".Grid2").show();
	$(".formGrid2").hide();
	backToGridDetail();
}

function backToGrid() {
	$(":input[type='text'], input[type='hidden'], input[type='file'], textarea, select").not(".filterCont input, .filterCont select, input[name='goto'], select[name='showLength']").val("");
	//$(":input[type='text'], input[type='hidden'], input[type='file'], textarea, select").not("select[name='showLength'], select[name='slFilter'], input[name='txtSearch'], input[name='goto']").val("");
	$.each($(".customTextArea"), function (key, val) {
		tinymce.get($(this).attr('id')).setContent('');
	});
	$(":radio, :checkbox").attr("checked", false);
	//$("select").not("select[name='showLength'], select[name='slFilter']").prop("selected", false);
	$(".selectpicker").selectpicker("refresh");
	$("div[id^=imagePreview], div[id^=filePreview]").html("");
	$(".tagit-choice").remove();
	updateTable();
}

function backToGridDetail() {
	$(".formGrid2 :input[type='text'], .formGrid2 input[type='hidden'], .formGrid2 input[type='file'], .formGrid2 textarea, .formGrid2 select").not(".formGrid2 .filterCont input, .formGrid2 .filterCont select, .formGrid2 input[name='goto'], .formGrid2 select[name='showLength'], .formGrid2 #txtIdHeader").val("");
	//$(".formGrid2 :input[type='text'], .formGrid2 input[type='hidden'], .formGrid2 input[type='file'], .formGrid2 textarea, .formGrid2 select").not(".formGrid2 input[name='txtSearch'], .formGrid2 #txtIdHeader, .formGrid2 input[name='goto'], .formGrid2 select[name='showLength'], .formGrid2 select[name='slFilter']").val("");
	$.each($(".formGrid2 .customTextArea"), function (key, val) {
		tinymce.get($(this).attr('id')).setContent('');
	});
	$(".formGrid2 :radio, .formGrid2 :checkbox").not(".settingPanel input[type='checkbox']").attr("checked", false);
	$(".formGrid2 select").not(".formGrid2 select[name='showLength'], .formGrid2 select[name='slFilter']").prop("selected", false);
	$(".selectpicker").selectpicker("refresh");
	$(".formGrid2 div[id^=imagePreview], .formGrid2 div[id^=filePreview]").html("");
	$(".formGrid2 .tagit-choice").remove();
	updateTable();
	/*$(".formGrid2 .update").hide();
	 $(".formGrid2 .save, .formGrid2 .reset, .formGrid2 .addNew").show();*/
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
            url: ajaxFile + '/unlink',
            type: 'POST',
            dataType: 'JSON',
            data: {
                id: id,
				type: typegrid,
				selector: selector
            },
            success: function (obj) {
                if (obj.status == 'error') {
					checkSession(obj);
					$(".overSpin").hide();
                    alert(obj.msg);
                } else {
					$(".overSpin").hide();
                    $("#imagePreview"+selector).html("");
                    $("#filePreview"+selector).html("");
					
					if(typegrid == 'Grid1') {
						tableData({
							'url' : ajaxFile + "/data",
							'elmTable' : "table_1",
							'loadAfter': 5,
							'showPaging':6
						});
					}else{
						tableData({
							'url' : ajaxFile + "/datadetail",
							'elmTable' : "table_2",
							'loadAfter': 5,
							'showPaging':6,
							'id' : id
						});
					}
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

function checkSession(obj){
	if(obj.session == false) {
		location.href = livepath;
	}
}