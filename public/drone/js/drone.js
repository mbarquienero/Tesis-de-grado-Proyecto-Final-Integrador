var myApp = angular.module('myApp', []);
myApp.controller('Controller', ['$scope', function ($scope) {
      // COMANDOS DRONE
      const DESPEGAR           = 'despegar',
            ATERRIZAR          = 'aterrizar',
            DETENER            = 'detener',
            ARRIBA             = 'arriba',
            ABAJO              = 'abajo',
            ADELANTE           = 'adelante',
            ATRAS              = 'atras',
            IZQUIERDA          = 'izquierda',
            DERECHA            = 'derecha',
            ROTAR_DERECHA      = 'rotar derecha',
            ROTAR_IZQUIERDA    = 'rotar izquierda',
            CAMARA             = 'camara',
            // VISION ARTIFICIAL
            ACTIVADO           = 'ACTIVADO'
            TOTAL              = 'total',
            SEGUIMIENTO_OBJETO = 'seguimientoObjeto';

      // límite máximo vertical de la pantalla derecha
      const yMinVideo = 213,
      // límite máximo vertical de la pantalla izquierda
            yMaxVideo = 426;
      // límite máximo horizontal de la pantalla
      const xMaxVideo = 240,
      // límite mínimo horizontal de la pantalla
            xMinVideo = 120;
 
 	  const videoCamara  = obtenerVideoCamara(),
          socket       = io.connect('http://localhost:5556');
    var canvas         = setAtributosVideoCamara(),
        comando        = [], // Array de comandos que se van enviando
        ctx1           = canvas.getContext('2d'),
        mitadPantalla  = videoCamara.width/2,
        anguloDeGiro   = 0,
        anguloAnterior = 0;

        socket.on("navdata", function(navdata) {

          if(navdata != null && navdata.demo != null) {
            
            $scope.batteria = navdata.demo.batteryPercentage;
            $scope.altitude = navdata.demo.altitudeMeters;
            $('#altitud').attr('value', navdata.demo.altitude);
            $('#batteria').attr('value', navdata.demo.batteryPercentage);

          }
        });

        $scope.batteria;
        $scope.altitud;

      localStorage.clear();
      objectDetector.load('/model_web').then(model => deteccionObjeto(model))

      const deteccionObjeto = async models => {
        const prediction = await models.detect(videoCamara);
        dibujarCajaDelimitadora(prediction);
        requestAnimationFrame(() => {
          deteccionObjeto(models);
        })
      }

      const dibujarCajaDelimitadora = predictions => {

        var deteccionPorVozActivada = localStorage.getItem("deteccionPorVoz");

        if ( deteccionPorVozActivada == ACTIVADO ) {
          // defino un canvas ctx
          const ctx = canvas.getContext('2d');
          // limpio el canvas
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx1.clearRect(0, 0, ctx1.canvas.width, ctx1.canvas.height);
          // Font options.
          const font = '16px sans-serif';
          ctx.font = font;
          ctx.textBaseline = 'top';
          ctx.drawImage(child,0,0,300,300);

          var objeto = localStorage.getItem("objeto");

          if (objeto == TOTAL) {

          predictions.forEach(prediction => {
              // Cajas delimitadoras coordenadas y tamanos
              const x = prediction.bbox[0];
              const y = prediction.bbox[1];
              const width = prediction.bbox[2];
              const height = prediction.bbox[3];
              const label = `${prediction.class}: ${prediction.score.toFixed(2)}`;
              // Dibujar caja delimitadora.
              ctx.strokeStyle = '#01DF01';
              ctx.lineWidth = 5;
              ctx.strokeRect(x, y, width, height);
              // dibujar la etiqueta fondo.
              ctx.fillStyle = '#01DF01';
              const textWidth = ctx.measureText(label).width;
              const textHeight = parseInt(font, 10); // base 10
              ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
              
              var xCenter = obtenerCoordCentroX(x, width);
              var yCenter = obtenerCoordCentroY(y, height);

              dibujarCentroCajaDelimitadora(xCenter, yCenter);
        });

          // Objetivo encontrado, se procede a localizarlo en la imagen
          predictions.forEach(prediction => {
              const x = prediction.bbox[0];
              const y = prediction.bbox[1];
              const label = `${prediction.class}: ${prediction.score.toFixed(2)}`;
              // Draw the text last to ensure it's on top.
              ctx.fillStyle = '#000000';
              ctx.fillText(label, x, y);
          });

        } else {

           predictions.forEach(prediction => {
            // Bounding boxes's coordinates and sizes
            var mision = localStorage.getItem("mision");

            if (prediction.class == objeto) {

              const x = prediction.bbox[0];
              const y = prediction.bbox[1];
              const width = prediction.bbox[2];
              const height = prediction.bbox[3];
              const label = `${prediction.class}: ${prediction.score.toFixed(2)}`;
              // Draw the bounding box.
              ctx.strokeStyle = '#01DF01';
              ctx.lineWidth = 5;
              ctx.strokeRect(x, y, width, height);

              // Draw the label background.
              ctx.fillStyle = '#01DF01';
              const textWidth = ctx.measureText(label).width;
              const textHeight = parseInt(font, 10); // base 10
              ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
              
              var xCenter = obtenerCoordCentroX(x, width);
              var yCenter = obtenerCoordCentroY(y, height);

              dibujarCentroCajaDelimitadora(xCenter, yCenter);

              if (mision == SEGUIMIENTO_OBJETO) {

                if (xCenter < mitadPantalla) { // si el objeto detectado esta a la izquierda de la pantalla

                  anguloDeGiro = calcularAnguloGiroIzquierdo(xCenter);

                  if (anguloDeGiro != 0) {
                    enviarComando(ROTAR_IZQUIERDA, anguloDeGiro);
                  }
                } else if (xCenter > mitadPantalla) {

                          anguloDeGiro = calcularAnguloGiroDerecho(xCenter);
                          
                          if (anguloDeGiro != 0) {
                            enviarComando(ROTAR_DERECHA,anguloDeGiro);
                          }
                       }
              }
          }
        });

          // Objetivo encontrado, se procede a localizarlo en la imagen
          predictions.forEach(prediction => {
            if (prediction.class == objeto) {
            const x = prediction.bbox[0];
            const y = prediction.bbox[1];
            const label = `${prediction.class}: ${prediction.score.toFixed(2)}`;
            // Draw the text last to ensure it's on top.
            ctx.fillStyle = '#000000';
            ctx.fillText(label, x, y);
            }
          })
        }
      }
      else {
          if ( (typeof(ctx) !== "undefined" && ctx !== null) && (typeof(ctx1) !== "undefined" && ctx1 !== null) ) {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx1.clearRect(0, 0, ctx1.canvas.width, ctx1.canvas.height);
        }
      }
    }

      function setAtributosVideoCamara() {
        var div2 = document.createElement( "div" );

        div2.setAttribute( "id", "innerContainer" ); 

        document.getElementById("placeholder").appendChild(div2);

        var canvas = document.createElement( "canvas" );

        canvas.setAttribute( "id", "canvasID" );
        canvas.setAttribute( "width", "640" );
        canvas.setAttribute( "height", "360" );
        
        document.getElementById("innerContainer").appendChild(canvas);

        return canvas;
      }

    function obtenerVideoCamara() {
       new NodecopterStream( document.getElementById("placeholder") );
       document.getElementById("placeholder").style.backgroundColor = "transparent";
       const elementDroneID = document.getElementById( "placeholder" );
	   var video;
	   
       for( i = 0; i < elementDroneID.childNodes.length; i++ )
        {
          video = elementDroneID.childNodes[i];
          if ( video.nodeName == 'CANVAS' ) {
            // drone video stream
            video.id = "videoDroneID";
            video.style.backgroundColor= 'transparent';
            video.style.opacity= 1;
          }
        }

        return video;
    }

    function obtenerCoordCentroX(coord, atribImg) {
      return  coordCenter = Math.round(coord + (atribImg/2)); // centro x del objeto detectado
    }

    // dibuja una X en centro del objecto detectado
    function dibujarCentroCajaDelimitadora(detctX, detctY) {
        ctx1.beginPath();
        ctx1.moveTo(0, detctY);
        ctx1.lineTo(640, detctY);
        ctx1.moveTo(detctX, 0);
        ctx1.lineTo(detctX, 360);
        ctx1.strokeStyle = "black";
        ctx1.stroke();
        ctx1.closePath();
    }

    function calcularAnguloGiroIzquierdo(xCenter) {
        var angulo;

        switch(true) {

        case (xCenter <= 80): angulo = 55; break;
        case (xCenter >= 90 && xCenter <= 119): angulo = 45; break;
        case (xCenter >= 120 && xCenter <= 149): angulo = 35; break;
        case (xCenter >= 150 && xCenter <= 179): angulo = 25; break;
        case (xCenter >= 180 && xCenter <= 209): angulo = 20; break;
        case (xCenter >= 210 && xCenter <= 239): angulo = 15; break;
        case (xCenter >= 240 && xCenter <= 269): angulo = 10; break;
        case (xCenter >= 270 && xCenter <= 309): angulo = 5 ; break;
        default: angulo = 0; 
      }

      return angulo;
    }

    function calcularAnguloGiroDerecho(xCenter) {
        var angulo;

        switch(true) {
  
        case (xCenter >= 560): angulo = 55; break;
        case (xCenter >= 540 && xCenter <= 559): angulo = 45; break;
        case (xCenter >= 510 && xCenter <= 539): angulo = 35; break;
        case (xCenter >= 480 && xCenter <= 509): angulo = 25; break;
        case (xCenter >= 450 && xCenter <= 479): angulo = 20; break;
        case (xCenter >= 420 && xCenter <= 449): angulo = 15; break;
        case (xCenter >= 390 && xCenter <= 419): angulo = 10; break;
        case (xCenter >= 360 && xCenter <= 389): angulo = 5; break;
        default: angulo = 0; 
      }

      return angulo;
    }

    function obtenerCoordCentroY(coord, atribImg) {
      return  coordCenter = Math.round(coord + (atribImg/2)); // centro x del objeto detectado
    }

    function enviarComando(orden, valor) {
    	if (orden != null) {
	      comando = (valor != null) ? [orden,valor] : [orden];

      if ( (orden == "rotar izquierda" || orden == "rotar derecha")
          &&  valor != anguloAnterior ) {
        anguloAnterior = valor;

        var text = document.getElementById("comando");
        text.value = orden.toUpperCase() + " °" + valor;
        text.style.fontWeight = "bold";
        text.style.color = "GREEN";
	      socket.emit('comando', comando);
      }
     }
    }

    $scope.aterrizar = function() {
      comando.length = 0;
      enviarComando(ATERRIZAR);
    }

    $scope.despegar = function() {
      comando.length = 0;
      enviarComando(DESPEGAR);
    }

    $scope.camara = function() {
    	comando.length = 0;
      enviarComando(CAMARA);
    }
}]);