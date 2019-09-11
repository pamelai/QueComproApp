<?php 
   header("Access-Control-Allow-Origin: *");
   require_once('../config/config.php');
   require_once('../config/functions.php');

   $aListas = json_decode(@file_get_contents("php://input"));

   $aListas=$aListas[0];
   
   $aListasId=[];
   foreach($aListas as $lista => $prod):

      $aListasId[]=$prod->id;

   endforeach;

   echo Crear_listas($aListasId);