$(document).ready(function() {
    startTime();
    getTime();
    globalPage();

    $(window).resize(function(){
        updateTable();
    });

    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();

    $(document).on('click.bs.dropdown.data-api', '.dropdown.keep-open', function (e) {
        e.stopPropagation();
    });

    //Function Easing Script for Smooth Page Transitions
    $('.page-content').addClass('page-content-ease-in');
    var data = $.parseJSON(menuAccess);

    //Function Navigation Rekursif
    var menu = $("#side"),
        getMenuItem = function (itemData) {
            var item ='', classCek = '';
            if (Array.isArray(itemData.sub)) {
                item = $('<li class="nav-item border-top relative d-block' + itemData.par + '">')
                    .append(
                    $('<a></a>', {
                        'html': '<i class="fa ' + itemData.icon + '"></i><span class="menuName"><i class="float-right fa fa-caret-right mt-0"></i>' + itemData.name + '</span>',
                        'data-parent': '#side',
                        'data-toggle': 'collapse',
                        'class': 'clearStorage d-block',
                        'data-target': '#' + itemData.target,
                        'aria-expanded': 'false'
                    }));
            }else {
                item = $('<li class="nav-item border-top relative d-block">')
                    .append(
                    $('<a></a>', {
                        'href': itemData.link,
                        'class': 'nav-link menu clearStorage py-0',
                        'html': '<i class="fa ' + itemData.icon + '"></i><span class="menuName">' + itemData.name + '</span>'
                    }));
            }
            if (Array.isArray(itemData.sub)) {
                var a = (item.hasClass('active') > 0) ? 'show' : '';
                var subList = $('<ul class="navbar-nav bg-black collapse border-top '+a+'" id="'+itemData.target+'">');
                $.each(itemData.sub, function () {
                    subList.append(getMenuItem(this));
                });
                item.append(subList);
            }
            return item;
        };
    //Function Render List menu into container
    $.each(data.menu, function () {
        menu.append(
            getMenuItem(this)
        );
    });
    sideMenu(data.menu);


    //Function Clear LocalStorage for Sorter & Order
    $('.navbar-side').find('.clearStorage').bind('click', function(){
        localStorage.removeItem('rel');
        localStorage.removeItem('sorters');
        localStorage.removeItem('pinList');
    });

    //Function Type 2 Hide/ Show Input using radio
    $('.optRadio2').on('change', function(){
        var me = $(this).attr('rel');
        $('.opt').prop('disabled', true);
        $('#'+me).prop('disabled', false);
    });

    //Function Handle change for Option Show/Hide Content
    var optShow  = $('.optShow'), options = $('.options'), getData = $('.getData');
    options.on('change', function(){
        var status = this.checked, me = $(this).attr('rel');
        optShow.not($('div#' + me)).hide();
        optShow.not($('div#' + me)).find('.form-control').val('');
        $('.optShow#' + me).show();
    });


    //Function Account Search Modal
    var clearSet = $('.modalTable tbody'),
        modal = $('#modalSearch'),
        keyword = $('#keyword'),
        tbCont = $('#tableCont');

    tbCont.hide();

    //Function Modal Search Acc No & Site No
    modal.on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget),
            apiTable = button.data('api'),
            title = button.data('heading'),
            idTable = button.data('idt');

        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.

        var modal = $(this);
        modal.find('.modal-body form').attr('action',apiTable);
        modal.find('.modal-header .modal-title').text(title);
        modal.find('.modal-body .table').attr('id',idTable);
    });

    //Function ??
    $('.setAcc').each(function(){
        $(this).click(function(){
            var parentTable = $(this).parents('.modalTable').attr('id'),
                rel = $(this).attr('rel');

            clearSet.find('tr').css({background: 'transparent'});
            $(this).parent().parent().css({background : '#d1f0d1'});

            $('input#'+parentTable).val(rel);
        });
    });

    $('body').on('hidden.bs.modal', '.modal', function () {
        clearSet.find('tr').css({background: 'transparent'});
        keyword.val('');
        tbCont.hide();
        modal.modal('hide');
    });

    $(".custom-close").on('click', function() {
        clearSet.find('tr').css({background: 'transparent'});
        keyword.val('');
        tbCont.hide();
        modal.modal('hide');
    });

    //To-Do List jQuery - Adds a strikethrough on checked items
    $('.checklist input:checkbox').change(function() {
        if ($(this).is(':checked')) {
            $(this).parent().addClass('selected');
        }else {
            $(this).parent().removeClass('selected');
        }
    });

    //Jquery maskMoney for input form
    $('.currency').maskMoney();

    $('#tabs > ul > li > a').each(function (index, element) {
        $(element).click(function () {
            $('#tabs').tabs('load', index);
        });
    });
});

function globalPage(){
    //Fullscreen
    var f = $('.fullscreen');
    f.bind('click', function(){
        $(this).toggleClass('active');
        toggleFullscreen();
    });
}

