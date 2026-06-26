//============= Check Browser ============

//=============================================

/* show current time */
(function ($) {
    $.fn.showTime = function (opt) {
        opt = $.extend({
            container: this,
            weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            monthname: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            callback: ""
        }, opt);

        var container = opt.container;
        var callback = opt.callback;


        var time = new Date();
        var weekdays = opt.weekdays;
        var monthname = opt.monthname;
        var curday = weekdays[time.getDay()];
        var curdate = time.getDate();
        var curmonth = monthname[time.getMonth()];
        var curyear = time.getFullYear();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        var seconds = time.getSeconds();
        if (hours > 12) {
            //hours = hours - 12;
        }

        if (hours == 0) {
            hours = 12;
        }
        if (minutes <= 9) {
            minutes = "0" + minutes;
        }
        if (seconds <= 9) {
            seconds = "0" + seconds;
        }
        container.text(curday + ', ' + curdate + ' ' + curmonth + ' ' + curyear + ' - ' + hours + ":" + minutes + ":" + seconds);

        setTimeout(function () {
            container.showTime()
        }, 1000);

        if (typeof (callback) == 'function') {
            callback();
        }
    }
})(jQuery);

/* table column resizable */
(function ($) {
    $.fn.table = function (opt) {
        opt = $.extend({
            container: this,
            callback: ""
        }, opt);

        var container = opt.container;
        var callback = opt.callback;

        var table = container;
        var id = table.attr('id');
        var tableResizeable = false;
        var head, width, l;
        var curr_idx;
        var tableResize = $('.tableResize', table);
        var n = $('li', $('.tblHead', table)).length;
        var wCtn = 0;
        for (var i = 0; i < n; i++) {
            wCtn += $('li:eq(' + i + ')', $('.tblContent>li', table)).outerWidth();
        }
        if (wCtn < $('.tableContainer', table).width()) {
            wCtn = $('.tableContainer', table).width();
        }
        $('.tblHead,.tblContent', table).width(wCtn);

        $(window).resize(function () {
            var min_width = 0;
            for (var i = 0; i < n; i++) {
                min_width += $('li:eq(' + i + ')', $('.tblContent>li', table)).outerWidth();
            }
            wCtn = ($('li', $('.tblHead', table)).outerWidth()) * n;
            if (wCtn < $('.tableContainer', table).width()) {
                wCtn = $('.tableContainer', table).width();
            }
            $('.tblHead,.tblContent', table).css({
                'width': wCtn,
                'min-width': min_width
            });

        });

        tableResize.bind("mousedown.tableResize_" + id, function (e) {
            tableResizeable = true;
            var target = $(e.target);
            head = target.closest('li');
            var head_list = $('.tblHead>li', table);
            var idx = head.index();
            for (var i = 0; i < head_list.length; i++) {
                var h_li = head_list[i];
                if ($(h_li)[i] == head[i]) {
                    curr_idx = idx;
                    break;
                }
            }
            $(this).addClass('isResize').css('opacity', 1);
            width = head.width();
            l = e.pageX;
            return false;
        });

        $(document).bind("mousemove.tableResize_" + id,function (e) {
            if (tableResizeable) {
                var w = e.pageX - l + width;
                var rows = $('.tblContent>li', table);
                var content = $('ul>li:eq(' + curr_idx + ')', rows);
                head.css('width', w + 'px');
                content.css('width', w + 'px');
                var wUl = 0;
                for (var i = 0; i < n; i++) {
                    wUl = wUl + $('li:eq(' + i + ')', rows).outerWidth();
                }
                if (wUl < $('.tableContainer', table).width()) {
                    wUl = $('.tableContainer', table).width();
                }
                $('.tblHead,.tblContent', table).width(wUl);
            }
        }).bind("mouseup.tableResize_" + id, function () {
                tableResizeable = false;
                $('.isResize').removeAttr('style').removeClass('isResize');
            });

        if (typeof (callback) == 'function') {
            callback();
        }
    }
})(jQuery);

