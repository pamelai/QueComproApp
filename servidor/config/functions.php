<?php
   function Mostrar_datos($tipo){
      global $conexion;

      if($tipo === 'productos'):
         $query=<<<PRODUCTOS
               SELECT id, nombre, img, estado
               FROM productos
               ORDER BY nombre;
PRODUCTOS;

      elseif($tipo === 'listas'):
         $query=<<<LISTA
               SELECT lista, productos.nombre
               FROM listas
               JOIN productos ON listas.producto_id=productos.id
               ORDER BY lista DESC;
LISTA;
         $rta=mysqli_query($conexion, $query);
         
         $listas = array();
         foreach($rta as $fila) {

            $nro_lista = $fila['lista'];

            if(!isset($listas[$nro_lista])) {
               $listas[$nro_lista] = array();
            }

            $listas[$nro_lista][] = $fila;
         }
         
         $aListas = [];
         foreach($listas as $lista) {
            $aListas[] = $lista;
         }
         return json_encode($aListas);

      elseif($tipo === 'favs'):
         $query=<<<FAVS
               SELECT producto_id as id, nombre, img
               FROM favoritos
               JOIN productos ON productos.id=favoritos.producto_id;
FAVS;

      endif;

      $rta=mysqli_query($conexion, $query);
      $aDatos=array();

      while($dato=mysqli_fetch_assoc($rta)):
         $aDatos[]=$dato;

      endwhile;

      return json_encode($aDatos);
   }  


   function Crear_listas($aProd){
      global $conexion;

      $cont=1;
      $query=<<<LISTA
            SELECT lista
            FROM listas
            ORDER BY id DESC 
            LIMIT 1;
LISTA;

      $ultima_lista=mysqli_query($conexion, $query);

      if(mysqli_num_rows($ultima_lista) === 1):
         foreach($ultima_lista as $lista):
            $cont=$lista['lista']+1;

         endforeach;

      endif;
      mysqli_free_result($ultima_lista);


      $query="INSERT INTO listas (lista, producto_id)VALUES ";

      foreach($aProd as $prod):

         $query.="($cont, $prod),";

      endforeach;

      $query = substr($query, 0, -1);
      $query.=";";
      $rta=mysqli_query($conexion, $query);


      return Mostrar_datos('listas');
   }


   function Agregar_fav($aFav){
      global $conexion;

      foreach($aFav as $fav):
         

         $fav=json_decode($fav);
         $query="UPDATE productos SET selected=true WHERE id=$fav;";

         $rta=mysqli_query($conexion, $query);

         $query="INSERT INTO favoritos (producto_id) VALUES ($fav);";

         $rta=mysqli_query($conexion, $query);
         

      endforeach;

      return Mostrar_datos('favs');
   }


   function Borrar_fav($aFav){
      global $conexion;

      foreach($aFav as $fav):

         $query="UPDATE productos SET selected=false WHERE id=$fav;";

         $rta=mysqli_query($conexion, $query);

         $query="DELETE FROM favoritos WHERE producto_id=$fav;";

         $rta=mysqli_query($conexion, $query);
         
      endforeach;

      return Mostrar_datos('favs');
   }


   function Borrar_lista($aLista){
      global $conexion;

      foreach($aLista as $lista):
         $query="DELETE FROM listas WHERE lista=$lista;";

         $rta=mysqli_query($conexion, $query);

      endforeach;

      return Mostrar_datos('listas');
   }