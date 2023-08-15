var img_actual;
var link_Actual;
var texto;
var frameSrc;
var padre;
var isInIframe = (window.location != window.parent.location) ? true : false;
var base_path = '/uploads/images/general/';
var input_id ;
var input_name;
$raiz = '';
if(window.location.href.indexOf("app_dev.php") > -1) {
    $raiz = '/app_dev.php';
}

function embeddImagesForm() {
    $('#general_logo,#seo_imagen,#tipoevento_thumb_es,#tipoevento_thumb_en,#tipoevento_imagen_es' +
        ',#tipoevento_imagen_en,#taller_numero,#convenio_imagen,#sede_imagen,#testimonio_imagen' +
        ',#academia_thumb,#academia_mediana,#academia_grande,#campana_thumb,#campana_grande' +
        ',#noticia_imagen,#servicio_imagen').each(function(){
        img_actual = $(this).val();
        padre = $(this).parent();
        $id = $(this).attr('id');
        $name = $(this).attr('name');
        cleanContainer();
        if($.isNumeric(img_actual)){
            addBoton(padre,$raiz+'/admin/?action=edit&entity=Imagen&referer=modal&id='+img_actual,$id,$name,'editar imagen');
            texto = $(this).find(':selected').text();
            loadImagen(img_actual,base_path+texto,padre,$name);
        }else{
            addBoton(padre,$raiz+'/admin/?action=new&entity=Imagen&referer=modal',$id,$name,'crear imagen');
        }
    });
    clickBoton();
}

function fixImageSave(){
    try {
        $el = $('#imagen_alt,#imagengaleria_alt, #imagensede_alt, #mailing_alt, #genero_alt');
        $el = $("[id$=_alt]");
        $val = $el.val();
        var lastChar = $val.substr($val.length - 1);
        if (lastChar == '_')
            $el.val($val.substring(0, $val.length - 1));
        else
            $el.val($el.val() + '_');
    }catch(err){}

    var forms = ["sede"];
    for(var i = 0; i < forms.length; i++){
        name_form = forms[i];
        $('form[name="'+name_form+'"]').attr('novalidate','novalidate');
    }
}

function loadImagen(id,ruta, papa,name){
    if(!papa)
        papa = padre;
    if(!name)
        name = input_name;
    console.log(name+' loadImagen');
    cleanContainer();
    addBoton(papa,$raiz+'/admin/?action=edit&entity=Imagen&referer=modal&id='+id,input_id,name,'editar imagen');
    $.ajax({
        url: "/ruta_imagen/"+id,
    }).done(function(html) {
        ruta = html;
        papa.append('<img src="'+ruta+'" class="thumb_img">');
        $('#imagen_modal').modal({show:false});
        $('#imagen_modal').addClass('hide');
        $('.modal-footer .btn').click();
        papa.append('<input type="hidden" id="'+input_id+'" name="'+name+'" value="'+id+'"/>');
        clickBoton();
    });

}

function clickBoton(){
    $('.img_form').unbind('click');
    $('.img_form').click(function(){
        padre = $(this).parent();
        frameSrc = $(this).data('link');
        input_id = $(this).data('id');
        input_name = $(this).data('name');
        $('#imagen_modal iframe').attr("src",frameSrc);
        $('#imagen_modal').modal({show:true});
        $('#imagen_modal').removeClass('hide');

    });
}

function cleanContainer(){
    padre.html('');
}

function addBoton(el,link,id,name,text){
    console.log(name + 'addBoton');
    $cad = '<a href="#" class="btn btn-primary img_form" data-id="'+id+'" data-name="'+name+'" data-link="'+link+'" role="button" style="clear: both">'+text+'</a>';
    el.append($cad);
}

function cleanDOM(){
    $wrapper = $('.content-wrapper').clone();
    if(isInIframe){
        $wrapper.css({'margin':0});
        //$wrapper.find('.action-delete,.action-list,.checkbox').remove();
        //$wrapper.find('.action-delete,.action-list').remove();
        $('body').html('');
        $('body').append($wrapper);
    }
}
function fixIframe(){
    $("#iri_iframe").load(function() {
        $(this).height( $(this).contents().find("body").height() + 100 );
        $("html, body").animate({ scrollTop: $('#iri_iframe').offset().top }, 1000);
    });
}

function clickEdit(){
    $('#contenedor_objetos, #new_objeto').find('a').click(function(e){
        e.preventDefault();
        var url = $(this).attr('href');
        $("#iri_iframe").attr('src',url);
        fixIframe();
        checkUrl();
    });
}

function limpiarIframe(){
    var frame = document.getElementById("iri_iframe"),
        frameDoc = frame.contentDocument || frame.contentWindow.document;
    frameDoc.documentElement.innerHTML = "";
}