/* date picker */
(function ($) {
    $.fn.datePicker = function (options) {
        var opts = $.extend({
            start: '',
            weekdays: ["M", "T", "W", "T", "F", "S", "S"],
            weekdays_long: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            monthname: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            format: 'DD-MM-YYYY',
            callback: ''
        }, options);

        return this.each(function () {
            var input = $(this);
            var datePicker;
            var active_date = new Date();
            var cm = {
                init: function () {
                    input.bind('click', function () {
                        cm.action();
                    });
                },
                action: function () {
                    var current_data = input.data('date');
                    active_date = (current_data == undefined) ? (new Date()) : new Date(current_data);
                    active_date.setDate(active_date.getDate() - active_date.getDate() + 1);
                    cm.build();
                    cm.create(current_data);
                    var year = active_date.getFullYear();
                    $('.dpPrev', datePicker).bind('click', function () {
                        var month = active_date.getMonth() - 1;
                        if (month < 0) {
                            month = 11;
                            year -= 1;
                        }
                        active_date.setFullYear(year, month, 1);
                        cm.create(current_data);
                        return false;
                    });

                    $('.dpNext', datePicker).bind('click', function () {
                        var month = active_date.getMonth() + 1;
                        if (month > 11) {
                            month = 0;
                            year += 1;
                        }
                        active_date.setFullYear(year, month, 1);
                        cm.create(current_data);
                        return false;
                    });
					
					$('.dpYear', datePicker).bind('click', function () {
						return false;
					});
					
					$('.dpMonth', datePicker).bind('click', function () {
						return false;
					});

                    $(document).unbind('click.datePicker').bind('click.datePicker', function (e) {
                        var target = $(e.target);
                        if (target.closest('.datePicker').length <= 0 && target[0] !== input[0]) {
							datePicker.animate({'margin-top': -30, 'opacity': 0}, 300, function () {
                                cm.remove();
                            });
                            input.focusout();
                            $(document).unbind('click.datePicker');
                        }
                    });
                },
                build: function () {
                    datePicker = $('.datePickerContainer');
                    if (datePicker.length <= 0) {
                        $('body').append('<div class="datePickerContainer"></div>');
                        var weekend_txt = ' class="dpWeekend"';
                        datePicker = $('.datePickerContainer');
                        datePicker.append('<div class="dpTop"></div>');
                        var dpTop = $('.dpTop', datePicker);
                        dpTop.append('<div class="dpHead"></div>');
                        var dpHead = $('.dpHead', dpTop);
                        dpHead.append('<div class="left"><a class="dpPrev">&lt;</a></div>');
                        dpHead.append('<div class="right"><a class="dpNext">&gt;</a></div>');
                        dpHead.append('<div class="dpSelectWrapper"></div>');
                        var dpHead_center = $('.dpSelectWrapper', dpHead);
                        dpHead_center.append('<select class="dpMonth"></select>');
                        var dpHead_month = $('.dpMonth', dpHead_center);
                        var curr_month = active_date.getMonth();
                        for (var mi = 0; mi < opts.monthname.length; mi++) {
                            var sel_month = (curr_month == mi) ? 'selected' : '';
                            dpHead_month.append('<option value="' + mi + '" ' + sel_month + '>' + opts.monthname[mi] + '</option>');
                        }
                        dpHead_center.append('<select class="dpYear"></select>');
                        var dpHead_year = $('.dpYear', dpHead_center);
                        var curr_year = active_date.getFullYear();
                        for (var yi = curr_year - 10; yi <= curr_year + 10; yi++) {
                            var sel_year = (curr_year == yi) ? 'selected' : '';
                            dpHead_year.append('<option value="' + yi + '" ' + sel_year + '>' + yi + '</option>');
                        }
                        dpTop.append('<div class="dpDays"></div>');
                        dpHead = $('.dpDays', dpTop);
                        dpHead.append('<ul></ul>');
                        var weekdays = opts.weekdays;
                        for (var wd = 0; wd < weekdays.length; wd++) {
                            $('ul', dpHead).append('<li>' + weekdays[wd] + '</li>');
                        }
                        $('ul', dpHead).append('<div class="clear"></div>');
                        dpTop.append('<div class="dpDates"><ul></ul></div>');
                        var jcp_dates = $('.dpDates ul', dpTop);
                        for (var wk = 1; wk <= 6; wk++) {
                            jcp_dates.append('<li class="dpWeek dpW' + wk + '"><ul></ul></li>');
                            var curr_week = $('.dpW' + wk + ' ul');
                            for (var dy = 1; dy <= 7; dy++) {
                                curr_week.append('<li' + ((dy == 7) ? weekend_txt : '') + '></li>');
                            }
                        }
                    }

                    var input_left = input.offset()['left'];
                    var input_top = input.offset()['top'];
                    var input_w = input.outerWidth();
                    var input_h = input.outerHeight();
                    var cal_w = datePicker.outerWidth();
                    var cal_h = datePicker.outerHeight();
                    var window_w = $('body').outerWidth();
                    var window_h = $('body').outerHeight();
                    var cal_left = input_left + input_w;
                    var cal_top = input_top;
                    if (cal_left + cal_w > window_w) {
                        if (input_top + input_h + cal_h <= window_h && input_left + cal_w <= window_w) {
                            cal_left = input_left;
                            cal_top = input_top + input_h;
                        } else {
                            cal_left = input_left - cal_w;
                        }
                    }

                    //============custom position===============//
                    cal_left = input.offset().left + input.width() - datePicker.width();
                    if (cal_left < input.offset().left) {
                        cal_left = input.offset().left;
                    }
                    cal_top = input.offset().top + input.outerHeight() + 3;

                    if (cal_top + 270 > window_h) {
                        //cal_top = input_top - 270;
                    }
                    //==========================================

                    datePicker.css('left', cal_left);
                    datePicker.css('top', cal_top);
                    datePicker.css({'margin-top': -30, 'opacity': 0});
                    datePicker.animate({'margin-top': 0, 'opacity': 1}, 300);
                },
                remove: function () {
                    datePicker.remove();
                },
                create: function (current_data) {
                    cm.update(current_data);
                    $('.dpMonth', datePicker).change(function () {
                        var month_val = $('.dpMonth', datePicker).val();
                        var year_val = $('.dpYear', datePicker).val();
                        active_date.setFullYear(year_val, month_val, 1);
                        active_date = new Date(active_date);
                        cm.update(current_data);
                    });
                    $('.dpYear', datePicker).change(function () {
                        var month_val = $('.dpMonth', datePicker).val();
                        var year_val = $('.dpYear', datePicker).val();
                        active_date.setFullYear(year_val, month_val, 1);
                        active_date = new Date(active_date);
                        cm.update(current_data);
                    });
                },
                update: function (current_data) {
                    var current_date = new Date(active_date);
                    while (current_date.getDay() != 1) {
                        current_date.setDate(current_date.getDate() - 1);
                    }
                    var days = current_date;

                    var week = 1;
                    var month_elm = $('.dpMonth', datePicker);
                    //$('option', month_elm).removeAttr('selected');
                    $('option[value="' + active_date.getMonth() + '"]', month_elm).attr('selected', 'selected');
                    var year_elm = $('.dpYear', datePicker);
                    //$('option', year_elm).removeAttr('selected');
                    $('option[value="' + active_date.getFullYear() + '"]', year_elm).attr('selected', 'selected');
                    $('.dpWeek li', datePicker).removeClass('dpInactive');
                    for (var i = 1; i <= 42; i++) {
                        var current_day = $('.dpW' + week + ' li')[(i - 1) % 7];
                        var content = days.getDate();
                        content = '<a>' + content + '</a>';
                        $(current_day).html(content);
                        var date_data = new Date(days);
                        $('a', current_day).data('date', date_data);
                        if (current_data != undefined &&
                            date_data.getDate() == current_data.getDate() &&
                            date_data.getMonth() == current_data.getMonth() &&
                            date_data.getFullYear() == current_data.getFullYear()) $(current_day).addClass('active');
                        else $(current_day).removeClass('active');

                        if (days.getMonth() != active_date.getMonth()) {
                            $(current_day).addClass('dpInactive');
                        }
                        // Change day, put everything above this line
                        days.setDate(days.getDate() + 1);
                        if (i % 7 == 0) {
                            week++;
                        }
                    }

                    $('.dpWeek ul li a', datePicker).bind('click', function () {
						cm.insert($(this).data('date'));
                        input.data('date', $(this).data('date'));
                        datePicker.animate({'margin-top': -30, 'opacity': 0}, 300, function () {
                            cm.remove();
                        });

                        var callback = opts.callback;
                        if (typeof(callback) == 'function') {
                            callback();
                        }
                    });
                },
                insert: function (cal_data) {
                    var return_str = opts.format;
                    return_str = return_str.replace(/DDDD/g, '-_-_-');
                    return_str = return_str.replace(/MMMM/g, '_-_-_');
                    return_str = return_str.replace(/DD/g, ('0' + cal_data.getDate()).substr(-2));
                    return_str = return_str.replace(/D/g, cal_data.getDate());
                    return_str = return_str.replace(/MM/g, ('0' + (cal_data.getMonth() + 1)).substr(-2));
                    return_str = return_str.replace(/M/g, cal_data.getMonth() + 1);
                    return_str = return_str.replace(/YYYY/g, cal_data.getFullYear());
                    return_str = return_str.replace(/YY/g, String(cal_data.getFullYear()).substr(-2));

                    var day_num = parseInt(parseInt(cal_data.getDay()) - 1);
                    return_str = return_str.replace(/-_-_-/gi, opts.weekdays_long[(day_num < 0) ? 6 : day_num]);
                    var month_num = parseInt(cal_data.getMonth());
                    return_str = return_str.replace(/_-_-_/gi, opts.monthname[(month_num > 11) ? 0 : month_num]);
                    input.val(return_str);
                }
            };
            cm.init();
        });
    }
})($);

