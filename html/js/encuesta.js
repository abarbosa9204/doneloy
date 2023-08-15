var ab = ['a','b'];
var pos_sedes;
$(function(){
    $directivos = $('#encuesta_directivos input');
    $directivos.each(function(i){
        if($(this).val().length < 10)
            $(this).parent().remove()
    });
    $directivos.each(function(i){
        try{
            $cad = unserialize($(this).val());
            $cad = $.map($cad, function(el) { return el });
            $padre = addFilaDir($cad,i);
            $('#directivos').append($padre);
        }catch (e){

        }
    });


    $('#directivos .linea_tabla input').change(function(){
        var abue = $(this).parent().parent();
        var pos = abue.data('pos');
        var datos = getDatos(abue);
        var valor = serialize(datos);
        $('#encuesta_directivos input').eq(pos).val(valor);
    });

    ab = ['c','d'];
    $sedes = $('#encuesta_sedes input');
    $sedes.each(function(i){
        if($(this).val().length < 10)
            $(this).parent().remove()
    });
    $sedes.each(function(i){
        try{
            $cad = unserialize($(this).val());
            $cad = $.map($cad, function(el) { return el });
            $padre = addFilaSede($cad,i);
            $('#total_sedes').before($padre);
        }catch (e){

        }
        pos_sedes = i;
    });

    $('#sedes').on('change','.linea_tabla input',function(){
        var abue = $(this).parent().parent();
        var pos = abue.data('pos');
        var datos = getDatos(abue);
        var valor = serialize(datos);
        $('#encuesta_sedes input').eq(pos).val(valor);
    });

    $('#add_sede').click(function(e){
        pos_sedes++;
        e.preventDefault();
        var sede_template = _.template($('#fila_sedes').html());
        var sede_input_template = _.template($('#input_sede').html());
        $('#total_sedes').before(sede_template({pos: pos_sedes}));
        $('#encuesta_sedes').append(sede_input_template({pos: pos_sedes}));
    });

    $exportaciones = $('#encuesta_exportacionePais input');
    $exportaciones.each(function(i){
        if($(this).val().length < 10)
            $(this).parent().remove()
    });
    $exportaciones.each(function(i){
        try{
            $cad = unserialize($(this).val());
            $cad = $.map($cad, function(el) { return el });
            $pais = $cad[0];
            $participacion = $cad[1];
            var exportacion_template = _.template($('#fila_exportaciones').html());
            $('#total_exportaciones').before(exportacion_template({pais: $pais, participacion: $participacion}));
        }catch (e){

        }
    });

    $('#exportaciones').on('keyup, change','.linea_servicios input',function(){
        var papa = $(this).parent();
        var pos = papa.index();
        var datos = getDatos(papa);
        var valor = serialize(datos);
        $('#encuesta_exportacionePais input').eq(pos).val(valor);
    });

    $('#add_exportacion').click(function(e){
        e.preventDefault();
        var pos = $('#exportaciones .linea_servicios').length - 1;
        var exportacion_template = _.template($('#fila_exportaciones').html());
        var exportacion_input_template = _.template($('#input_exportacion').html());
        $('#total_exportaciones').before(exportacion_template({pais: '', participacion: ''}));
        $('#encuesta_exportacionePais').append(exportacion_input_template({pos: pos}));
        $('#exportaciones .linea_servicios input').trigger('change');
    });


    $plataformas = $('#encuesta_plataformas input');
    $plataformas.each(function(i){
        if($(this).val().length < 10)
            $(this).parent().remove()
    });
    $plataformas.each(function(i){
        try{
            $cad = unserialize($(this).val());
            $cad = $.map($cad, function(el) { return el });
            $nombre = $cad[0];
            $proveedor1 = $cad[1];
            $participacion1 = $cad[2];
            $proveedor2 = $cad[3];
            $participacion2 = $cad[4];
            $proveedor3 = $cad[5];
            $participacion3 = $cad[6];
            var plataforma_template = _.template($('#fila_plataforma').html());
            $('#total_plataforma').before(plataforma_template(
                {
                    nombre: $nombre,
                    proveedor1: $proveedor1, participacion1: $participacion1,
                    proveedor2: $proveedor2, participacion2: $participacion2,
                    proveedor3: $proveedor3, participacion3: $participacion3
                }
            ));
        }catch (e){
            //console.log(e)
        }
    });

    $('#plataformas').on('keyup, change','.linea_plataformas input',function(){
        var abue = $(this).parent().parent();
        var pos = abue.index();
        console.log(pos);
        var datos = getDatos(abue);
        var valor = serialize(datos);
        $('#encuesta_plataformas input').eq(pos).val(valor);
    });


    $servicios = $('#encuesta_servicios input');
    $servicios.each(function(i){
        if($(this).val().length < 5)
            $(this).parent().remove()
    });
    $servicios.each(function(i){
        try{
            $cad = unserialize($(this).val());
            $cad = $.map($cad, function(el) { return el });
            $nombre = $cad[0];
            $participacion = $cad[1];
            var servicio_template = _.template($('#fila_servicio').html());
            $('#total_servicios_tabla').before(servicio_template(
                {
                    nombre: $nombre,
                    participacion: $participacion
                }
            ));
        }catch (e){
            //console.log(e)
        }
    });

    $('#servicios_tabla').on('keyup, change','.linea_servicios input',function(){
        var papa = $(this).parent();
        var pos = papa.index();
        var datos = getDatos(papa);
        var valor = serialize(datos);
        $('#encuesta_servicios input').eq(pos).val(valor);
    });


    sumador('.detalle_empleados input','#encuesta_sena','.dtl_empleadosa .res_porc p',0);
    sumador('#servicios input','#encuesta_serviciosOtros','#servicios p',1);
    sumador('#facturacion input','#encuesta_distribucionOtros','#facturacion .res_porc p',2);
    sumador('#actividades input','#encuesta_actividadOtros','#actividades .res_porc p',3);
    sumador('#medios input','#encuesta_mediosOtros','#medios .res_porc p',4);
    sumador('#exportaciones input','','#exportaciones p',5);
    sumador('#servicios_tabla input','','#servicios_tabla p',6);


    //currency();

    proveedor1();
    proveedor2();
    hide();

    $tp = $('#encuesta_tipoProveedor').val();
    if(!$.isNumeric($tp))
        $tp = 1;
    $('#proveedor_'+$tp).click();

    enviarForm();
});

