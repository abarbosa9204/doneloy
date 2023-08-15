$raiz = '';
var galleryTop;
var rotarForm;
var sedes;
if(window.location.href.indexOf("app_dev.php") > -1) {
    $raiz = '/app_dev.php';
}



$(function(){
    newsletter();
    header();
    banners();
    link_home();
    otros_Serv();
    //reduceMenu();
    producto();
    itemHover();
    link_full();
    video_l();
    sucursales();
    inspiracion();
    anonimo();
    documento();
    direcciones();
    ciudades();

    if(isMobile){
        $( "#v_menu" ).click(function() {
            $( ".header ul, .header .opciones" ).slideToggle( "slow", function() {
                // Animation complete.
            });
        });
        $( ".sucursal .filter h5" ).click(function() {
            if($(this).next('ul').css('display') != 'block'){
                var clicked = $(this).next('ul');
                var index = $(this).next('ul').index();
                console.log(index);
                $(this).next('ul').slideToggle( "slow", function() {});
                $('.filter ul').each( function() {
                    if($(this).css('display') == 'block' && $(this).index() != index)
                        $(this).slideToggle( "slow", function() {});
                });
            }else{
                $('.filter ul').each( function() {
                    if($(this).css('display') == 'block')
                        $(this).slideToggle( "slow", function() {});
                });
            }
        });
        fixFilter();
        filter();
    }
    prensa();

    $('#moneda').tooltipster({
        interactive: true
    });

    moneda();

});

function documento(){
    $('#factura_tipodocumento').change(function () {
        var tipo = $('#factura_tipodocumento').val();
        if(tipo == 3){
            $('#factura_documento').val($('#factura_documento').val().substr(0, 9));
        }
    });
    $('#factura_documento').on('input', function (event) {
        var tipo = $('#factura_tipodocumento').val();
        //this.value = this.value.replace(/[^0-9]/g, '');
        this.value = this.value.replace(/\W+/g, " ")
        console.log(tipo);
        if(tipo == 3){
            this.value = this.value.substr(0, 9);
        }

    });
};

function anonimo(){
    $('#anonimo').click(function () {
        var checked = $(this).prop('checked');
        console.log(checked);
        if(checked){
            $('#dedicatoria_de').val('Anonimo');
            $('#dedicatoria_de').attr('type','hidden');
        }else{
            $('#dedicatoria_de').attr('type','text');
            if($('#dedicatoria_de').val() == 'Anonimo'){
                $('#dedicatoria_de').val('');
            }
        }
    })
}

function moneda(){

    $('.monedas input').click(function (e) {
        console.log('monedas');
        var item = $(this).parent().attr('data-moneda');
        console.log(item);
        $('#moneda').find('span').html(item);
        e.stopPropagation();
        $.ajax({
            url: $raiz+"/set-moneda/"+item,
        })
        .done(function(data) {
            window.location.reload();
        })
        .fail(function() {
        })
        .always(function() {
        });
    });
}



$( document ).ready(function() {



});


$( window ).resize(function() {
    header();
});


$(window).on("load", function() {
    fixHeightProds();
});

$(window).scroll(function(){

    //reduceMenu();
    fixFilter();

});

function isMobile() {
    return(/Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) );
}

function isIpad(){
    return navigator.userAgent.match(/iPad/i);
}


function prensa(){

    $('.articulos .rotador a').click(function () {

        //console.log('click articulo');

        var titulo = $(this).attr('data-titulo');
        var resumen = $(this).attr('data-resumen');
        var imagen = $(this).attr('data-imagenEn');

        $('.the_blog .txt h2').html(titulo);
        $('.the_blog .txt .resumen').html(resumen);
        $('.the_blog .txt .big_img').attr('src', imagen);

    });

    $( ".articulos .rotador a:first-child" ).on( "click", function() {
    });
    $( ".articulos .rotador a:first-child" ).trigger( "click" );
}