function update_contents(){
    $.ajax({
        type: "GET",
        url: "main.php",
        cache: false
    }).done(function( page_html ) {
        // alert("LOADED");
        var newDoc = document.open("text/html", "replace");
        newDoc.write(page_html);
        newDoc.close();
        console.log('m',page_html);
    });
}

function toggleFullscreen(elem) {
    elem = elem || document.documentElement;
    if (!document.fullscreenElement && !document.mozFullScreenElement &&
        !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}


//Function Side Menu Rekursif demo
function sideMenu(data){
    var wrapper = $('#wrapper'),

        navTop = $('.navbar-top'),
        navBrand = $('.navbar-brand'),
        navheader = $('.navbar-header'),

        sidemenu = $('#sideMenu'),
        tglSm = $('.clsSideMenu'),

    //Setting Panel Checkbox
        navbarTopCheckbox = $('#fixedNavbarTop'),
        sideMenuCheckbox = $('#fixedSideMenu'),
        footerCheckbox = $('#fixedFooter'),
        clearLStorage = $('#clearLocalStorage'),

    //Page Wrapper
        page = $('#page-wrapper'),
        footers = $('footer');

    //retrieve current state
    if (localStorage.toggled !='') {
        navTop.addClass(localStorage.toggled);
        tglSm.addClass(localStorage.toggled);
        sidemenu.addClass(localStorage.toggled);
        footers.addClass(localStorage.toggled);
        page.addClass(localStorage.toggled);
        navheader.addClass(localStorage.toggled);
    }else{
        navTop.removeClass(localStorage.toggled);
        tglSm.removeClass(localStorage.toggled);
        sidemenu.removeClass(localStorage.toggled);
        footers.removeClass(localStorage.toggled);
        page.removeClass(localStorage.toggled);
        navheader.removeClass(localStorage.toggled);
    }

    //Header
    if(typeof localStorage.navTop != 'undefined') {
        navTop.addClass(localStorage.navTop);
        page.addClass(localStorage.navTop);
        navbarTopCheckbox.prop('checked', true);
    }else{
        navTop.removeClass(localStorage.navTop);
        page.removeClass(localStorage.navTop);
        navbarTopCheckbox.prop('checked', false);
    }

    //Navigation
    if(typeof localStorage.sideNav != 'undefined') {
        sidemenu.addClass(localStorage.sideNav);
        navBrand.addClass(localStorage.sideNav);
        sideMenuCheckbox.prop('checked', true);
    }else{
        sidemenu.removeClass(localStorage.sideNav);
        navBrand.removeClass(localStorage.sideNav);
        sideMenuCheckbox.prop('checked', false);
    }

    //Footer
    if(typeof localStorage.footer != 'undefined') {
        footers.addClass(localStorage.footer);
        footerCheckbox.prop('checked', true);
    }else{
        footers.removeClass(localStorage.footer);
        footerCheckbox.prop('checked', false);
    }



    //Function Setting Layaout Template
    var setPan = $('.settingPanel');
    // $('.settPanelBtn').bind('click', function(){
    //     setPan.toggleClass('active');
    // });
    $(document).mouseup(function(e){
        var container = setPan;
        if (!container.is(e.target) && container.has(e.target).length === 0){
            container.removeClass('show');
        }
    });
    $('.settingPanel li').find('input[type="checkbox"]').bind('change', function(){
        var me = $(this).attr('id');
        switch(me){
            case "fixedNavbarTop":
                if (localStorage.navTop != 'fix') {
                    localStorage.navTop = "fix";
                    $(this).prop('checked', true);
                    navTop.addClass('fix');
                    page.addClass('fix');
                } else {
                    localStorage.removeItem('navTop');
                    $(this).prop('checked', false);
                    navTop.removeClass('fix');
                    page.removeClass('fix');
                }
                break;
            case "fixedSideMenu":
                if (localStorage.sideNav != 'fix') {
                    localStorage.sideNav = "fix";
                    $(this).prop('checked', true);
                    navBrand.addClass('fix');
                    sidemenu.addClass('fix');
                } else {
                    localStorage.removeItem('sideNav');
                    $(this).prop('checked', false);
                    navBrand.removeClass('fix');
                    sidemenu.removeClass('fix');
                }
                break;
            case "fixedFooter":
                if (localStorage.footer != 'fix') {
                    localStorage.footer = "fix";
                    $(this).prop('checked', true);
                    footers.addClass('fix');
                } else {
                    localStorage.removeItem('footer');
                    $(this).prop('checked', false);
                    footers.removeClass('fix');
                }
                break;
        }
    });

    clearLStorage.bind('click', function(){
        var m = 'Would you like to reset all your saved Layout Settings?';
        Lobibox.confirm({
            title   : 'Confirm Delete',
            width   : '500',
            msg     : m,
            callback: function ($this, type, ev) {
                if(type == 'yes') {
                    localStorage.clear();
                    location.reload();
                }
            }
        });
    });

    tglSm.bind('click', function() {
        updateTable();
        if (localStorage.toggled != 'active') {
            localStorage.toggled = "active";
            $(this).addClass('active');
            sidemenu.addClass('active');
            page.addClass('active');
            navheader.addClass('active');
            navTop.addClass('active');
            footers.addClass('active');
        } else {
            localStorage.removeItem('toggled');
            $(this).removeClass('active');
            sidemenu.removeClass('active');
            page.removeClass('active');
            navheader.removeClass('active');
            navTop.removeClass('active');
            footers.removeClass('active');
        }
    });


    //Checking active menu using location
    $('#side').find('a.menu').each(function() {
        var link = $(this);
        if (link.get(0).href === location.href) {
            link.addClass("active").parents("ul").addClass("show");
            link.addClass("active").parents("li").addClass("active").children('a').attr('aria-expanded',true);
            return false;
        }
    });
}

//Function for Clear Forms Data & Checked and Hide Form & Show Table
function clearForm(){
    $('.getData').val('').attr('checked', false);
    $('#getImage').find('img').attr('src','');
    $('.showForm').hide();
    $('.showData').show();
    $('#save').show();
    $('#update').hide();
}

//Global Function for All Search ID
function allSearchID(data){
    //Function for handle Dynamic Search ID with Popup
    $('.addon-click').on('click', function(){
        var api = $(this).attr('id'), target = $(this).attr('rel'), title = $(this).attr('title');
        console.log(target);
        var forms ='<div class="inners"><form id="searchForm"><div class="form-group">'+
            '<input type="text" name="keyword" class="form-control" id="keyword" placeholder="Keyword">'+
            '<span class="btn btn-success btn-sm" id="findCodes"><i class="fa fa-search"></i> Search</span>'+
            '</div></form><div class="table-cont"></div></div>';

        Lobibox.window({
            title           : title,
            width           : '500',
            height          : '500',
            draggable       : true,
            modal           : true,
            content         : forms,
            buttons: {
                ok: {
                    class: 'btn btn-danger',
                    text: 'Close',
                    closeOnClick: true
                }
            }
        });

        $('#findCodes').on('click', function(){
            $('.table-cont').empty();
            var formData = $('#searchForm').serialize(), header = "";
            loading('lobibox-body', 1);
            $.ajax({
                type: 'POST',
                url: api,
                data: formData,
                dataType: "JSON",
                async: true,
                success: function (obj) {
                    loading('lobibox-body', 2);
                    $.each(obj.header, function(k, v){
                        header = header + "<th>"+v.title+"</th>";
                    });

                    var table = $('<table class="table table-bordered table-striped table-hover" />').append('<thead><tr>'+header+'</tr></thead>').appendTo('.table-cont'),
                        tbody = table.append('<tbody/>');

                    $.each(obj.data, function(kDat, vDat){
                        var tdData = "";
                        $.each(vDat, function(kDat2, vDat2){
                            tdData = tdData + "<td>"+vDat2+"</td>"
                        });
                        tbody.append('<tr>'+tdData+'</tr>');
                    });

                    $('.setAcc').on('click', function(){
                        var id = $(this).attr('id'), name = $(this).attr('rel');
                        $('.setAcc').removeClass('active');
                        $(this).addClass('active');
                        $('#'+target).val(name).next().val(id);
                    });
                }
            });
        });
    });
}

//Function Time Animate
function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function startTime() {
    var today = new Date(),
        h = today.getHours(),
        m = today.getMinutes(),
        s = today.getSeconds();
    // add a zero in front of numbers<10
    m = checkTime(m);
    s = checkTime(s);
    $('#time').html(h + ":" + m + ":" + s);
    t = setTimeout(function() {
        startTime();
    }, 500);
}

function getTime() {
    var text = "",
        d = new Date(),
        days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        tanggal = d.getDate(),
        bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nop', 'Dec'],
        tahun = d.getFullYear();

    text += '<span>' + days[d.getDay()] + ',</span>';
    text += '<span>' + tanggal + ' ' + bulan[d.getMonth()] +'<span>';
    text += '<span> ' + tahun + '<span>';
    $('.todaydate').html(text);
}


//Function for Copy Clipboard
$.fn.copyme = function() {
    $('.success-alert').remove();
    this.select();
    $(this).focus();
    document.execCommand("copy");
    document.getSelection().removeAllRanges();
    $(this).after('<span class="success-alert pull-right">Copied to clipboard</span>');
    setTimeout(function(){
        $('.success-alert').remove();
    }, 2000);
};

function footerFloat(){
    var pw = $('#page-wrapper').height(), w = $(window).height() - 90;
    if(pw < w){
        $('.ftr').addClass('static');
    }else{
        $('.ftr').removeClass('static');
    }
}

function updateTable() {
    //console.log('Update table');
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
        $('.tblHead,.tblContent', me).width(wUl);
    });
}


