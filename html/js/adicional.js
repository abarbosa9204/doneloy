$(function(){
    $('#adicional_empresa').parent().hide();
    enviarForm();
});

function enviarForm(){
    $('#form_adicional').submit(function(e){
        //e.preventDefault();
        $('#terminado').remove();
        $select = $(this).find('input:visible').not('input[type=submit], #adicional_otros, #adicional_otrosNum, #adicional_satisfaccionGeneral, #adicional_satisfaccionFisicas' +
            ',#adicional_satisfaccionHoras, #adicional_satisfaccionBienestar, #adicional_satisfaccionPertenencia, #adicional_mide_0, #adicional_mide_1').filter(function() {
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