function filter(){


    if(isMobile()) {

        //$('.cont_filter').mCustomScrollbar("destroy");
        //$('.cont_filter').mCustomScrollbar();

        $('#v_filtro').click(function () {

            var icoV = $(this);
            var filter = $('.filter');
            var dataVisible = icoV.attr('data-visible');

            if (dataVisible == 0) {
                TweenMax.to(filter, 0.5, {left: '0', backgroundColor: 'rgba(1, 24, 52, 1)'});
                TweenMax.to(icoV, 1, {left: '0'});
                $(this).attr('data-visible', 1);
                icoV.find('i').addClass('fa-times');
            } else {
                TweenMax.to(filter, 0.7, {left: '-100%', backgroundColor: 'rgba(250, 250, 250, 0.5)'});
                TweenMax.to(icoV, 0.5, {left: '100%'});
                $(this).attr('data-visible', 0);
                icoV.find('i').removeClass('fa-times');
            }

        });

    }

}


function fixFilter(){

    scrollPosition = $(window).scrollTop();
    if(isMobile()) {
        if (scrollPosition >= 400) {
            $('#filtro').css({'position': 'fixed'});
        } else {
            $('#filtro').css({'position': 'absolute'});
        }
    }else{
        //console.log(scrollPosition);
        if(scrollPosition >= 200){
            $('.header .social').css('top',105).css({'position': 'fixed'});
        }else{
            $('.header .social').css('top',205).css({'position': 'absolute'});
        }
        if(scrollPosition >= 100){
            $('.header').addClass('fijo');
        }else{
            $('.header').removeClass('fijo');
        }
    }

}

function link_full(){

    $('.link_full .boton').click(function (){

        var txt = $(this).parent().find('.txt');
        var hover = $(this).parent();
        var dataEstado = $(this).attr('data-estado');

        if(dataEstado == 0){
            txt.slideDown( "slow" );
            TweenMax.to(hover, 1, { backgroundColor: 'rgba(1, 24, 52, 0.8)' });
            $(this).attr('data-estado', 1);
        }else{
            txt.slideUp( "slow" );
            TweenMax.to(hover, 1, { backgroundColor: 'rgba(1, 24, 52, 0.2)' });
            $(this).attr('data-estado', 0);
        }
    });

}

function itemHover(){
    var item = $('.itemHover');
    $(item).hover(
        function() {
            var ihover = $(this).find('.hover');
            TweenMax.to(ihover, 0.5, { opacity: 1 });
        }, function() {
            var ihover = $(this).find('.hover');
            TweenMax.to(ihover, 0.5, { opacity: 0 });
        }
    );
}

function producto(){

    $("#shareButtonLabel").jsSocials({
        showCount: false,
        showLabel: false,
        shares: [
            "twitter",
            "facebook",
            "email"
        ]
    });

    $("#input-id").rating({
        min: 0,
        max: 10,
        step: 1,
        emptyStar: '<i class="fa fa-star-o" aria-hidden="true"></i>',
        filledStar: '<i class="fa fa-star" aria-hidden="true"></i>',
        rtl: false,
        showCaption: false,
        size: 'xs'
    }).on("rating.change", function(event, value, caption) {
        $.LoadingOverlay("show",{ zIndex: 9999, image: '/js/jquery-loading-overlay/src/loading.gif'});
        console.log("You rated: " + value);
        var id = $('#id_prod').val();
        $.ajax({
            url: $raiz+"/calificar/"+value+"/"+id,
        })
        .done(function(data) {
            //console.log(data.cantidad);
        })
        .fail(function() {
            $.LoadingOverlay("hide");
        })
        .always(function() {
            $.LoadingOverlay("hide");
        });
    });;
}

var scrollPosition = 0;

function reduceMenu(){
    var menu = $('.header ul');

    scrollPosition = $(window).scrollTop();

    if( !isMobile() && scrollPosition > 1){
        TweenMax.to(menu, 0.5, { marginTop: '-50px'});
    }else {
        TweenMax.to(menu, 0.2, { marginTop: '30px'});
    }

}

var l_video = 0;

function video_l(){

    $('.video_l a').click(function () {
        l_video = $(this).attr('data-video');
        $('.video_viewer iframe').attr('src', l_video);
    });

    $(document).on('opened', '.video_viewer', function () {
        $('.video_viewer iframe').attr('src', l_video);
    });

    $(document).on('closing', '.video_viewer', function (e) {
        //$('#popup-youtube-player').stopVideo();
        $('#popup-youtube-player')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
    });
}

