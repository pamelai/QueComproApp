<?php
   header("Access-Control-Allow-Origin: *");
   require_once('../config/config.php');
   require_once('../config/functions.php');

   $seccion = @file_get_contents("php://input");
   
   echo Mostrar_datos($seccion);