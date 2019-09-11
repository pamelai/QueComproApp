var app=angular.module('QueCompro', ['ngRoute', 'mobile-angular-ui', 'angularUUID2']);

app.config(function($routeProvider){
    $routeProvider
        .when('/',{
            controller:'Listas',
            templateUrl:'secciones/listas.html'
        }).when('/productos',{
            controller:'Productos',
            templateUrl:'secciones/productos.html'
        }).when('/favoritos',{
            controller:'Favs',
            templateUrl:'secciones/favoritos.html'
        }).when('/info',{
            controller:'Info',
            templateUrl:'secciones/info.html'
        }). otherwise({
            redirectTo:'/'
        });

})


.controller('MainController', function($rootScope){
   $rootScope.$on('$routeChangeStart', function() {
      $rootScope.loading = true;
    });
  
    $rootScope.$on('$routeChangeSuccess', function() {
      $rootScope.loading = false;
    });

    $rootScope.PasarItem=function(item){
       $rootScope.item=item;
    }
})


.controller('Productos', function($scope, $http, $location, uuid2){
   $scope.getId = function(){
		$scope.id = uuid2.newuuid(); 
		return $scope.id;
	}

   function ManipularData(){

      /* GUARDAR LISTA */
      $scope.CrearLista=function(){
         if(!localStorage.listas){
            $scope.array_listas=[];
   
         }else{
            $scope.array_listas=JSON.parse(localStorage.listas);
   
         }
         
         if(!localStorage.pendientes){
            $scope.array_listas_id=[];
   
         }else{
            $scope.array_listas_id=JSON.parse(localStorage.pendientes);
   
         }

         $scope.lista_id=[];
         $scope.lista=[];
         $scope.falsoid=$scope.getId();
         for(var i=0; i<$scope.aProductos.length; i++){
         
            if($scope.aProductos[i].estado === true){
               $scope.lista.push($scope.prod={
                  nombre:$scope.aProductos[i].nombre,
                  falsoid: $scope.falsoid
               })
               $scope.lista_id.push($scope.prod={
                  id:$scope.aProductos[i].id,
                  falsoid: $scope.falsoid
               });
            }
         } 

         if($scope.lista.length>0){
            $scope.array_listas.unshift($scope.lista);
            $scope.array_listas_id.unshift($scope.lista_id);

         }else{ 
            return $scope.no_lista='Por favor, seleccione uno o más productos.'

         }

         $http({
            method: 'POST',
            url: 'http://quecompro.atwebpages.com/instrucciones/crear_lista.php',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data: $scope.array_listas_id
         }).then(function ok(rta){
                  localStorage.setItem('listas', JSON.stringify(rta.data));
                  $location.path('/listas');

            }, function error(){
                  localStorage.setItem('listas', JSON.stringify($scope.array_listas));
                  localStorage.setItem('pendientes', JSON.stringify($scope.array_listas_id));
                  $location.path('/listas');
            }
         );
      }; 

      /* GUARDAR FAVORITO*/
      $scope.Favorito=function(p){


         if(!localStorage.favs){
            $scope.aFavs=[];

         }else{
            $scope.aFavs=JSON.parse(localStorage.favs);

         }

         if(!localStorage.pendientesFavs){
            $scope.aPendiendiesFavs=[];

         }else{
            $scope.aPendiendiesFavs=JSON.parse(localStorage.pendientesFavs);
         }
         
         $scope.nuevo_fav={
            id:p.id,
            nombre:p.nombre,
            img:p.img,
            selected:true
         }

         localStorage.setItem('productos', JSON.stringify($scope.aProductos));


         $scope.falsoidFavs=$scope.getId();
         for(var i=0; i<$scope.aProductos.length; i++){
            
            if($scope.aProductos[i].id===p.id && $scope.aProductos[i].selected === true){
               
               $scope.aFavs.push($scope.fav={
                  id:$scope.aProductos[i].id,
                  nombre:$scope.aProductos[i].nombre,
                  img:$scope.aProductos[i].img,
                  falsoid:$scope.falsoidFavs
               });

               $scope.aPendiendiesFavs.push($scope.fav={
                  id:$scope.aProductos[i].id,
                  falsoid:$scope.falsoidFavs
               })

            }

            if($scope.aProductos[i].id===p.id && $scope.aProductos[i].selected === false){
               $scope.fav_prod=$scope.aProductos[i].id;

            }
         }

         if(localStorage.borrarFav){
            $scope.borrarFav=JSON.parse(localStorage.borrarFav);

            if($scope.borrarFav.indexOf(p.id) >= 0){
               $scope.borrarFav.splice($scope.borrarFav.indexOf(p.id), 1);
               localStorage.setItem('borrarFav', JSON.stringify($scope.borrarFav));
               
            }
         }

         if($scope.fav_prod){
            for(var i=0; i<$scope.aFavs.length; i++){
               $scope.index = $scope.aFavs.map(function(p) { return p.id; }).indexOf($scope.fav_prod);
               
            }

            $scope.fav=$scope.aFavs.splice($scope.index, 1);

            if(!localStorage.borrarFav){
               $scope.borrarFav=[];

            }else{
               $scope.borrarFav=JSON.parse(localStorage.borrarFav);

            }

            if(localStorage.pendientesFavs && $scope.fav[0]['falsoid'] != undefined){
               $scope.pendientesFavs=angular.fromJson(localStorage.pendientesFavs);

               for(var i=0; i<$scope.pendientesFavs.length; i++){

                  if($scope.pendientesFavs[i].falsoid.indexOf($scope.fav[0]['falsoid']) >= 0){

                     $scope.id=$scope.pendientesFavs[i].falsoid.indexOf($scope.fav[0]['falsoid']);
                  }

               }

               $scope.pendientesFavs.splice($scope.id, 1);
               localStorage.setItem('pendientesFavs', JSON.stringify($scope.pendientesFavs));

            }else{
            
               $scope.borrarFav.push($scope.fav[0]['id']);
            
            }

            $http({
               method: 'POST',
               url: 'http://quecompro.atwebpages.com/instrucciones/borrar_favs.php',
               headers:{'Content-Type': 'application/x-www-form-urlencoded'},
               data: $scope.borrarFav
            }).then(function ok(rta){
                     localStorage.setItem('favs', JSON.stringify(rta.data));
                     localStorage.removeItem('borrarFav');

               },function error(){
                     localStorage.setItem('favs', JSON.stringify($scope.aFavs));
                     localStorage.setItem('borrarFav', JSON.stringify($scope.borrarFav));
               }
            );
            
            $scope.fav_prod=false;
         }else{
            $http({
               method: 'POST',
               url: 'http://quecompro.atwebpages.com/instrucciones/editar_favs.php',
               headers:{'Content-Type': 'application/x-www-form-urlencoded'},
               data: $scope.aFavs
            }).then(function ok(rta){
                     localStorage.setItem('favs', JSON.stringify(rta.data));

               }, function error(){
                     localStorage.setItem('favs', JSON.stringify($scope.aFavs));
                     localStorage.setItem('pendientesFavs', JSON.stringify($scope.aPendiendiesFavs));

               }
            );
         }
      }
   };

   /* LISTADO PRODUCTOS */
   if(localStorage.productos){
      $scope.productos=JSON.parse(localStorage.productos);
      $scope.aProductos = $scope.productos;
      ManipularData();

   }else{
      $http({
         method: 'POST',
         url: 'http://quecompro.atwebpages.com/instrucciones/pedir_listados.php',
         headers:{'Content-Type': 'application/x-www-form-urlencoded'},
         data: 'productos'
         
      }).then(function ok(rta){
            $scope.aProductos = rta.data;
            localStorage.setItem('productos',JSON.stringify($scope.aProductos));
            ManipularData();
            $scope.vacio='';
   
         }, function error(){
            if (localStorage.productos != 'undefined' && localStorage.productos != null){
               $scope.aProductos = JSON.parse(localStorage.productos);
               ManipularData();
   
            }else{
               $scope.vacio ='No pudieron ser cargados lo datos, intente nuevamente más tarde';
               
            }
         }
      );
   }
   
})
  