function header(){
    var headerH = $('.header').height();
    var bannerH = $('.banner').height();

    var noHeaderH = (bannerH - headerH);


    $('.no_header').each(function () {
        $(this).height(noHeaderH);
    });
}

function link_home(){
    var item = $('.links .item');

    item.mouseenter(function(){
        TweenMax.to($(this).find('.hover img'), 1, { marginTop: '10%'});
        TweenMax.to($(this).find('.hover p'), 0.5, { opacity: 1 });
        TweenMax.to($(this).find('.hover'), 0.5, { backgroundColor: 'rgba(1, 24, 52, 0.8)' });
    });

    item.mouseleave(function(){
        TweenMax.to($(this).find('.hover img'), 0.5, { marginTop: '18%'});
        TweenMax.to($(this).find('.hover p'), 0.3, { opacity: 0 });
        TweenMax.to($(this).find('.hover'), 0.3, { backgroundColor: 'rgba(1, 24, 52, 0.2)' });
    });

}

function otros_Serv(){
    var item = $('.otros_servicios .item');

    item.mouseenter(function(){
        TweenMax.to($(this).find('.hover p'), 0.5, { opacity: 1 });
        TweenMax.to($(this).find('.hover'), 0.5, { backgroundColor: 'rgba(1, 24, 52, 0.7)' });
    });

    item.mouseleave(function(){
        TweenMax.to($(this).find('.hover p'), 0.3, { opacity: 0 });
        TweenMax.to($(this).find('.hover'), 0.3, { backgroundColor: 'rgba(1, 24, 52, 0)' });
    });
}

function banners(){
    var Home = new Swiper('.sliderHome', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        autoplay: 6000,
    });

    var videosHome = new Swiper('.banner_videos .root', {
        paginationClickable: true,
        nextButton: '.banner_videos .next',
        prevButton: '.banner_videos .prev',
        spaceBetween: 30,
        slidesPerView: 4,
        breakpoints: {
            767: {
                slidesPerView: 1,
                spaceBetween: 30
            }
        }
    });

    sedes = new Swiper('.sede', {
        paginationClickable: true,
        spaceBetween: 10
    });


    rotarForm = new Swiper('.carrito .rotar', {
        paginationClickable: true,
        effect: 'flip',
        simulateTouch: false
    });

    $(".opcion label:first-child input").attr('checked', 'checked');

    $(".carrito .opcion label").click(function (e) {

        var pos = $(this).data("pos");
        if($.isNumeric(pos))
            rotarForm.slideTo(pos - 1);
    });


    var pasos_hacer = new Swiper('.rota_pasos', {
        nextButton: '.rota_pasos .next',
        prevButton: '.rota_pasos .prev',
        pagination: '.rota_pasos .pagination',
        paginationType: 'fraction'
    });

    var articulos = new Swiper('.articulos .rotador', {
        nextButton: '.articulos .next',
        prevButton: '.articulos .prev',
        slidesPerView: 5,
        spaceBetween: 10,
        breakpoints: {
            767: {
                slidesPerView: 3,
                spaceBetween: 30
            }
        }
    });
}

function FontSize(){
    if (!isMobile()) {
        $('.menu li a').flowtype({
            fontRatio: 7,
            maxFont: 24
        });
    }
}




