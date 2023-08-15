$raiz = '';
if(window.location.href.indexOf("app_dev.php") > -1) {
    $raiz = '/app_dev.php';
}

$(function () {
    $('.vm').click(function (e) {
        e.preventDefault();
        var padre = $(this).parent();
        var talla_id = $(this).data('talla-id');
        padre.find('.talla_'+talla_id).each(function () {
            guardar($(this));
        });
    });

    $('#inventarios input').click(function () {

    });
});

function guardar(elem) {
    console.log(1);
    var talla_id = elem.data('talla-id');
    var tipo = elem.data('tipo');
    var abue = elem.parent().parent();
    var producto_id = abue.data('producto-id');
    var precio = abue.find('.precio.talla_'+talla_id).val();
    var cantidad = abue.find('.cantidad.talla_'+talla_id).val();
    var base = $raiz+'/admin/inventarios_'+tipo+'/'+producto_id+'/'+talla_id+'/';
    if(tipo == 'cantidad')
        var url = base + cantidad;
    else
        var url = base + precio;
    console.log(url);
    var padre = elem.parent();
    padre.find('.guardando').show();
    padre.find('.error').hide();
    $.ajax({
        url: url
    })
    .done(function(data) {
        console.log(data);
        if(data.status == 4)
            padre.find('.error').show();
    })
    .fail(function() {
    })
    .always(function() {
        padre.find('.guardando').hide();
        //$.LoadingOverlay("hide");
    });
}