/* Time Picker */
(function ($) {
    $.timePicker = {};
    $.timePicker.version = "__BUILD_VERSION_NUMBER__";
    $.timePicker.options = {
        onFocusDisplay: true,
        zIndex: 10,
        onBeforeShow: undefined,
        onClose: undefined,
        callback: ''
    };

    $.timePicker.setHr = function (h) {
        $('#timePickerUserSelHr').empty().append(h);
    };// END setHr() function

    $.timePicker.setMin = function (m) {
        $('#timePickerUserSelMin').empty().append(m);
    };// END setMin() function

    $.timePicker.setTime = function () {
        var tSel = $('#timePickerUserSelHr').text() + ":" + $('#timePickerUserSelMin').text();
        $(".isPtTimeSelectActive").val(tSel);
        this.closeCntr();
    };// END setTime() function

    $.timePicker.openCntr = function (ele) {
        $(document).ready(
            function () {
                $('#timePickerContainer').remove();
                if (!$('#timePickerContainer').length) {
                    $("body").append(
                        '<div id="timePickerContainer" class="timePickerContainer">' +
                            '    <div class="timePickerHead">' +
                            '        <div class="left">Preview</div>' +
                            '        <div class="right timePreview" id="timePickerUserTime">' +
                            '           <span id="timePickerUserSelHr">01</span>' +
                            '           <span id="">:</span>' +
                            '           <span id="timePickerUserSelMin">00</span> ' +
                            '        </div>' +
                            '        <div class="clear"></div>' +
                            '    </div>' +
                            '    <div class="timePickerBody">' +
                            '        <div class="timeList">' +
                            '            <div class="left label">Hour</div>' +
                            '            <div class="left dvd">:</div>' +
                            '            <div class="right">' +
                            '                <select class="timePickerHr"></select>' +
                            '            </div>' +
                            '            <div class="clear"></div>' +
                            '        </div>' +
                            '        <div class="timeList">' +
                            '            <div class="left label">Minutes</div>' +
                            '            <div class="left dvd">:</div>' +
                            '            <div class="right">' +
                            '                <select class="timePickerMin"></select>' +
                            '            </div>' +
                            '            <div class="clear"></div>' +
                            '        </div>' +
                            '        <div class="separatorTime"></div>' +
                            '        <div class="timeBtn right" id="cancelTime">Cancel</div>' +
                            '        <div class="timeBtn right" id="setTime">OK</div>' +
                            '        <div class="clear"></div>' +
                            '    </div>' +
                            '</div>'
                    );

                    var e = $('#timePickerContainer').hide();

                    e.find('#cancelTime').bind("click", function () {
                        $.timePicker.closeCntr();
                    });

                    e.find('#setTime').bind("click", function () {
                        $.timePicker.setTime();
                    });

                    var selectHour = e.find('.timePickerHr');
                    var optH = '';
                    for (var h = 0; h < 24; h++) {
                        if (h < 10) {
                            h = '0' + h;
                        }
                        optH += '<option value="' + h + '">' + h + '</option>';
                    }
                    selectHour.html(optH);

                    var selectMin = e.find('.timePickerMin');
                    var optMin = '';
                    for (var m = 0; m < 60; m++) {
                        if (m < 10) {
                            m = '0' + m;
                        }
                        optMin += '<option value="' + m + '">' + m + '</option>';
                    }
                    selectMin.html(optMin);

                    e.find('.timePickerMin').bind("change", function () {
                        $.timePicker.setMin($(this).val());
                    });

                    e.find('.timePickerHr').bind("change", function () {
                        $.timePicker.setHr($(this).val());
                    });

                    $(document).mousedown($.timePicker._doCheckMouseClick);
                }//end if
            }
        );

        $.timePicker.closeCntr();
        $(".isPtTimeSelectActive").removeClass("isPtTimeSelectActive");
        var cntr = $("#timePickerContainer");
        var i = $(ele).eq(0).addClass("isPtTimeSelectActive");
        var opt = i.data("timePickerOptions");
        var style = i.offset();
        style['z-index'] = opt.zIndex;
        style.top = (style.top + i.outerHeight());
        style.left = (style.left);
        cntr.css(style);
        var hr = '00';
        var min = '00';
        if (i.val()) {
            var re = /([0-9]{1,2}).*:.*([0-9]{2})/i;
            var match = re.exec(i.val());
            if (match) {
                hr = match[1] || '00';
                min = match[2] || '00';
            }
        }
        cntr.find("#timePickerUserSelHr").empty().append(hr);
        cntr.find("#timePickerUserSelMin").empty().append(min);
        var selH = cntr.find(".timePickerHr");
        var selMin = cntr.find(".timePickerMin");
        $('option', selH).removeAttr('selected');
        $('option', selMin).removeAttr('selected');
        $('option[value=' + hr + ']', selH).attr('selected', 'selected');
        $('option[value=' + min + ']', selMin).attr('selected', 'selected');
        if (opt.onBeforeShow) {
            opt.onBeforeShow(i, cntr);
        }
        if (cntr.css('display') == 'none' || cntr.css('display') != 'block') {
            cntr.show(0);
            cntr.css({'opacity': 0, 'margin-top': '-30px'});
            cntr.animate({'opacity': 1, 'margin-top': 0}, 400);
        }

    };// END openCntr()

    $.timePicker.closeCntr = function (i) {
        var e = $("#timePickerContainer");
        if (e.is(":visible") == true) {

            // If IE, then check to make sure it is realy visible
            if ($.support.tbody == false) {
                if (!(e[0].offsetWidth > 0) && !(e[0].offsetHeight > 0)) {
                    return;
                }
            }

            e.animate({'opacity': 0, 'margin-top': '-30px'}, 400, function () {
                $(this).remove();
            });

            if (!i) {
                i = $(".isPtTimeSelectActive");
            }
            if (i) {
                var opt = i.removeClass("isPtTimeSelectActive").data("timePickerOptions");
                if (opt && opt.onClose) {
                    opt.onClose(i);
                }
                var callback = opt.callback;
                if (typeof(callback) == 'function') {
                    callback();
                }
            }
        }
        return;
    };//end closeCntr()

    $.timePicker._doCheckMouseClick = function (ev) {
        if (!$("#timePickerContainer:visible").length) {
            return;
        }
        if (!$(ev.target).closest("#timePickerContainer").length && $(ev.target).not("input.isPtTimeSelectActive").length) {
            $.timePicker.closeCntr();
        }

    };// $.timePicker._doCheckMouseClick

    $.fn.timePicker = function (opt) {
        return this.each(function () {
            if (this.nodeName.toLowerCase() != 'input') return;
            var e = $(this);
            if (e.hasClass('hasPtTimeSelect')) {
                return this;
            }
            var thisOpt = {};
            thisOpt = $.extend(thisOpt, $.timePicker.options, opt);
            e.addClass('hasPtTimeSelect').data("timePickerOptions", thisOpt);

            if (!thisOpt.onFocusDisplay) {
                var img = $('<span>&nbsp;</span><a href="javascript:" onclick="' +
                    '$.timePicker.openCntr($(this).data(\'timePickerEle\'));">' +
                    thisOpt.popupImage + '</a>'
                ).data("timePickerEle", e);
                e.after(img);
            } else {
                e.focus(function () {
                    $.timePicker.openCntr(this);
                });
            }

            return this;
        });
    };// End of $.fn.timePicker

})($);

