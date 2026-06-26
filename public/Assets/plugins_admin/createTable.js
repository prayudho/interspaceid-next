    /* totalPaging = "Jumlah total page",
        pagingShow  = "Page yang show",
        totalDataView = "Jumlah data yang show",
        loadAfterPage = "Api data di load pada page berkelipatan"
    */

	window.totalDataView = 10, offset = 100, sort = "ASC", order = "", src="";

	function tableData(arDat) {
		var errTableData = "", offsetValue = 100;
		if(typeof arDat.url == 'undefined' && arDat.url == '') {
			errTableData = errTableData + "url must be filled \n";
		}
		if(typeof arDat.elmTable == 'undefined' && arDat.elmTable == '') {
			errTableData = errTableData + "elmTable must be filled \n";
		}
		/*if(typeof arDat.loadAfter != 'undefined' && arDat.loadAfter != '') {
			window.loadAfterPage = arDat.loadAfter;
		}else{
			window.loadAfterPage = 5;
		}*/
		//window.loadAfterPage = 100 / $("#showLength_"+arDat.elmTable).val();
		window.loadAfterPage = 100 / 25;
		if(typeof arDat.showPaging != 'undefined' && arDat.showPaging != '') {
			window.pagingShow = arDat.showPaging;
		}else{
			window.pagingShow = 6;
		}
		
		if(errTableData != "") {
			alert(errTableData);
			return false;
		}
		
		// Digunakan untuk mengisi semua array yg tidak dimasukan dari table
		var arDat = {
			'url' : arDat.url,
			'elmTable' : arDat.elmTable,
			'loadAfter': loadAfterPage,
			'showPaging':pagingShow,
			'id'	: arDat.id
		}

		buildDisplayPanel(arDat);
		getLoadData(arDat);
	}

	function buildDisplayPanel(arDat) {
		/*if(typeof arDat.id != 'undefined') {
			addFilterTable = addFilterTableDetail;
		}*/
		/* Sementara diganti ini */
		var matchUrl = arDat.url;
		if(matchUrl.match(/datadetail/)){
			addFilterTable = addFilterTableDetail;
		}
		/* ===================== */
		var all = $('.allFilterNew'),
			topPanel = '<form class="mR5" name="frmSearch_'+arDat.elmTable+'" id="frmSearch_'+arDat.elmTable+'" onsubmit="doSearchTable(\''+arDat.url+'\', \''+arDat.elmTable+'\', '+arDat.loadAfter+', '+arDat.showPaging+', '+arDat.id+'); return false;">'+
                addFilterTable +
                '<div class="form-group mT20 floatBottom">'+
                    '<button type="submit" class="filterBtn btn btn-sm btn-outline-success font-weight-bold mr-2"><i class="fa fa-filter"></i> Filter</button>'+
                    '<button type="reset" class="btn btn-sm btn-outline-warning font-weight-bold mr-2 reset"><i class="fa fa-eraser"></i> Reset</button>'+
                    '<span class="btn btn-sm btn-outline-danger font-weight-bold mr-2 cancelForm mL5 closeFormFloat"><i class="fa fa-ban"></i> Cancel</span>'+
                '</div>'+
            '</form>';

		var bottomPanel = '<div class="pagingWraps"><nav class="float-right">'+
            '<ul class="pagination" id="pagination_'+arDat.elmTable+'"></ul></nav>'+
            '<input type="text" name="goto" id="goto_'+arDat.elmTable+'" class="pull-left goto" onkeyup="doGoTo(\''+arDat.url+'\', \''+arDat.elmTable+'\', '+arDat.loadAfter+', '+arDat.showPaging+', '+arDat.id+'); return false;">'+
            '<span class="pageInfo pull-left mR10" id="pageinfo_'+arDat.elmTable+'"></span>|'+
            '<span class="findCustom mL10">Page view '+
				'<select class="pageView" name="showLength" id="showLength_'+arDat.elmTable+'">'+
				'<option value="10">10</option>'+
				'<option value="25" selected="selected">25</option>'+
				'<option value="50">50</option>'+
				'<option value="100">100</option>'+
            '</select>'+
            '</span></div></div>';

		if($(".res"+arDat.elmTable).length < 1) {			
			$("#"+arDat.elmTable).wrap("<div class='table-cont res"+arDat.elmTable+"'>");
			$(".table-cont #"+arDat.elmTable).parent().parent().find('.allFilterNew').append(topPanel);
			$(".table-cont #"+arDat.elmTable).parent().after(bottomPanel);
		}
	}

	function buildTable(elmTable, getData) {
		var topPanel = '<form class="customColumns" name="" id="">'+
			'<div class="form-group checkbox">'+
			'<label><input type="checkbox" name="cc" value="c1" class="getData cColumnAll">Select All Columns</label><br>'+
			'<label><input type="checkbox" name="cc" value="c1" class="getData cColumn">Column 1</label><br>'+
			'<label><input type="checkbox" name="cc" value="c2" class="getData cColumn">Column 2</label><br>'+
			'<label><input type="checkbox" name="cc" value="c3" class="getData cColumn">Column 3</label><br>'+
			'</div>'+
			'</form>';

		//Header
		$("#"+elmTable).empty();
		var cont = $("<div class='tableContainer flexcroll'></div>"),
			rowHead = $("<ul class='list-unstyled tblHead tableHead'></ul>"),
			rowData = $("<ul class='list-unstyled tblContent contentTable'></ul>"),
			clear = $("<span class='clearfix'></span>");

        if(getData.data != '') {
            $.each(getData.header, function (key, val) {
                if (key != 'action' && key != 'txtName' && key != "txtId" && key != "txtIdDetail" && key != "txtIdHeader") {
                    rowHead.append("<li class='"+getData.class[key]+" "+key+"' rel='"+key+"'><span class='sorter "+key+"' title='Sort this field' rel='"+key+"'></span><i class='fa fa-lock pinBtn' title='Pin this field'></i><span class='lbls'>" + val + "</span><span class='tableResize'></span></li>");
                }
                if (key == 'txtName') {
                    rowHead.append("<li class='lName "+key+"' rel='"+key+"'><span class='sorter "+key+"' title='Sort this field' rel='"+key+"'></span><i class='fa fa-lock pinBtn' title='Pin this field'></i><span class='lbls'>" + val + "</span><span class='tableResize'></span></li>");
                }
                if (key == 'action') {
                    rowHead.append("<li class='"+key+"' rel='"+key+"'><span class='lbls'>" + val + "</span></li>");
                }
            });
        }else{
            $.each(getData.header, function (key, val) {
                if (key != 'action' && key != 'txtName' && key != "txtId" && key != "txtIdDetail" && key != "txtIdHeader") {
                    rowHead.append("<li class='" + getData.class[key] + "'><span class='lbls'>" + val + "</span></li>");
                }
                if (key == 'txtName') {
                    rowHead.append("<li class='lName'><span class='lbls'>" + val + "</span></li>");
                }
                if (key == 'action') {
                    rowHead.append("<li class='" + key + "' rel='" + key + "'><span class='lbls'>" + val + "</span></li>");
                }
            });
        }
		rowHead.append(clear);
		cont.append(rowHead);
		
		//Data
		var dataAvailable = 0;
        if(getData.data != ''){
            //console.log(getData.data);
            $('.tables').removeClass('emptyOn');
            $('.pagingWraps, .assignOption').removeClass('hideOn');
            $.each(getData.data, function(kData, vData){
                var rowList = $("<li class='listTable'></li>"),
                    list = $("<ul class='list-unstyled horz d-inline-block'></ul>");

                $.each(getData.header, function(k, v) {
                    var viewData = vData[k], pt = livepath + '/Assets/img/';

                    if (typeof getData.class != 'undefined') {
                        if (typeof getData.class[k] != 'undefined') {
                            classtd = 'class ="' + getData.class[k] + '"';
                            if (getData.class[k] == 'amountprice') {
                                viewData = numeral(viewData).format('0,0');
                            }
                            else if (getData.class[k] == 'url') {
                                viewData = "<a href=" + viewData + " target=_blank>" + viewData + "</a>";
                            }
                        }
                    }
                    if(k != 'action' && k != 'txtName' && !k.match(/fImage/) /*&& k != 'fImage'*/ && k != "txtId" && k != "txtIdDetail" && k != "txtIdHeader") {
                        list.append("<li class='"+k+" "+getData.class[k]+"'>"+viewData+"</li>");
                    }
                    if(k == 'txtName') {
                        list.append("<li class='"+k+" lName'>"+viewData+"</li>");
                    }
                    //if(k == 'fImage') {
					if(k.match(/fImage/)) {
                        list.append("<li class='text-center "+k+" fImage'>" +
							"<i tabindex='0' data-toggle='popover' data-html='true'  data-placement='right' data-trigger='focus' data-content='<div class=imgContMini><img src="+pt+viewData+"></div>' class='ml-2 pop text-primary pointer fa fa-image'></i>" +
						"</li>");
                    }
                    if(k == 'action') {
                        list.append("<li class='"+k+" dropdown dropright text-center'><a class='btn btn-transparent border-0' href='#' id='action"+v+"' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='fa fa-ellipsis-h text-danger' title='Action'></i></a><div class='dropdown-menu dropdown-menu-right shadow text-left ml-3 mt-0 py-0' aria-labelledby='action"+v+"'>"+viewData+"</div></li>");
                    }
                });
                list.append(clear);
                rowList.append(list);
                rowData.append(rowList);
                dataAvailable = dataAvailable + 1;
                $('.table-cont, .pagingWraps, .wrapsBtns').show();
            });
        }else{
            var rowList = $("<li class='listTable'></li>"),
                list = $("<ul class='list-unstyled horz emptyList'></ul>");
            	//$('.table-cont, .pagingWraps, .wrapsBtns').hide();
                list.append("<li class='font-weight-bold text-center'>- - - - Data is empty - - - -</li>");
                list.append(clear);
                rowList.append(list);
                rowData.append(rowList);

            $('.tables').addClass('emptyOn');
        }


		cont.append(rowData);
		$("#"+elmTable).append(cont);
		tableResize('table_1');
		tableResize('table_2');
        $('[data-toggle="popover"]').popover();

        // $('.fImage .pop[rel=popover]').popover({
        //     html: true,
        //     placement: 'right',
        //     content: function(){return '<img src="'+$(this).data('image')+'">';}
        // });

		$('[data-toggle="tooltip"]').tooltip();

		//Check Local Storage for pinned
		if(typeof localStorage.pinned != 'undefined'){
			var cls = localStorage.pinned,
				pw = 0,
				mw = $('.tblHead li.'+localStorage.pinned).outerWidth(),
				xw = $('.tblContent li.'+cls).outerWidth(),
				aw = $('.tblHead li.'+localStorage.pinned).prevAll().outerWidth();

			$('.tblHead li.'+localStorage.pinned).addClass('holdLine').parents('.tables').addClass('pinned');
			$('.tblHead li.'+localStorage.pinned).find('.pinBtn').prop('title', 'Unpin this field');

			//Set Left value for header list;
			var elm = $('.tblHead li.'+localStorage.pinned).prevAll();
			$('.tblHead li.'+localStorage.pinned).addClass('pins');
			elm.addClass('pins');

			$.each(elm, function(k, v){
				pw = pw + $(v).outerWidth();
				var clw = 0;
				$.each($(v).prevAll(), function(k1, v1){
					clw = clw + $(v1).outerWidth();
				});
				$(v).css({left : clw});
			});
			$('.tblHead li.'+localStorage.pinned).css({left : pw});
			$('.tblHead li.'+localStorage.pinned).parents('.tables').find('.tblHead').css({paddingLeft: mw + pw});

			//Set Left value for body list;
			var elmL = $('.tblContent li.listTable');
			$.each(elmL, function(k, v){
				bw = 0;
				var elmB = $(v).find('li.'+cls).prevAll();
				$(v).find('li.'+cls).addClass('pins holdLine');
				elmB.addClass('pins');

				$.each(elmB, function(k, v){
					bw = bw + $(v).outerWidth();
					var clwB = 0;
					$.each($(v).prevAll(), function(k1, v1){
						clwB = clwB + $(v1).outerWidth();
					});
					$(v).css({left : clwB});
				});
				$(v).find('li.'+cls).css({left : bw});
				$('.tblContent li.'+cls).parents('ul.contentTable').css({paddingLeft: xw + bw});
			});
			updateTable();
		}


        var t = $('.tables');
		$('.pinBtn').bind('click', function(){
			var cls = $(this).parent().attr('rel'),
				pw = 0,
				mw = $(this).parent().outerWidth(),
				xw = $('.tblContent li.'+cls).outerWidth(),
				aw = $(this).parent().prevAll().outerWidth();

			//Clear all class
			if(typeof localStorage.pinned != 'undefined'){
				localStorage.removeItem('pinned');
				$(this).prop('title', 'Pin this field');
				t.removeClass('pinned').find('li').removeClass('pins holdLine');
				t.find('.tblHead, .tblContent').css({paddingLeft:''});
				t.find('.tblHead li, .tblContent li').css('left','');
				Lobibox.notify('warning', {
					msg		: 'This Field Unpinned',
					width       : '100%',
					size		: 'mini',
					delay       : 3500,
					showClass   : 'bounceIn',
					hideClass   : 'bounceOut'
				});
				updateTable()
			}else{
				localStorage.pinned = cls;
				$(this).parent().addClass('holdLine').parents('.tables').addClass('pinned');
				$(this).prop('title', 'Unpin this field');
				//Set Left value for header list;
				var elm = $(this).parent().prevAll();
				$(this).parent().addClass('pins');
				elm.addClass('pins');

				$.each(elm, function(k, v){
					pw = pw + $(v).outerWidth();
					var clw = 0;
					$.each($(v).prevAll(), function(k1, v1){
						clw = clw + $(v1).outerWidth();
					});
					$(v).css({left : clw});
				});
				$(this).parent().css({left : pw});
				$(this).parents('.tables').find('.tblHead').css({paddingLeft: mw + pw, width: 'auto'});

				//Set Left value for body list;
				var elmL = $('.tblContent li.listTable');
				$.each(elmL, function(k, v){
					bw = 0;
					var elmB = $(v).find('li.'+cls).prevAll();
					$(v).find('li.'+cls).addClass('pins holdLine');
					elmB.addClass('pins');

					$.each(elmB, function(k, v){
						bw = bw + $(v).outerWidth();
						var clwB = 0;
						$.each($(v).prevAll(), function(k1, v1){
							clwB = clwB + $(v1).outerWidth();
						});
						$(v).css({left : clwB});
					});
					$(v).find('li.'+cls).css({left : bw});
					$('.tblContent li.'+cls).parents('ul.contentTable').css({paddingLeft: xw + bw, width: 'auto'});
				});
				Lobibox.notify('success', {
					msg		: 'This Field already Pinned',
					width       : '100%',
					size		: 'mini',
					delay       : 3500,
					showClass   : 'bounceIn',
					hideClass   : 'bounceOut'
				});
			}

		});

		$('.settingHeader').bind('click', function(){
			//topPanel.empty();
			Lobibox.window({
				title: 'Customize Columns',
				width: 600,
				height: 500,
				content: topPanel,
				buttons: {
					cancel: {
						'class': 'btn btn-default',
						text: 'Cancel',
						closeOnClick: true
					},
					ok: {
						'class': 'btn btn-success',
						text: 'Apply',
						closeOnClick: true
					}
				},
				callback: function(lobibox, type) {
					//var btnType;
					if (type === 'ok') {
						alert('Update Columns Success');
					}
				}
			});


			var ck = $('.customColumns .cColumn');
			$('.customColumns .cColumnAll').change(function () {
				$('.customColumns .cColumn').prop('checked', $(this).prop('checked'));
			});
			ck.change(function () {
				var e = ck.length,
					e_checked = $('.cColumn:checked').length;

				if(e != e_checked){
					$('.cColumnAll').prop('checked',false);
				}else{
					$('.cColumnAll').prop('checked',true);
				}
			});
			preventDefault;
		});

        var optShow  = $('.formFloat'),
            options = $('.options'),
            noOptions = options.not($('.disabled')),
            getData = $('.getData'),
            close = $('.closeFormFloat'),
            findList = $('.findList');

        //Function for All Options Content
        noOptions.bind('click', function(){
            var status = this.checked,
                me = $(this),
                rel = me.attr('rel');

            $('html').css('overflow-y','hidden');
            options.removeClass('disabled');
            me.addClass('disabled');
            optShow.not($('div#' + rel)).removeClass('active').find('.form-control').val('');
            $('.formFloat#' + rel).addClass('active').find('.body-form').scrollTop(0);
            $('.setting-panel').removeClass('active');
        });

        //Function for Close All Options Content
        close.bind('click', function(){
            $('html').css('overflow-y','auto');
            options.removeClass('disabled');
            optShow.removeClass('active');
            //optShow.find('.form-control').val('');
        });

        $(document).mouseup(function(e){
            var container = $(".formFloat");
            if (!container.is(e.target) && container.has(e.target).length === 0){
                $('html').css('overflow-y','auto');
                options.removeClass('disabled');
                container.removeClass('active');
            }
        });
	}
	
	function getLoadData(arDat, startPage, apiData, totalData, sorTer) {
		// waiting();
		if(typeof totalData == 'undefined') {
			totalData = 0;
		}
		if(typeof apiData == 'undefined') {
			apiData = "";
		}
		
		if(typeof arDat.id != 'undefined' && arDat.id != '') {
			var ajaxUrl = arDat.url + "/" + arDat.id;
		}else{
			var ajaxUrl = arDat.url;
		}

        //Local Storage Sorter & Order
        if(typeof localStorage.rel != 'undefined') {
            order = localStorage.rel;
            sort = localStorage.sorters;
        }else{
            order = localStorage.rel;
            sort = localStorage.sorters;
        }

		var totalDataView = $("#showLength_"+arDat.elmTable).val();
		var totalData = (totalData == 0) ? totalPage(arDat.elmTable, arDat.url, totalDataView, src, arDat.id) : totalData;
		var totalPaging = (Math.ceil(totalData / totalDataView) == 0) ? 1 : Math.ceil(totalData / totalDataView), totalBlock = Math.ceil(totalPaging / loadAfterPage), block = 1;
		
		startPage = (startPage > totalPaging) ? totalPaging : (startPage < 1) ? 1 : startPage;
		// Revisi 2 Feb 2018
		if((typeof startPage == 'undefined' || startPage <= loadAfterPage) && apiData == "") {
			var apiData = getLoadDataAjax(arDat.elmTable, ajaxUrl, 0, offset, src, sort, order);
		}
		$('#pagination_'+arDat.elmTable).twbsPagination("destroy");
		$('#pagination_'+arDat.elmTable).twbsPagination({
            totalPages: totalPaging,
			visiblePages: pagingShow,
			startPage:startPage,
            onPageClick: function (event, page) {
				$("#goto_"+arDat.elmTable).val(page);
				for(i=1;i<=totalBlock;i++) {
					// SET start BLOCK
					var start   = (i * loadAfterPage) - (loadAfterPage - 1);
					// SET end BLOCK
					var end = i * loadAfterPage;
					// Condition untuk menjalankan load page
					if(page >= start && page <= end) {
						if(block != i) {
							var limit = (i - 1) * offset;
							// waiting();
							/* ==== Dicomment Sementara ===========
							setTimeout(function() {
								apiData = getLoadDataAjax(arDat.elmTable, ajaxUrl, limit, offset, src, sort, order);
								console.log("bles", apiData);
							}, 1);*/
							//============ Hapus setTimeout
							// Revisi 2 Feb 2018
							apiData = getLoadDataAjax(arDat.elmTable, ajaxUrl, limit, offset, src, sort, order);
							//==========
							block = i;
						}
					}
				}
				
				var startBlock = (block * loadAfterPage) - (loadAfterPage - 1); 
				var endBlock = block * loadAfterPage;
				
				// Show berdasarkan total data view
				showWithLength(arDat, page, apiData, totalPaging, startBlock, endBlock, totalDataView);


                //Local Storage Sorter & Order
                if(typeof localStorage.sorters != 'undefined') {
                    $("#"+arDat.elmTable).find('.tableHead .sorter.'+localStorage.rel).addClass(localStorage.sorters);
                }else{
                    $("#"+arDat.elmTable).find('.tableHead .sorter.'+localStorage.rel).removeClass(localStorage.sorters);
                }


				//Set Sorter ASC & DESC
				$("#"+arDat.elmTable).find('.tableHead .sorter').bind("click", function(){
                    var stat = $(this).attr('rel');
                    order = $(this).attr("rel");
                    localStorage.sorters = (localStorage.sorters != 'ASC') ? localStorage.sorters = "ASC" : localStorage.sorters = "DESC";
                    localStorage.rel = (localStorage.rel != localStorage.rel) ? localStorage.rel = stat : localStorage.rel = stat;
                    sort = (sort == "ASC") ? "DESC" : "ASC"; //Shorthand If Else for one condition.

					getLoadData(arDat);
				});

				//for page view
				$("#showLength_"+arDat.elmTable).on("change", function(){
					window.loadAfterPage = 100 / $(this).val();
					getLoadData(arDat, 1, apiData, totalData);
				});
				
				/*if(typeof arDat.id == 'undefined') {
					if (typeof afterLoadTable == 'function') afterLoadTable(arDat.url);
				}else{
					if (typeof afterLoadTableDetail == 'function') afterLoadTableDetail(arDat.url);
				}*/
				/* Revisi 27 Juli 2018 */
				var matchUrl = arDat.url;
				if(matchUrl.match(/datadetail/)){
					if (typeof afterLoadTableDetail == 'function') afterLoadTableDetail(matchUrl);
				}else{
					if (typeof afterLoadTable == 'function') afterLoadTable(matchUrl);
				}
				/* ================== */
			}
        });
		
		$('.datePickerRange').daterangepicker({
			  autoUpdateInput: false,
			  locale: {
				  cancelLabel: 'Clear',
				  format: 'DD/MM/YYYY'
			  }
		  });

		  $('.datePickerRange').on('apply.daterangepicker', function(ev, picker) {
			  $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
		  });

		  $('.datePickerRange').on('cancel.daterangepicker', function(ev, picker) {
			  $(this).val('');
		  });

		//removeWaiting();
        footerFloat();
	}

	function customColumn(){
		var topPanel = '<form class="customColumns" name="" id="">'+
			'<div class="form-group checkbox">'+
			'<label><input type="checkbox" name="cc" value="c1" class="getData cColumnAll">Select All Columns</label><br>'+
			'<label><input type="checkbox" name="cc" value="c1" class="getData cColumn">Column 1</label><br>'+
			'<label><input type="checkbox" name="cc" value="c2" class="getData cColumn">Column 2</label><br>'+
			'<label><input type="checkbox" name="cc" value="c3" class="getData cColumn">Column 3</label><br>'+
			'</div>'+
			'</form>';

		$('.settingHeader').bind('click', function(){
			//topPanel.empty();
			Lobibox.window({
				title: 'Customize Columns',
				width: 600,
				height: 500,
				content: topPanel,
				buttons: {
					cancel: {
						'class': 'btn btn-default',
						text: 'Cancel',
						closeOnClick: true
					},
					ok: {
						'class': 'btn btn-success',
						text: 'Apply',
						closeOnClick: true
					}
				},
				callback: function(lobibox, type) {
					//var btnType;
					if (type === 'ok') {
						alert('Update Columns Success');
					}
				}
			});
			preventDefault;

			var ck = $('.customColumns .cColumn');
			$('.customColumns .cColumnAll').change(function () {
				$('.customColumns .cColumn').prop('checked', $(this).prop('checked'));
			});
			ck.change(function () {
				var e = ck.length,
					e_checked = $('.cColumn:checked').length;

				if(e != e_checked){
					$('.cColumnAll').prop('checked',false);
				}else{
					$('.cColumnAll').prop('checked',true);
				}
			});
		});
	}

	function colResize(elm){
		$('.'+elm).tablesorter({
			widgets: [ 'zebra', 'resizable', 'saveSort'],
			widgetOptions: {
				resizable: true,
				resizable_widths : [ '100px' ]
			}
		});
		//$('.'+elm).trigger('resizableUpdate');
	}

	function tableResize(elm) {
		var table = $('#' + elm),
			tableResizeable = false,
			head, c, width, l, r,
			target,
			idx,
			curr_idx,
			head_list,
			content_list,
			tableResize = $('.tableResize', table),
			n = $('li', $('.tblHead', table)).length,
			wCtn = 0;

		for (var i = 0; i < n; i++) {
			wCtn = wCtn + $('li:eq(' + i + ')', $('.tblContent>li', table)).outerWidth() + 1;
		}
		if (wCtn < $('.tableContainer', table).width()) {
			wCtn = $('.tableContainer', table).width();
		}
		$('.tblHead,.tblContent', table).width(wCtn);

		$(window).resize(function () {
			wCtn = ($('li', $('.tblHead', table)).outerWidth() + 2) * n;
			if (wCtn < $('.tableContainer', table).width()) {
				wCtn = $('.tableContainer', table).width();
			}
			console.log('wCtn:'+wCtn,' tc:'+ $('.tableContainer', table).width());
			$('.tblHead,.tblContent', table).width(wCtn);
		});
		tableResize.bind("mousedown.tableResize_" + elm, function (e) {
			tableResizeable = true;
			target = $(e.target);
			head = target.closest('li');
			head_list = $('.tblHead>li', table);
			content_list = $('ul>li', $('.tblContent>li', table));
			idx = head.index();
			for (var i = 0; i < head_list.length; i++) {
				var h_li = head_list[i];
				var c_li = content_list[i];
				if ($(h_li)[i] == head[i]) {
					curr_idx = idx;
					break;
				}
			}
            updateTable();
			$(this).addClass('isResize').css('opacity', 1);
			width = head.width();
			l = e.pageX;
			return false;
		});

		$(document).bind("mousemove.tableResize_" + elm, function (e) {
			if (tableResizeable) {
				var w = e.pageX - l + width;
				var rows = $('.tblContent>li', table);
				var content = $('ul>li:eq(' + curr_idx + ')', rows);
				head.css('width', w + 'px');
				content.css('width', w + 'px');
				var wUl = 0;
				for (var i = 0; i < n; i++) {
					wUl = wUl + $('li:eq(' + i + ')', rows).outerWidth() + 1;
				}
				if (wUl < $('.tableContainer', table).width()) {
					wUl = $('.tableContainer', table).width();
				}
				$('.tblHead,.tblContent', table).width(wUl);
                updateTable();
			}
		}).bind("mouseup.tableResize_" + elm, function () {
			tableResizeable = false;
			$('.isResize').removeAttr('style').removeClass('isResize');
		});

	}

    function updateTable() {
        var x = 0,
			tp = $('.pins'),
			th = $('.tableHead li.pins').length;

        if(th > 0){
            tp.each(function (k,v) {
                x = $(v).width() + 100;
            });
        }
        $('.tables').each(function () {
            var wUl = 0;
            var me = $('#' + $(this).attr('id'));
            var rows = $('.tblHead', me);
            var col = $('li', me).length;
            for (var i = 0; i < col; i++) {
                wUl = wUl + $('li:eq(' + i + ')', rows).outerWidth() + 1;
            }
            if (wUl < $('.tableContainer', me).width()) {
                wUl = $('.tableContainer', me).width();
            }
            $('.tblHead,.tblContent', me).width(wUl - x);
        });
        console.log('Update table success');
    }

	function showWithLength(arDat, page, apiData, totalPaging, startBlock, endBlock, totalDataView){
		var x = 1; 
		for(j=startBlock;j<=endBlock;j++) {
			if(j == page) {
				var startData = (x * totalDataView) - totalDataView;
				var endData	  = x * totalDataView;
				var header = apiData.header;
				var dataTable = apiData.data;
				var tdClass = apiData.class;
				if(typeof dataTable != "undefined") {
					//Ambil Data array dengan range
					var getData = dataTable.slice(startData, endData);
					// ===========================
					var sendTable = {
										"header":header, 
										"data":getData,
										"class":tdClass
									}
					$("#pageinfo_"+apiData.elm).html("Page " + page + " of " + totalPaging + " pages");
					buildTable(apiData.elm, sendTable);
				}
			}
			x++;
		}
	}

	function buildTable2(elmTable, getData) {
		//Header
		$("#"+elmTable).empty();
		var rowHead = $("<ul class='list-unstyled tblHead tableHead'></ul>"), row = $("<tr></tr>");

		$.each(getData.header, function(key, val) {
			if(key != 'action' && key != "txtId" && key != "txtIdDetail" && key != "txtIdHeader") {
				row.append("<th rel='"+key+"'><span>"+val+"</span></th>");
			}
			if(key == 'action') {
				row.append("<th class='resizable-false' rel='"+key+"'><span>"+val+" <i class='fa fa-gear settingHeader'></i></span></th>");
			}
		});
		//rowHead.append(row);
		$("#"+elmTable).append(rowHead);

		//Data
		$.each(getData.data, function(kData, vData){
			var rowData = $("<tr></tr>");
			/*$.each(vData, function(k, v){
				rowData.append("<td>"+v+"</td>");
			})*/
			$.each(getData.header, function(k, v) {
				if(k != 'action' && k != "txtId" && k != "txtIdDetail" && k != "txtIdHeader") {
					rowData.append("<td><span>"+vData[k]+"</span></td>");
				}
				if(k == 'action') {
					rowData.append("<td>"+vData[k]+"</td>");
				}
			});
			$("#"+elmTable).append(rowData);
		});
		//customColumn();
		tableResize('tableBranch');
	}

	function totalPage(elmPage, url, totalViewData, src, id) {
		if(typeof id != 'undefined' && id != '') {
			var urlAjax = url+"counttable/"+id;
		}else{
			var urlAjax = url+"counttable";
		}
		var totalPage = getLoadDataAjax(elmPage, urlAjax, 0, 1, src, sort, order);
		return totalPage.total;
	}	
	
	function getLoadDataAjax(elmTable, url, limit, offset, src, sort, order) {
		var apiData = "";
		$.ajax({
            url:url,
            type:"POST",
            dataType:"JSON",
            crossDomain: true,
            async:false,
            data:{
                    "elm"	: elmTable,
                    "limit":limit,
                    "offset":offset,
                    "src": src,
                    "sort":sort,
                    "order":order
            },
            success:function(obj){
                apiData = obj;
				if (typeof afterLoadDataApi == 'function') afterLoadDataApi(apiData);
            }
					
        });
		//removeWaiting();
		return apiData;		
	}
	
	function doSearchTable(url, elmTable, loadAfter, showPaging, id) {
		//waiting();
		setTimeout(function() {
			var arDat = {
				'url' : url,
				'elmTable' : elmTable,
				'loadAfter': loadAfter,
				'showPaging':showPaging,
				'id'	: id
			}
			src = $("#frmSearch_"+arDat.elmTable).serialize();
			getLoadData(arDat, 1);
		}, 1);
	}
	
	function doGoTo(url, elmTable, loadAfter, showPaging, id) {
		if(event.keyCode == 13) {	
			//waiting();
			setTimeout(function() {
				var arDat = {
					'url' : url,
					'elmTable' : elmTable,
					'loadAfter': loadAfter,
					'showPaging':showPaging,
					'id'	: id
				}
				var gotoPage = parseInt($("#goto_"+arDat.elmTable).val());
				getLoadData(arDat, gotoPage);
			}, 1);
		}
	}

    // function waiting() {
    //     $("#add-loading").html('<div class="loadingPage text-center"><span class="box"><img src="'+livepath+'/Assets/img/Facebook.svg"><span>Loading Page</span></span></div>');
    //     $('.breads').hide();
    //     $('.ftr').hide();
    // }

    function removeWaiting() {
        // setTimeout(function() {
        //     $("#add-loading").empty();
			// $('.breads').show();
        //     $('.ftr').show();
        // }, 80456546456456456);
    }
