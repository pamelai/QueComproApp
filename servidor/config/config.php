<?php
    date_default_timezone_set('America/Argentina/Buenos_Aires');
    
    $servidor= 'localhost';
    $usuario='root';
    $pass='';
    $db='que_compro';

    $conexion=mysqli_connect($servidor,$usuario,$pass,$db);