/* preview image when choose file */
(function ($) {
    $.fn.previewImageUpload = function (opt) {
        opt = $.extend({
            fileInput: this,
            filePreview: '',
            callback: ""
        }, opt);

        var input = opt.fileInput;
        var filePreview = opt.filePreview;
        var callback = opt.callback;

        input.change(function () {
            var file = this.files[0];
            //name = file.fileName;
            //size = file.size;
            //type = file.type;
            reader = new FileReader();
            reader.onloadend = function (e) {
                var src = e.target.result;
                filePreview.hide().html('<img src="' + src + '"/>').fadeIn(200);
            };
            reader.readAsDataURL(file);
        });

        if (typeof (callback) == 'function') {
            callback();
        }
    }
})(jQuery);

// For tinymce, datepicker, timepicker
(function ($) {
	var elm = $('.datePickerRange'), start = moment().subtract(29, 'days'), end = moment();
	function cb(start, end) {
		elm.find('input').val(start.format('D-MM-YYYY, HH:MM') + ' - ' + end.format('D-MM-YYYY, HH:MM'));
	}
	elm.daterangepicker({
		startDate: start,
		endDate: end,
		timePicker: true,
		ranges: {
			'Today': [moment(), moment()],
			'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
			'Last 7 Days': [moment().subtract(6, 'days'), moment()],
			'Last 30 Days': [moment().subtract(29, 'days'), moment()],
			'This Month': [moment().startOf('month'), moment().endOf('month')],
			'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
		}
	}, cb);

	$('.datePickerSingle').daterangepicker({
		singleDatePicker: true,
		showDropdowns: false,
		locale: {
            format: 'DD-MM-YYYY'
        }
	});
	
	$('.datePickerTime').daterangepicker({
		singleDatePicker: true,
		timePicker: true,
		timePickerSeconds: true,
		timePickerIncrement: 1,
        locale: {
            format: 'DD-MM-YYYY HH:mm:ss'
        }
	});
	
	 $('.datePickerTime').on('cancel.daterangepicker', function(ev, picker) {
		$(this).val('');
	  });
	
	$('.timePicker').timePicker({
		callback: function () {
			var me = $(this);
			me.removeClass('bvalidator_invalid');
			me.next($('.bVErrMsgContainer')).remove();
		}
	});

	$(".inputImage").each(function (a, b) {
		var nameImg = $(b).attr('name');
		$('#inputImage' + nameImg).previewImageUpload({
			filePreview: $('#imagePreview' + nameImg),
			callback: function () {
				$('#imagePreview' + nameImg).css({
					'margin-top': 10,
					'max-width': $('#inputImage' + nameImg).outerWidth()
				});
			}
		});
	});

	/*$(".amountprice").keyup(function(){
	 $(this).val(numeral($(this).val()).format('0,0'));
	 })*/

	tinymce.init({
		toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
		toolbar2: "print preview media | forecolor backcolor emoticons",
		plugins: [
			"advlist autolink lists link image charmap print preview hr anchor pagebreak",
			"searchreplace wordcount visualblocks visualchars code fullscreen",
			"insertdatetime media nonbreaking save table contextmenu directionality",
			"emoticons template paste textcolor colorpicker textpattern"
		],
		selector: ".customTextArea",
		height:300
	});
})(jQuery);