function checkUrl(){
    var action = getUrlParameter('action');
    var entity = getUrlParameter('entity');
    console.log(action);
    console.log(entity);
    if(action == 'list'){
        if(entity == 'Imagengaleria' || entity == 'Imagensede' || entity == 'Galeriaproducto' || entity == 'GaleriaPost'){
            parent.limpiarIframe();
            parent.location.reload();
        }
    }else{
        $('.action-list').remove();
    }
    if(action == 'new'){
        if(entity == 'Imagengaleria' || entity == 'Imagensede' || entity == 'Galeriaproducto' || entity == 'GaleriaPost'){
            var select = $('#imagengaleria_galeria,#imagensede_sede,#galeriaproducto_producto,#galeriapost_post');
            var id = getUrlParameter('galeria');
            var llave = select.find('option[value="'+id+'"]').text();
            var padre = select.parent();
            padre.html(llave);
            if(entity == 'Imagengaleria')
                padre.append('<input type="hidden" id="imagengaleria_galeria" name="imagengaleria[galeria]" value="'+id+'"/>');
            else if(entity == 'Imagengaleria')
                padre.append('<input type="hidden" id="imagensede_sede" name="imagensede[sede]" value="'+id+'"/>');
            else if(entity == 'Galeriaproducto')
                padre.append('<input type="hidden" id="galeriaproducto_producto" name="galeriaproducto[producto]" value="'+id+'"/>');
            else if(entity == 'GaleriaPost')
                padre.append('<input type="hidden" id="galeriapost_post" name="galeriapost[post]" value="'+id+'"/>');
        }

    }
}

function sortable(){
    $( "#contenedor_objetos" ).sortable({
        revert: true,
        helper : 'clone',
        stop: function() {
            bindOrden();
        }
    });
}

function bindOrden(){
    $('#contenedor_objetos a').each(function (i){
        console.log('#objeto_'+$(this).data('id'));
        $('#objeto_'+$(this).data('id')).val(i);
    });
    var form = $('#orden_form');
    console.log(form.serialize());
    /**/
    $.ajax({
        url   : form.attr('action'),
        type  : form.attr('method'),
        data  : form.serialize(),
        success: function(data){
            //location.reload();
            console.log(data);
        }
    });
    /**/
}

function addModal(){
    var cad = '<div id="imagen_modal" class="modal hide fade" tabindex="-1" role="dialog" >'
        +'<div class="modal-header">'
        +'<button type="button" class="close" data-dismiss="modal">×</button>'
        +'<h3>Imagen</h3>'
        +'</div>'
        +'<div class="modal-body">'
        +'<iframe src="" style="zoom:0.60" width="99.6%" height="850" frameborder="0"></iframe>'
        +'</div>'
        +'<div class="modal-footer">'
        +'<button class="btn" data-dismiss="modal">OK</button>'
        +'</div>'
        +'</div>';
    $('body').append(cad);
}

function addLogout(){
    var cad = '<ul class="sidebar-menu">'
        +'<li class="  ">'
        +'<a href="'+$raiz+'/logout" title="logout">logout</a>'
        +'</li>'
        +'</ul>';
    $('.sidebar-menu').append(cad);
}

function loadHexas(){
    $(".hexa input[type=text]").each(function () {
        $val = $(this).val();
        if(!$val)
            $val = "#f00";
        $(this).spectrum({
            color: $val,
            preferredFormat: "hex",
            showInput: true
        });
    });
}

$(function(){
    addModal();
    addLogout();
    cleanDOM();
    embeddImagesForm();
    fixImageSave();
    loadHexas();
    rangoFechas();
    if($('#reporte').length > 0)
        charts();
    if($('#reporte_bar').length > 0 && (urlContains('reporte-diario') || urlContains('reporte-mensual') ))
        chartsBar();
    if(isInIframe){
        checkUrl();
    }else{
        fixIframe();
        clickEdit();
        sortable();
    }
});

