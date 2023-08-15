var fila;

$(function () {
    listado_productos();
    clickColores();
    agregar();
    departamentoChange();
    getCiudadesDept();
    getCostoEnvio();
    hideUser();
    activeTalla();
    complementos();
    datosIgual();
    planAbasto();
    cambioTalla();
    seleccionarColor();
});

function clickColores(){
    $('.colors a').click(function(){
        var check = $(this).find('input');
        if (check.is(':checked')) {
            check.prop('checked', false);
            $(this).removeClass('active');
        }else {
            check.prop('checked', true);
            $(this).addClass('active');
        }
        filtrar();
    });
}

function listado_productos(){
    var inputs = $('.filter input');
    inputs.click(function () {
        filtrar();
    });
}
function filtrar() {
    var arrs = [], arrs_class = [];
    $('.filter ul.grupo').each(function () {
        arrs.push($(this).find('input:checked'));
    });
    $.each( arrs, function( index, value ){
        var arr_temp = $.map( value, function( el ) {
            return ( '.'+$(el).data('class') );
        });
        arrs_class.push(arr_temp);
    });
    var cp = [];
    for(var i = 0; i < arrs_class.length - 1; i++){
        if(i == 0)
            cp = cartesianProductOf(arrs_class[i],arrs_class[i+1]);
        else
            cp = cartesianProductOf(cp,arrs_class[i+1]);
    }
    cp = cp.join( "," );
    $('.list .item').hide();
    if(cp)
        $(cp).show();
    else
        $('.list .item').show();
}

function cartesianProductOf(arr1,arr2) {
    var customerDebtorMatrix = [];
    for (var i = 0; i < arr1.length; i++) {
        for (var l = 0; l < arr2.length; l++) {
            customerDebtorMatrix.push(arr1[i]+arr2[l]);
        }
    }
    if(arr1.length == 0)
        return arr2;
    if(arr2.length == 0)
        return arr1;
    return customerDebtorMatrix;
};

function agregar() {
    $('.eliminar').click(function (e) {
        e.preventDefault();
        fila = $(this).closest('tr');
        //addCarritoTalla($(this).data('id'),$(this).data('cant'),$(this).data('id-talla'));
        eliminarSolos($(this).data('id'),$(this).data('id-talla'));
    });
    $('.eliminar_comp').click(function (e) {
        fila = $(this).closest('tr');
        e.preventDefault();
        eliminarComple($(this).data('id'),$(this).data('id-talla'),$(this).data('key'),$(this).data('key-comp'));
    });

    $('.eliminar_combo').click(function (e) {
        fila = $(this).closest('tr');
        e.preventDefault();
        eliminarCombo($(this).data('id'),$(this).data('id-talla'),$(this).data('key'));
    });
    $('.add_talla').click(function(e){
        e.preventDefault();
        var color = $('#color').val();
        console.log(color);
        if(color == 0){
            alertify.alert('Alerta','Debes seleccionar el color de Rosa');
        }else{
            $.LoadingOverlay("show",{ zIndex: 9999, image: '/js/jquery-loading-overlay/src/loading.gif'});
            console.log($('#complementos_ids').val());
            console.log($('input[name="complementos_ids[]"]').val());
            var id = $(this).data('id');
            var cant = $(this).data('cant');
            var talla = $('#select-talla').val();
            var complementos_ids = ($('#complementos_ids').val());
            var complementos_cant = ($('#complementos_cant').val());
            addCarritoTalla(id,cant,talla,complementos_ids,complementos_cant,color);
        }
        //
    });

    $('.select-cant').change(function () {
        $.LoadingOverlay("show",{ zIndex: 9999, image: '/js/jquery-loading-overlay/src/loading.gif'});
        setCarritoTalla($(this).parent().parent().data('id'),$(this).val(),$(this).parent().parent().data('id-talla'));
    });

    $('.eliminar_bono').click(function (e) {
        e.preventDefault();
        removeCarritoBono($(this).data('id'));
    });
    
    $('#rosa_veloz').change(function () {
        rosa = 0;
        var checked = $(this).prop('checked');
        if(checked)
            rosa = 1;
        setRosa(rosa);
    });
    $('.eliminar_rosa').click(function (e) {
        e.preventDefault();
        setRosa(0);
    });
}