/*show notification*/
function notification(message, type) {
    var to;
    var notif_type = '';
    var icon = 'icon-ok';
    if (type == 0) {
        notif_type = 'failed';
        icon = 'icon-remove';
    } else {
        notif_type = 'success';
    }
    clearTimeout(to);

    var notif_str = '' +
        '    <li id="" class="">' +
        '       <div class="notification ' + notif_type + '">' +
        '           <div class="notifIcon ' + icon + '"></div>' +
        '           <div class="notifText"><div>' + message + '</div></div>' +
        '           <div class="clear"></div>' +
        '           <div class="notifCloseBtn">x</div>' +
        '        </div>' +
        '      </div>' +
        '    </li>';

    var notification = $('#notificationContainer');
    $('li', notification).first().remove();
    notification.prepend(notif_str).hide().slideDown(200);
    if ($('li', notification).length < 1) {
        notification.first().append(notif_str);
        $('li', notification).first().hide().slideDown(100);
        $('.notifText', notification).text(message);
    }
    to = setTimeout(function () {
        $('li', notification).first().animate({'right': '-500px'}, 500, function () {
            $(this).remove();
        });
    }, 3000);
    $('.notifCloseBtn', $('li', notification)).bind("click", function () {
        clearTimeout(to);
        $(this).closest($('li', notification)).fadeOut(300, function () {
            $(this).remove();
        });
    });
}

