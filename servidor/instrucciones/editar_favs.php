<?php 
   header("Access-Control-Allow-Origin: *");
   require_once('../config/config.php');
   require_once('../config/functions.php');

   $aFavs =  json_decode(@file_get_contents("php://input"));

   $aFavsId=[];
   foreach($aFavs as $fav ):

      $aFavsId[]=$fav->id;

   endforeach;
   echo Agregar_fav($aFavsId);