function urlContains(ruta){
    if(window.location.href.indexOf(ruta) > -1) {
        return true;
    }
    return false;
}
function chartsBar(){

    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback(drawBackgroundColor);

    function drawBackgroundColor() {
        var datos = [];
        $('#reporte_bar tbody tr').each(function (j) {
            var fila = [];
            $(this).find('td').each(function (i) {
                if(i == 0){
                    fila[i] = new Date($(this).text());
                }
                else{
                    fila[i] = parseInt($(this).text().replace(',','').replace(',','').replace('$',''));
                }
            });
            datos.push(fila);
        });
        console.log(datos);

        var data = new google.visualization.DataTable();
        data.addColumn('date', 'fecha');
        data.addColumn('number', 'ventas');

        data.addRows(datos);

        var options = {
            hAxis: {
                title: 'Time'
            },
            vAxis: {
                title: 'Popularity'
            },
            backgroundColor: { fill:'transparent' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('piechart'));
        chart.draw(data, options);
    }
}

function charts() {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var cant = 2;
        var datos = [];
        $('#reporte tr').each(function (j) {
            if(j == 0){
                cant = $(this).find('td').length
                console.log(cant);
            }
            var fila = [];
            var cont = 0;
            $(this).find('td').each(function (i) {
                if(i >= cant - 2){
                    if(i != cant - 1 || j == 0){
                        fila[cont] = $(this).text();
                    }
                    else
                        fila[cont] = parseInt($(this).text());
                    cont++;
                }
            });
            datos.push(fila);
        });

        var data = google.visualization.arrayToDataTable(datos);

        var options = {
            title: '',
            backgroundColor: { fill:'transparent' }
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(data, options);
    }
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function cb(start, end) {
    $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
}

function changeFormat(fecha){
    if(fecha != null){
        return moment(fecha);
        var arr = fecha.split("-");
        //return arr[1]+'/'+arr[2]+'/'+arr[0];
        return new Date(arr[0],arr[1],arr[2]);
    }
    return '';
}

function rangoFechas(){
    var start = changeFormat(getUrlParameter('start'));
    var end = changeFormat(getUrlParameter('end'));
    console.log(start);
    if(getUrlParameter('start') == null){
        start = moment('2017-03-23');
        end = moment();
    }
    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            'Hoy': [moment(), moment()],
            'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Últimos 7 días': [moment().subtract(6, 'days'), moment()],
            'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
            'Este mes': [moment().startOf('month'), moment().endOf('month')],
            'Semana Día de la Madre': [moment('2017-5-8'), moment('2017-5-14')],
            'Mes anterior': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);

    if(start != '')
        cb(start, end);
    else{
        //$('#reportrange span').html('Selecciona el rango de fechas');
    }
    $('#reportrange').on('apply.daterangepicker', function(ev, picker) {
        var start = picker.startDate.format('YYYY-MM-DD');
        var end = picker.endDate.format('YYYY-MM-DD');
        $('#start').val(start);
        $('#end').val(end);
        $('#rango').submit();
    });
}

/**Mapa**/
var map;
function initMap(){
    var name_form = "sede";
    if($('form[name="'+name_form+'"]')){
        $('form[name="'+name_form+'"]').find('button[type="submit"]').parent().parent().parent().before('<div id="map"  class="col-md-12" style="height: 400px;margin-bottom: 20px"></div>');
        if($('form[name="'+name_form+'"]').find('button[type="submit"]')){
            var lat;
            var lng;
            var myLatLng = {lat: 4.6619395, lng: -74.0522204};
            var lat_prev = $('#'+name_form+'_lat').val();
            var lng_prev = $('#'+name_form+'_lng').val();
            //console.log(parseFloat(lat_prev));
            if(lat_prev && lng_prev)
                myLatLng = {lat: parseFloat(lat_prev), lng: parseFloat(lng_prev)};
            else{
                $('#'+name_form+'_lat').val(myLatLng.lat);
                $('#'+name_form+'_lng').val(myLatLng.lng);
            }
            if($.isNumeric(lat_prev)){
                map = new google.maps.Map(document.getElementById('map'), {
                    center: myLatLng,
                    zoom: 14
                    //styles:[{"featureType":"all","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"},{"saturation":"-100"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40},{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"landscape","elementType":"geometry.stroke","stylers":[{"color":"#4d6059"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"lightness":21}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"poi","elementType":"geometry.stroke","stylers":[{"color":"#4d6059"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#7f8d89"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#2b3638"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2b3638"},{"lightness":17}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#24282b"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"color":"#24282b"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.icon","stylers":[{"visibility":"off"}]}]
                });

                var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    draggable:true,
                    title: 'Coordenada'
                });

                marker.addListener('dragend', function() {
                    myLatLng = marker.getPosition();
                    map.setCenter(myLatLng);
                    lat = myLatLng.lat();
                    lng = myLatLng.lng();
                    $('#'+name_form+'_lat').val(lat);
                    $('#'+name_form+'_lng').val(lng);
                });
            }

        }
    }


}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

$(function () {
    $('.datepicker').datepicker({        
        format: 'yyyy-mm-dd'
    });
    hideTallerFields();
    $('#florero_imageFile_file').change(function(){
        var val = $('#florero_imageFile_file').val();
        if(val != ''){
            $('#florero_imageFile_delete').prop('checked',true);
        }else{
            $('#florero_imageFile_delete').prop('checked',false);
        }
    });
    $('#precioplan_imageFile_file').change(function(){
        var val = $('#precioplan_imageFile_file').val();
        if(val != ''){
            $('#precioplan_imageFile_delete').prop('checked',true);
        }else{
            $('#precioplan_imageFile_delete').prop('checked',false);
        }
    });
});

function hideTallerFields() {
    if ($('#producto_taller').prop('checked')) {
        $('#producto_videoTaller').parent().parent().parent().show();
        $('#producto_horaTaller').parent().parent().parent().show();
        $('#producto_direccionTaller').parent().parent().parent().show();
        $('#producto_ciudadTaller').parent().parent().parent().show();
        $('#producto_temarioTallerFile_file').parents('.easyadmin-vich-file').parent().parent().parent().show();
    }else{
        $('#producto_videoTaller').parent().parent().parent().hide();
        $('#producto_horaTaller').parent().parent().parent().hide();
        $('#producto_direccionTaller').parent().parent().parent().hide();
        $('#producto_ciudadTaller').parent().parent().parent().hide();
        $('#producto_temarioTallerFile_file').parents('.easyadmin-vich-file').parent().parent().parent().hide();
    }
    $('#producto_taller').change(hideTallerFields);
}