/*show tooltip*/
function tooltip() {
    var id = '';

    /*====Fixed Position====*/
    $(".tooltip").hover(function () {
            var me = $(this);
            var txt = $(this).attr('tooltip');
            $("body").append('<div id="tooltip" class="tooltipFixed">' + txt + '</div>');
            id = $("#tooltip");
            var xpos = me.offset().left - (id.outerWidth() / 2) + (me.outerWidth() / 2);
            var ypos = me.offset().top - me.outerHeight() + 2;
            id.css({"top": ypos + "px", "left": xpos + "px"});
            id.fadeIn(0).css('opacity', '0');
            id.animate({'top': ypos - 5, 'opacity': '1'}, 300);
        },
        function () {
            id = $("#tooltip");
            id.remove();
        });

    /*======Relative Position=======*/
    var xOffset = 0;
    var yOffset = 30;
    var tooltip = $(".tooltip2");
    tooltip.hover(function (e) {
            var txt = $(this).attr('tooltip');
            var xpos = e.pageX + xOffset;
            var ypos = e.pageY - yOffset + 10;
            $("body").append('<div id="tooltip" class="tooltipRelative">' + txt + '</div>');
            id = $("#tooltip");
            id.css({"top": ypos + "px", "left": xpos + "px"});
            id.fadeIn("fast");
        },
        function () {
            id = $("#tooltip");
            id.remove();
        });
    tooltip.bind("mousemove", function (e) {
        var me = $(this);
        id = $("#tooltip");
        xOffset = (id.outerWidth() / 2) - (me.outerWidth() / 2) + 15;
        id.css("top", (e.pageY + yOffset) + "px");
        id.css("left", (e.pageX - xOffset) + "px");
    });
}

