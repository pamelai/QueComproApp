<?php 
   header("Access-Control-Allow-Origin: *");
   require_once('../config/config.php');
   require_once('../config/functions.php');

   $lista = json_decode(@file_get_contents("php://input"));

   echo Borrar_lista($lista);