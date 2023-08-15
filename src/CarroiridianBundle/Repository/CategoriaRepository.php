<?php

namespace CarroiridianBundle\Repository;

/**
 * CategoriaRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class CategoriaRepository extends \Doctrine\ORM\EntityRepository
{
	public static function getAbasto(\Doctrine\ORM\EntityRepository $er){
		return $er->createQueryBuilder('c')
			->where('c.abasto = 1');
	}
}