/* show overlay */
function showOverlay() {
    //check browser supprt css3
    var supports = (function () {
        var div = document.createElement('div'),
            vendors = 'Khtml Ms O Moz Webkit'.split(' '),
            len = vendors.length;

        return function (prop) {
            if (prop in div.style) return true;

            prop = prop.replace(/^[a-z]/, function (val) {
                return val.toUpperCase();
            });

            while (len--) {
                if (vendors[len] + prop in div.style) {
                    // browser supports box-shadow. Do what you need.
                    // Or use a bang (!) to test if the browser doesn't.
                    return true;
                }
            }
            return false;
        };
    })();

    var overlay = $('.overlay');
    overlay.remove();
    $('body').append('<div class="overlay" id="overlay2"></div><div class="overlay" id="overlay3"></div>');

    if (supports('textShadow')) {//css3.show; css2.hide()
        $('#overlay2').remove();
        $('#overlay3').fadeIn(300);
    } else {//css2.show;css3.hide;
        $('#overlay3').remove();
        $('#overlay2').fadeIn(500);
    }

    if ($.browser.opera) {
        $('#overlay2').fadeIn(300);
        $('#overlay3').hide();
    }
}

/* remove overlay */
function removeOverlay() {
    $('.overlay').fadeOut(500, function () {
        $(this).remove();
    });
}

/* show alert*/
function showAlert(elm) {
    var title = elm.title;
    var content = elm.content;
    var date = new Date();
    var milisec = date.getMilliseconds();
    var alert_id = 'alert' + milisec;

    var alert_str = '' +
        '<div class="alertBox show_alert" id="' + alert_id + '">' +
        '    <div class="alertTitle">' + title + '</div>' +
        '    <div class="alertContent">' + content + '</label></div>' +
        '    <div class="alertButton">' +
        '        <a href="javascript:void(0)" class="inputBtn small" id="OK">Ok</a>' +
        '    </div>' +
        '</div>';

    $('.show_alert').remove();
    $('body').append(alert_str);
    var alert_elm = $('#' + alert_id);
    showOverlay();
    if (($.browser.msie && $.browser.version <= 6) || ($.browser.msie && $.browser.version > 6)) {
        alert_elm.fadeIn(200);
    } else {
        alert_elm.show().animate({'zoom': 1.14}, 100, function () {
            $(this).animate({'zoom': 0.99}, 100, function () {
                $(this).animate({'zoom': 1}, 50);
            });
        });
    }

    $('#OK').bind("click", function () {
        if (($.browser.msie && $.browser.version <= 6) || ($.browser.msie && $.browser.version > 6)) {
            alert_elm.fadeOut(300, function () {
                $(this).remove();
            });
        } else {
            alert_elm.animate({'zoom': 1.14}, 100, function () {
                $(this).animate({'zoom': 0}, 200, function () {
                    $(this).remove();
                });
            });
        }
        removeOverlay();
    });
}