.controller('Listas', function($scope, $http, SharedState, $route){
   SharedState.initialize($scope, "confirm_lista");

   $scope.reloadRoute = function() {
      $route.reload();
   };

   function ManipularListas(){
      if($scope.aListas.length!==0){
         $scope.vacio='';
      }else{
         $scope.vacio='No tienes ninguna lista guardada';
      }
      
      /* BORRAR LISTA */
      $scope.Borrar=function(lista){

         $scope.lista=$scope.aListas.splice($scope.aListas.indexOf(lista), 1);

         if($scope.aListas.length==0){
            $scope.vacio='No tienes ninguna lista guardada';

         }

         if(!localStorage.borrados)
            $scope.borrar=[];

         else{
            $scope.borrar=JSON.parse(localStorage.borrados);
         }

         if(localStorage.pendientes && $scope.lista[0][0]['falsoid'] != undefined){
            $scope.pendientes=angular.fromJson(localStorage.pendientes);

            for(var i=0; i<$scope.pendientes.length; i++){
               
               for(var j=0; j<$scope.pendientes[i].length; j++){

                  if($scope.pendientes[i][j].falsoid.indexOf($scope.lista[0][0]['falsoid']) >= 0){

                     $scope.id=$scope.pendientes[i][j].falsoid.indexOf($scope.lista[0][0]['falsoid']);
                  }

               }

            }

            $scope.pendientes.splice($scope.id, 1);
            localStorage.setItem('pendientes', JSON.stringify($scope.pendientes));

         }else{
         
            $scope.borrar.push($scope.lista[0][0]['lista']);
         
         }
         
         $http({
            method: 'POST',
            url: 'http://quecompro.atwebpages.com/instrucciones/borrar_lista.php',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data: $scope.borrar
         }).then(function ok(){
                  localStorage.setItem('listas', JSON.stringify($scope.aListas));
                  localStorage.removeItem('borrados');

            },function error(){
               localStorage.setItem('listas', JSON.stringify($scope.aListas));
               
               localStorage.setItem('borrados', JSON.stringify($scope.borrar));

            }
            
         );       
      };
   };

   /*ACTUALIZACION DB*/
   if(localStorage.pendientes || localStorage.borrados){

      if(localStorage.pendientes){
         $scope.array_listas_id=JSON.parse(localStorage.pendientes);

         $http({
            method: 'POST',
            url: 'http://quecompro.atwebpages.com/instrucciones/crear_lista.php',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data: $scope.array_listas_id
         }).then(function ok(rta){
                  localStorage.setItem('listas', JSON.stringify(rta.data));
                  localStorage.removeItem('pendientes');
                  $scope.aListas = rta.data;
                  ManipularListas();

                  if($scope.aListas.length!==0){
                     $scope.vacio='';
                  }else{
                     $scope.vacio='No tienes ninguna lista guardada';
                  }

            }, function error(){
               if (localStorage.listas != 'undefined' && localStorage.listas != null){
                  $scope.aListas = angular.fromJson(localStorage.listas);
                  ManipularListas();

                  if($scope.aListas.length!==0){
                     $scope.vacio='';
                  }else{
                     $scope.vacio='No tienes ninguna lista guardada';
                  }
   
               }else{
                  $scope.vacio ='No pudieron ser cargados lo datos, intente nuevamente más tarde';
                  
               }

            }
         );
      }

      if(localStorage.borrados){
         $scope.borrar=JSON.parse(localStorage.borrados); 

         $http({
            method: 'POST',
            url: 'http://quecompro.atwebpages.com/instrucciones/borrar_lista.php',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data: $scope.borrar
         }).then(function ok(rta){
                  localStorage.setItem('listas', JSON.stringify(rta.data));
                  localStorage.removeItem('pendientes');
                  $scope.aListas = rta.data;
                  ManipularListas();
                  localStorage.removeItem('borrados');

                  if($scope.aListas.length!==0){
                     $scope.vacio='';
                  }else{
                     $scope.vacio='No tienes ninguna lista guardada';
                  }

            },function error(){
               if (localStorage.listas != 'undefined' && localStorage.listas != null){
                  $scope.aListas = angular.fromJson(localStorage.listas);
                  localStorage.setItem('borrados', JSON.stringify($scope.borrar));
                  ManipularListas();

                  if($scope.aListas.length!==0){
                     $scope.vacio='';
                  }else{
                     $scope.vacio='No tienes ninguna lista guardada';
                  }
   
               }else{
                  $scope.vacio ='No pudieron ser cargados lo datos, intente nuevamente más tarde';
                  
               }
            }
         );
      }
      
   }else{
      /* GET LISTAS */
      $http({
         method: 'POST',
         url: 'http://quecompro.atwebpages.com/instrucciones/pedir_listados.php',
         headers:{'Content-Type': 'application/x-www-form-urlencoded'},
         data: 'listas'

      }).then(function ok(rta) {
               localStorage.setItem('listas', angular.toJson(rta.data));
               $scope.aListas = rta.data;
               ManipularListas();

               if($scope.aListas.length!==0){
                  $scope.vacio='';
               }else{
                  $scope.vacio='No tienes ninguna lista guardada';
               }

         },function error() {
            if (localStorage.listas != 'undefined' && localStorage.listas != null){
               $scope.aListas = angular.fromJson(localStorage.listas);
               ManipularListas();

               if($scope.aListas.length!==0){
                  $scope.vacio='';
               }else{
                  $scope.vacio='No tienes ninguna lista guardada';
               }

            }else{
               $scope.vacio ='No pudieron ser cargados lo datos, intente nuevamente más tarde';
               
            }
         }
      );
   }
})


