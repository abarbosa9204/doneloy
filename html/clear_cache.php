<?php 
$x = exec('/opt/plesk/php/7.0/bin/php /var/www/vhosts/msw7-788b.accessdomain.com/httpdocs/prueba/don_eloy/bin/console cache:clear --no-warmup -e prod',$out);
var_dump($x);
var_dump($out);
 ?>