function enviarForm(){
    $('#form_encuesta').submit(function(e){
        //e.preventDefault();
        $('#terminado').remove();
        $select = $(this).find('input:visible').not('input[type=submit], #sedes .linea_tabla input, #exportaciones input, #servicios_tabla input, #encuesta_tipoEmpresaOtro, #encuesta_distribucionOtros, #encuesta_ciudad, #encuesta_zonaFrancaNombre' +
            ',#encuesta_servicioOtrosPorcentaje, #encuesta_serviciosOtros, #encuesta_distribucionOtros, #encuesta_distribucionOtrosPorcentaje, #encuesta_plataformasOtro' +
            '#encuesta_actividadOtros, #encuesta_actividadOtrosPorcentaje, #encuesta_mediosOtros, #encuesta_mediosOtrosPorcentaje, #encuesta_serviciosOtros, #encuesta_servicioOtrosPorcentaje' +
            ',#encuesta_distribucionOtros, #encuesta_distribucionOtrosPorcentaje, #encuesta_plataformasOtro, #encuesta_actividadOtros, #encuesta_actividadOtrosPorcentaje' +
            ',#encuesta_mediosOtros, #encuesta_mediosOtrosPorcentaje').filter(function() {
            return !this.value;
        });
        $inputs = $select.length;
        $select.each(function(){
            console.log($(this).attr('id') +' - '+ $(this).parent().parent().attr('class')+' - '+ $(this).parent().parent().parent().attr('id'));
            $(this).css('background','red');
        });
        if($inputs == 0){
            $(this).append('<input type="hidden" value="1" id="terminado" name="terminado">');
        }else{
            $(this).append('<input type="hidden" value="0" id="terminado" name="terminado">');
        }
        console.log($inputs)
    });
}