function addCarrito(id,cant){
    $.ajax({
        url: $raiz+"/add-carrito/"+id+"/"+cant,
    })
    .done(function(data) {
        console.log(data.cantidad);
        $('#cantidad_'+id).html(data.cantidad);
        verGocarrito();
        if(window.location.href.indexOf("datos") > -1) {
            /*
             if(data.cantidad < 1){
             $('#fila_'+id).remove();
             }
             */
            window.location.reload();
        }
    })
    .fail(function() {
    })
    .always(function() {
    });

    function verGocarrito(){
        TweenMax.to($('.go_carrito'), 0.8, { 'opacity': 1 });
    }
}

function setRosa(rosa){
    $.ajax({
        url: $raiz+"/set-rosa/"+rosa,
    })
    .done(function(data) {
        if(window.location.href.indexOf("carrito-de-compras") > -1  || window.location.href.indexOf("resumen-compra") > -1) {
            window.location.reload();
        }
    })
    .fail(function() {
    })
    .always(function() {
    });
}

function eliminarComple(id,talla,key,key_comp){
    $.LoadingOverlay("show",{ zIndex: 9999, image: '/js/jquery-loading-overlay/src/loading.gif'});
    $.ajax({
        url: $raiz+"/remove-comp/"+id+"/"+talla+"/"+key+"/"+key_comp,
    })
        .done(function(data) {
            console.log(data.cantidad);
            fila.remove();
            if(window.location.href.indexOf("carrito-de-compras") > -1) {
                window.location.reload();
            }
            window.location = $raiz + '/carrito-de-compras';
        })
        .fail(function() {
            $.LoadingOverlay("hide");
        })
        .always(function() {
        });
}

function eliminarCombo(id,talla,key){
    $.LoadingOverlay("show",{ zIndex: 9999, image: '/js/jquery-loading-overlay/src/loading.gif'});
    $.ajax({
        url: $raiz+"/remove-combo/"+id+"/"+talla+"/"+key,
    })
        .done(function(data) {
            console.log(data.cantidad);
            fila.remove();
            if(window.location.href.indexOf("carrito-de-compras") > -1) {
                window.location.reload();
            }
            window.location = $raiz + '/carrito-de-compras';
        })
        .fail(function() {
            $.LoadingOverlay("hide");
        })
        .always(function() {
        });
}

function eliminarSolos(id,talla,key){
    $.LoadingOverlay("show",{ zIndex: 9999, image: '/js/jquery-loading-overlay/src/loading.gif'});
    $.ajax({
        url: $raiz+"/remove-solos/"+id+"/"+talla,
    })
        .done(function(data) {
            console.log(data.cantidad);
            fila.remove();
            if(window.location.href.indexOf("carrito-de-compras") > -1) {
                window.location.reload();
            }
            window.location = $raiz + '/carrito-de-compras';
        })
        .fail(function() {
            $.LoadingOverlay("hide");
        })
        .always(function() {
        });
}

function cambiarCantidad(id,talla){
    $.LoadingOverlay("show",{ zIndex: 9999, image: '/js/jquery-loading-overlay/src/loading.gif'});
    $.ajax({
        url: $raiz+"/cambiar-cantidad/"+id+"/"+talla,
    })
        .done(function(data) {
            console.log(data.cantidad);
            fila.remove();
            if(window.location.href.indexOf("carrito-de-compras") > -1) {
                window.location.reload();
            }
            window.location = $raiz + '/carrito-de-compras';
        })
        .fail(function() {
            $.LoadingOverlay("hide");
        })
        .always(function() {
        });
}

