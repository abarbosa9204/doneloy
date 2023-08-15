<?php

namespace UserIridianBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;

class UserIridianBundle extends Bundle
{
    public function getParent()
    {
        return 'FOSUserBundle';
    }
}