$hide = ['#encuesta_directivos','#encuesta_sedes','#encuesta_exportacionePais','#encuesta_plataformas','#encuesta_servicios'];
$hide_parent = ['#encuesta_empresa'];
$campos_hide = ['#encuesta_nit','contact',''];
$conts_hide = ['#plataformas','#actividades','#medios','#servicios'];
$conts_show = ['#servicios_tabla'];

function hide(){
    for(var i = 0; i < $hide.length; i++){
        $($hide[i]).hide();
    }
    for(var i = 0; i < $hide_parent.length; i++){
        $($hide_parent[i]).parent().hide();
    }

}
function proveedor2(){
    $('#proveedor_2').click(function(e){
        e.preventDefault();
        $('#encuesta_tipoProveedor').val(2);
        for(var i = 0; i < $campos_hide.length; i++){
            $($campos_hide[i]).parent().hide();
        }
        for(var i = 0; i < $conts_hide.length; i++){
            $($conts_hide[i]).parent().hide();
            $($conts_hide[i]).parent().prev().hide();
        }
        for(var i = 0; i < $conts_show.length; i++){
            $($conts_show[i]).parent().show();
            $($conts_show[i]).parent().prev().show();
        }
    });

};


function proveedor1(){
    $('#proveedor_1').click(function(e){
        e.preventDefault();
        $('#encuesta_tipoProveedor').val(1);
        for(var i = 0; i < $campos_hide.length; i++){
            $($campos_hide[i]).parent().show();
        }
        for(var i = 0; i < $conts_hide.length; i++){
            $($conts_hide[i]).parent().show();
            $($conts_hide[i]).parent().prev().show();
        }

        for(var i = 0; i < $conts_show.length; i++){
            $($conts_show[i]).parent().hide();
            $($conts_show[i]).parent().prev().hide();
        }
    });
};



function currency(){
    $('#encuesta_activos,#encuesta_pasivos,#encuesta_patrimonio,#encuesta_ingresos,#encuesta_utilidad,#encuesta_exportaciones').autoNumeric('init');
}


var inputs = [];

function sumador(selector, exclude, p,i){
    inputs[i] = $(selector).not(exclude);
    inputs[i].change(function(){
        var total = 0;
        inputs[i].each(function(){
            var valor = $(this).val();
            if(!$.isNumeric(valor))
                valor = 0;
            total += parseInt(valor)
        });
        $(p).html(total + '%');
    });
    $(selector).eq(0).trigger('change');
}

function addFilaSede($cad,i){
    $padre = $("<div>", {class: "linea_tabla linea_a","data-pos": i});
    for(var i = 0; i < $cad.length; i++){
        $padre = addCeldaSede($padre,i, $cad[i])
    }
    return $padre;
}

function addCeldaSede(padre,i, valor){
    var l = 'd';
    if(i == 0)
        l = 'c';
    var c_nombre = $("<div>", {class: 'tbcampo_'+l});
    var c_nombre_h5 = $("<input>", {value: valor, type: 'text'});
    c_nombre.append(c_nombre_h5);
    padre.append(c_nombre);
    return padre;
}


function getDatos(abue){
    return $.map( abue.find('input'), function( n ) {
        return $(n).val();
    });
}

function addFilaDir($cad,i){
    $padre = $("<div>", {class: "linea_tabla linea_a","data-pos": i});
    for(var i = 0; i < $cad.length; i++){
        $padre = addCeldaDir($padre,i, $cad[i])
    }
    return $padre;
}

function addCeldaDir(padre,i, valor){
    var l = ab[i%2];
    var c_nombre = $("<div>", {class: 'tbcampo_'+l});
    var c_nombre_h5 = $("<input>", {value: valor, type: 'text'});
    if(i == 0)
        c_nombre_h5.prop('readonly', true);
    c_nombre.append(c_nombre_h5);
    padre.append(c_nombre);
    return padre;
}