function addCarritoTalla(id,cant,talla,complementos_ids,complementos_cant,color){
    if(complementos_ids.length == 0) {
        complementos_ids = 0;
        complementos_cant = 0;
    }
    $.ajax({
        url: $raiz+"/add-carrito-talla/"+id+"/"+talla+"/"+complementos_ids+"/"+complementos_cant+"/"+color,
    })
    .done(function(data) {
        console.log(data.cantidad);
        if(window.location.href.indexOf("carrito-de-compras") > -1) {
            window.location.reload();
        }
        window.location = $raiz + '/carrito-de-compras';
    })
    .fail(function() {
        $.LoadingOverlay("hide");
    })
    .always(function() {
    });
}

function removeCarritoBono(id){

    $.ajax({
        url: $raiz+"/remove-carrito-bono/"+id,
    })
        .done(function(data) {
            console.log(data.cantidad);
            if(window.location.href.indexOf("carrito-de-compras") > -1) {
                window.location.reload();
            }
            window.location = $raiz + '/carrito-de-compras';
        })
        .fail(function() {
            $.LoadingOverlay("hide");
        })
        .always(function() {
        });
}

function setCarritoTalla(id,cant,talla){

    $.ajax({
        url: $raiz+"/set-carrito-talla/"+id+"/"+cant+"/"+talla,
    })
        .done(function(data) {
            console.log(data.cantidad);
            if(window.location.href.indexOf("carrito-de-compras") > -1) {
                window.location.reload();
            }
            window.location = $raiz + '/carrito-de-compras';
        })
        .fail(function() {
            $.LoadingOverlay("hide");
        })
        .always(function() {
        });
}

/****  Dirección ***/

function departamentoChange(){
    $('#factura_departamento').change(function () {
        getCiudadesDept();
    });
}
function getCiudadesDept(){
    if(!$.isNumeric($('#factura_departamento').val())){
        $('#factura_ciudad').html('<option>Ciudad</option>');
    }else{
        //$.LoadingOverlay("show",{ zIndex: 9999, image: '/js/jquery-loading-overlay/src/loading.gif'});
        $.ajax({
            url: $raiz+"/ciudades-dept/"+$('#factura_departamento').val(),
        })
            .done(function(html) {
                $('#factura_ciudad').html(html);
                //costoEnvio();
            })
            .fail(function() {
            })
            .always(function() {
                //$.LoadingOverlay("hide");
            });
    }




}
function getCostoEnvio(){
    $('#factura_ciudad').change(function () {
        costoEnvio();
    });
}
function costoEnvio(){
    $('#costo-envio-span').html($('#factura_ciudad').find(':selected').data('costo'));
    $('#costo-envio').val($('#factura_ciudad').find(':selected').data('costo'));
    var result = parseInt($('#total-carrito').val()) + parseInt($('#factura_ciudad').find(':selected').data('costo-noformato'));
    var iva = Math.round(result * 0.16/1.16);
    $('#carrito-iva').html("$" + iva)
    $('#total-resultado').html("$" + (result + iva))
    //{{ total | number_format }}
    //round($total*0.16/1.16,2);

}

function hideUser(){
    $('#envio_user').parent().hide();
}

function activeTalla(){
    $('.size a').click(function(){
        var value = $(this).data('value');
        $('#select-talla').val(value);
        $('.size a').removeClass('active');
        $(this).addClass('active');
    });
}