var form_news;
function newsletter(){
    $('#form_newsletter').submit(function (e) {
        $.LoadingOverlay("show",{ zIndex: 9999, image: '/js/jquery-loading-overlay/src/loading.gif'});
        e.preventDefault();
        $('#terms_error,#news_email_error').hide();
        $acepto = $('#acepta').prop('checked');
        if($acepto){
            if(validateEmail($(this).find('input[type="email"]').val())){
                data = $(this).serialize();
                $.ajax({
                    url: $raiz+"/newsletter/"+$(this).find('input[type="email"]').val()
                }).done(function(data) {
                    $.LoadingOverlay("hide");
                    $('#exitoso').remove();
                    if(data.success == 1 || data.success == "1"){
                        $('#form_newsletter').prepend('<p id="exitoso">Inscrito exitosamente</p>');
                        $('#form_newsletter').find('input[type="email"]').val('');
                    }else{
                        $('#form_newsletter').prepend('<p id="exitoso" class="error">Email inscrito anteriormente</p>');
                    }
                });
            }else {
                $.LoadingOverlay("hide");
                $('#news_email_error').css('display','inline-block');
            }
        }else{
            $.LoadingOverlay("hide");
            $('#terms_error').css('display','inline-block');
        }
    });
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function sucursales() {
    $('.sede_t').click(function () {
        var id = $(this).data('id');
        var sede_rot = $('#sede_'+id);
        var pos = sede_rot.index();
        console.log('listado '+pos);
        map.setCenter(markers[id].getPosition());
        sedes.slideTo(pos);
    });
}

function inspiracion(){
    $('#tipo_inspiracion').change(function () {
        var val = $(this).val();
        console.log(val);
        if($.isNumeric(val)){
            $('.resumen_mensaje').hide();
            $('.tipo_'+val).show();
        }else{
            $('.resumen_mensaje').show();
        }
    });
    
    $('.select_inspiracion').click(function () {
        var val = $(this).data('id');
        console.log(val);
        $('#dedicatoria_mensaje').html(' ');
        $('#dedicatoria_mensaje').html($('#dedicatoria_'+val).text());
        //rotarForm.slideTo(0);
        $('.opcion label:first-child').click();
    });
}

function fixHeightProds() {
    var h = 0;
    $('.productos .item').each(function () {
        h = Math.max(h,$(this).height());
    });
    $('.productos .item').height(h);
}

function direcciones() {
    var campos = ["nombre","apellidos","ciudad","direccion","oficina","telefono","adicionales"]
    $('#direcciones').change(function () {
        var opcion = $('#direcciones').find(":selected");
        for(var i = 0; i <= campos.length; i++){
            campo = campos[i];
            valor = opcion.data(campo);
            if(campo == 'oficina'){
                if(valor == 'Si')
                    valor = 1;
                if(valor == 'No')
                    valor = 2;

            }
            $('#envio_'+campo).val(valor);
            console.log(valor);
        }

    });
}

function showBuscador(){
    $("#buscador_header").toggle();
}

var modal_cambiar,modal_seleccionar;
function ciudades(){
    $('#b_cc').click(function (e) {
        e.preventDefault();
        modal_seleccionar = $('[data-remodal-id=cambiar_ciudad]').remodal();
        modal_seleccionar.open();
    })
    if($('#modal_ciudades').length > 0){
        if($('#envio_ciudad').val() == 0){
            modal_seleccionar = $('[data-remodal-id=cambiar_ciudad]').remodal();
            modal_seleccionar.open();
        }
    }
    $('#envio_ciudad').change(function () {
        modal_seleccionar.close();
        var ciudad_id = $(this).val();
        if($.isNumeric(ciudad_id) && ciudad_id != 0){
            if(parseInt($('#cant_prod').data('cant')) > 0){
                modal_cambiar = $('[data-remodal-id=aceptar_ciudad]').remodal();
                modal_cambiar.open();
            }else{
                sendCiudad();
                $.LoadingOverlay("show",{ zIndex: 9999, image: '/js/jquery-loading-overlay/src/loading.gif'});
            }
        }
    });
    $('#aceptar_ciudad').click(function (e) {
        e.preventDefault();
        sendCiudad();
        $.LoadingOverlay("show",{ zIndex: 9999, image: '/js/jquery-loading-overlay/src/loading.gif'});
        modal_cambiar.close();
    })
    $('#cancelar_ciudad').click(function (e) {
        e.preventDefault();
        modal_cambiar.close();
    })
}

function sendCiudad() {
    console.log($('#envio_ciudad').val());
    var url = $raiz+'/cambio_ciudad/'+$('#envio_ciudad').val();
    $.ajax({
        url: url,
    })
    .done(function(data) {
        console.log(data);
        var alteredURL = removeParam("ciudad", data.url);
        window.location.href = alteredURL+"?ciudad="+$('#envio_ciudad').val();
    })
    .fail(function() {
    })
    .always(function() {
    });

}

function removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
}