/* show dialog box */
function showConfirmDialog(elm) {
    var title = elm.title;
    var content = elm.content;
    var callback = elm.callback;
    var date = new Date();
    var milisec = date.getMilliseconds();
    var alert_id = 'confirm' + milisec;
    var alert_str = '' +
        '<div class="alertBox show_confirm_dialog" id="' + alert_id + '">' +
        '    <div class="alertTitle">' + title + '</div>' +
        '    <div class="alertContent">' + content + '</label></div>' +
        '    <div class="alertButton">' +
        '       <a href="javascript:void(0)" class="inputBtn small" id="OK">Yes</a>' +
        '       <a href="javascript:void(0)" class="inputBtn small red" id="CANCEL">No</a>' +
        '    </div>' +
        '</div>';

    $('.show_confirm_dialog').remove();
    $('body').append(alert_str);
    var alert_elm = $('#' + alert_id);
    showOverlay();

    if (($.browser.msie && $.browser.version <= 6) || ($.browser.msie && $.browser.version > 6)) {
        alert_elm.fadeIn(200);
    } else {
        alert_elm.show().animate({'zoom': 1.14}, 100, function () {
            $(this).animate({'zoom': 0.99}, 50, function () {
                $(this).animate({'zoom': 1}, 30);
            });
        });
    }

    $('#OK').bind("click", function () {
        if (($.browser.msie && $.browser.version <= 6) || ($.browser.msie && $.browser.version > 6)) {
            alert_elm.fadeOut(300, function () {
                $(this).remove();
            });
        } else {
            alert_elm.animate({'zoom': 1.14}, 100, function () {
                $(this).animate({'zoom': 0}, 200, function () {
                    $(this).remove();
                });
            });
        }
        if (typeof(callback) == 'function') {
            callback();
        }
        removeOverlay();
    });

    $('#CANCEL').bind("click", function () {
        if (($.browser.msie && $.browser.version <= 6) || ($.browser.msie && $.browser.version > 6)) {
            alert_elm.fadeOut(300, function () {
                $(this).remove();
            });
        } else {
            alert_elm.animate({'zoom': 1.14}, 100, function () {
                $(this).animate({'zoom': 0}, 200, function () {
                    $(this).remove();
                });
            });
        }
        removeOverlay();
    });
}


function accordion(container, head, content, type) {
    //type : single or multiple
    var accordionContainer = $('#' + container);
    $('.' + content, accordionContainer).hide();
    accordionContainer.each(function () {
        var me = $(this);
        var accordionTitle = $('.' + head, me);
        accordionTitle.css("cursor", "pointer");
        var accordionContent = $('.' + content, me);
        accordionTitle.bind("click", function () {
            if (type == "multiple") {
                if ($(this).closest(me).find($('.' + content)).css('display') != 'block') {
                    accordionContent.slideDown(100);
                    $(this).find('.arrowAcc').addClass('openArrow');
                } else {
                    accordionContent.slideUp(100);
                    $(this).find('.arrowAcc').removeClass('openArrow');
                }
            } else {
                $('.' + content, accordionContainer).slideUp(100);
                if ($(this).closest(me).find($('.' + content)).css('display') != 'block') {
                    accordionContent.slideDown(100);
                }
            }
        });
    });
}

function show_box(id, submit, callback) {
    var mb_id = $('#' + id);
    showOverlay();
    mb_id.fadeIn(300);
    if (typeof(callback) == 'function') {
        $('#' + submit, mb_id).bind("click", function () {
            callback();
            mb_id.fadeOut(300);
            removeOverlay();
        });
    }

    $('#CANCEL,.closeBox', mb_id).die().bind("click", function () {
        $(this).closest(mb_id).fadeOut(300);
        removeOverlay();
    });
}

function countChr(elm) {
	var max_characters = $("#"+elm).attr("maxlength");
	var total_characters = $("#"+elm).val().length;
	var result_characters = max_characters - total_characters;
	$(".characters-counter-"+elm).text(result_characters);
}

function afterSelectLength(dat1) {
	$.each(dat1, function(k, v){
		var max_characters = $("#"+k).attr("maxlength");
		if(typeof max_characters != 'undefined') {
			countChr(k);
		}
	})
}

$(".addForm").on('click', function() {
	$.each($("input, textarea"), function(k, v){
		if(typeof $(v).attr("maxlength") != 'undefined') {
			countChr($(v).attr("id"));
		}
	})
})