var prod_talla_carrito = false;
function complementos(){
    $('.add_complemento').click(function () {
        console.log(prod_talla_carrito);
        if(!prod_talla_carrito){
            var id = $(this).data('id');
            //console.log(id);
            if(existe(id)){
                $(this).find('span').text($(this).data('add'));
                var pos = $('#complementos_ids option[value="'+id+'"]').index();
                console.log(pos);
                console.log('after'+pos);
                $('#complementos_ids option[value="'+id+'"]').remove();
                $('#complementos_cant option').eq(pos).remove();
            }else {
                $(this).find('span').text($(this).data('remove'));
                $('#complementos_ids').append('<option type="hidden"value="'+id+'" selected></option>');
                $('#complementos_cant').append('<option type="hidden"value="1" selected></option>');
            }
        }else{
            var id_comp = $(this).data('id');
            var talla = $('#select-talla').val();
            var id = $('.add_talla').data('id');
            var comple = $(this);
            $.ajax({
                url: $raiz+"/check-complemento/"+id+"/"+talla+"/"+id_comp,
                dataType: "json"
            })
            .done(function(data) {
                console.log(data);
                comple.find('span').text(comple.data(data.action));
            })
            .fail(function() {
            })
            .always(function() {
            });
        }
    });
    $('.add_complemento').each(function () {
        var id = $(this).data('id');
        var complementos_ids = $('#complementos_ids').val();
        if(existe(id)){
            $(this).find('span').text($(this).data('remove'));
        }
    });

    $('.abrir_complementos').click(function () {
        var id = $(this).data('id');
        var talla = $('#select-talla').val();
        complementosInit();
        $.ajax({
            url: $raiz+"/carrito-complementos/"+id+"/"+talla,
            dataType: "json"
        })
        .done(function(data) {
            var cant_comp = 0;
            for(var i = 0; i < data.length; i++){
                var grupo = data[i];
                var complementos = grupo.complementos;
                var productos = grupo.productos;
                cant_comp += complementos.length;
            }
            if(i > 0 ){
                prod_talla_carrito = true;
            }else{
                prod_talla_carrito = false;
            }
            console.log(cant_comp);
            var tiene_comp = false;
            if(cant_comp > 0){
                tiene_comp = true;
            }
            /*
            if(complementos.length == 0){
                tiene_comp = true;
                if(productos.length > 0){

                }

            }
            */
            if(tiene_comp) {
                //TODO Preguntar cuantos productos hay
                for(var j = 0; j < complementos.length; j++){
                    var complemento = complementos[j];
                    console.log(complemento.producto.id);
                    complementoAgregado(complemento.producto.id);
                }

            }
        })
        .fail(function() {
        })
        .always(function() {
        });
    });
}

function complementosInit(){
    $('.add_complemento').each(function () {
        $(this).find('span').text($(this).data('add'));
        $('#complementos_ids').empty();
        $('#complementos_cant').empty();
    });
}

function complementoAgregado(id){
    var elem = $('#comp_'+id);
    elem.find('span').text(elem.data('remove'));
}

function existe(id) {
    var exists = false;
    $('#complementos_ids option').each(function(){
        console.log(this.value,id);
        if (this.value == id) {
            exists = true;
            return exists;
        }
    });
    return exists;
}
function datosIgual(){
    $('#datos_igual').change(function () {
        $('form input[type="text"],#envio_ciudad').each(function () {
            $val = $(this).data('val');
            $(this).val($val);
        });
    });
}

function planAbasto() {
    $('.cont_perio input').click(function () {
        $('.add_talla').data('id',$(this).val());
        console.log($('.add_talla').data('id'))
    });
}

function cambioTalla(){
    mostrarColores();
    $('#select-talla').val();
    $('#select-talla').change(function () {
        var precio = $(this).find('option:selected').data('precio');
        console.log(precio);
        $('#precio').html(precio);
        mostrarColores();
    });
}
function mostrarColores() {
    var t_id = $('#select-talla').val();
    if($('#tc_'+t_id).length > 0){
        var tcols = $('#tc_'+t_id).val().split(' ');
        $('.colores').show();
        $('.color_padre').hide();
        var c = 0;
        for(var i = 0; i < tcols.length; i++){
            $('#color_'+tcols[i]).show();
            c++;
        }
        if(c > 0){
            $('.color_padre:last-child').show();
        }
    }else{
        $('.color_padre').hide();
    }
}
function seleccionarColor() {
    $('.color').click(function (e) {
        e.preventDefault();
        $('.color').removeClass('active');
        $(this).addClass('active');
        $('#color').val($(this).data('id'));
    });
}