.controller('Favs', function($scope, $http, SharedState){
   SharedState.initialize($scope, "confirm_fav");

   function ManipularFavs(){
      if($scope.aFavs.length!==0){
         $scope.vacio='';
      }else{
         $scope.vacio='No tienes ningún favorito';
      }
     
      $scope.BorrarFav=function(fav){
         $scope.fav=$scope.aFavs.splice($scope.aFavs.indexOf(fav), 1);

         if($scope.aFavs.length==0){
            $scope.vacio='No tienes ningún favorito';

         }
         
         if(!localStorage.borrarFav){
            $scope.borrarFav=[];

         }else{
            $scope.borrarFav=JSON.parse(localStorage.borrarFav);

            if($scope.borrarFav.indexOf(p.id) >= 0){
               $scope.borrarFav.splice($scope.borrarFav.indexOf(p.id), 1);
               localStorage.setItem('borrarFav', JSON.stringify($scope.borrarFav));
               
            }
         }

         if(localStorage.pendientesFavs && $scope.fav[0]['falsoid'] != undefined){
            $scope.pendientesFavs=angular.fromJson(localStorage.pendientesFavs);

            for(var i=0; i<$scope.pendientesFavs.length; i++){

               if($scope.pendientesFavs[i].falsoid.indexOf($scope.fav[0]['falsoid']) >= 0){

                  $scope.id=$scope.pendientesFavs[i].falsoid.indexOf($scope.fav[0]['falsoid']);
               }

            }

            $scope.pendientesFavs.splice($scope.id, 1);
            localStorage.setItem('pendientesFavs', JSON.stringify($scope.pendientesFavs));

         }else{
         
            $scope.borrarFav.push($scope.fav[0]['id']);
         
         }
      

         $http({
            method: 'POST',
            url: 'http://quecompro.atwebpages.com/instrucciones/borrar_favs.php',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data: $scope.borrarFav
         }).then(function ok(rta){
                  localStorage.setItem('favs', JSON.stringify(rta.data));
                  localStorage.removeItem('borrarFav');

            },function error(){
                  localStorage.setItem('favs', JSON.stringify($scope.aFavs));
                  localStorage.setItem('borrarFav', JSON.stringify($scope.borrarFav));
            }
         );

         $scope.aProductos = JSON.parse(localStorage.productos);
         $scope.aProductos.map(function(prod){
            if(prod.id == $scope.fav[0]['id']){
               prod.selected = false;
            }

            return prod;
         });

         localStorage.setItem('productos', JSON.stringify($scope.aProductos));
      }
   }

   /*ACTUALIZACION DB*/
   if(localStorage.borrarFav || localStorage.pendientesFavs){
      
      if(localStorage.borrarFav){
         $scope.aFavId=JSON.parse(localStorage.borrarFav);

         $http({
            method: 'POST',
            url: 'http://quecompro.atwebpages.com/instrucciones/borrar_favs.php',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data: $scope.aFavId
         }).then(function ok(rta){
                  localStorage.setItem('favs', JSON.stringify(rta.data));
                  localStorage.removeItem('pendientesFavs');
                  $scope.aFavs = rta.data;
                  ManipularFavs();
                  localStorage.removeItem('borrarFav');

                  if($scope.aFavs.length==0){
                     $scope.vacio='No tienes ningún favorito';

                  }else{
                     $scope.vacio='';
                  }

            },function error(){
               if (localStorage.favs != 'undefined' && localStorage.favs != null){
                  $scope.aFavs = JSON.parse(localStorage.favs);
                  localStorage.setItem('borrarFav', JSON.stringify($scope.aFavId));
                  ManipularFavs();

                  if($scope.aFavs.length==0){
                     $scope.vacio='No tienes ningún favorito';

                  }else{
                     $scope.vacio='';
                  }
      
               }else{
                  $scope.vacio ='No pudieron ser cargados lo datos, intente nuevamente más tarde';
                  
               }
            }
         );
      }

      if(localStorage.pendientesFavs){
         $scope.favs=JSON.parse(localStorage.pendientesFavs);

         $http({
            method: 'POST',
            url: 'http://quecompro.atwebpages.com/instrucciones/editar_favs.php',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data: $scope.favs
         }).then(function ok(rta){
               localStorage.setItem('favs',JSON.stringify(rta.data));
               localStorage.removeItem('pendientesFavs');
               $scope.aFavs = rta.data;
               ManipularFavs();
               
               
               if($scope.aFavs.length==0){
                  $scope.vacio='No tienes ningún favorito';

               }else{
                  $scope.vacio='';
               }
            

            }, function error(){
               if (localStorage.favs != 'undefined' && localStorage.favs != null){
                  $scope.aFavs = JSON.parse(localStorage.favs);
                  ManipularFavs();
                  
                  if($scope.aFavs.length==0){
                     $scope.vacio='No tienes ningún favorito';

                  }else{
                     $scope.vacio='';
                  }

               }else{
                  $scope.vacio ='No pudieron ser cargados lo datos, intente nuevamente más tarde';
                  
               }
            }
         );
      }
   }else{
      /* GET FAVORITOS */
      $http({
         method: 'POST',
         url: 'http://quecompro.atwebpages.com/instrucciones/pedir_listados.php',
         headers:{'Content-Type': 'application/x-www-form-urlencoded'},
         data: 'favs'
      }).then(function ok(rta){
            localStorage.setItem('favs',JSON.stringify(rta.data));
            $scope.aFavs = rta.data;
            ManipularFavs();
            
            if($scope.aFavs.length==0){
               $scope.vacio='No tienes ningún favorito';

            }else{
               $scope.vacio='';
            }
            

         }, function error(){
            if (localStorage.favs != 'undefined' && localStorage.favs != null){
               $scope.aFavs = JSON.parse(localStorage.favs);
               ManipularFavs();
               
               if($scope.aFavs.length==0){
                  $scope.vacio='No tienes ningún favorito';

               }else{
                  $scope.vacio='';
               }

            }else{
               $scope.vacio ='No pudieron ser cargados lo datos, intente nuevamente más tarde';
               
            }
         }
      );
   }


      
})


.controller('Info', function($scope, SharedState){
   SharedState.initialize($scope, "myAccordion");
   SharedState.toggle('myAccordion');

})