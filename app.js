
/*
 * SERVIDOR QUE RECIBE ESCUCHA A UN CLIENTE Y EN BASE A LOS 
 * MENSAJES QUE LE ENVIA EL CLIENTE EJECUTA COMANDOS PARA CONTROLAR
 * EL PARROT AR DRONE 2
*/
var express          = require("express"),
	app              = express(), 	//aplicacion express
	server           = require("http").Server(app), //servidor http
	io               = require("socket.io")(server), //servidor websocket
	arDrone          = require("ar-drone"), // api ar-drone
	autonomy         = require("ardrone-autonomy"),
	arDroneConstants = require('ar-drone/lib/constants'),
	fs 				 = require('fs'),
	path 			 = require('path'),
	df 				 = require('dateformat'),
	droneIP 		 = '192.168.1.1',
	client      	 = arDrone.createClient({ip: droneIP}), // creo el cliente (drone)
	ctrl         	 = new autonomy.Controller(client, {debug: false}),
 	repl   		 	 = client.createRepl();
	global.fetch 	 = require('node-fetch');

function navdata_option_mask(c) {
  return 1 << c;
}

// From the SDK.
var navdata_options = (
    navdata_option_mask(arDroneConstants.options.DEMO)
  | navdata_option_mask(arDroneConstants.options.VISION_DETECT)
  | navdata_option_mask(arDroneConstants.options.MAGNETO)
);

// Connect and configure the drone
client.config('general:navdata_demo', true);
client.config('general:navdata_options', navdata_options);
client.config('video:video_channel', 2);
client.config('detect:detect_type', 12);

repl._repl.context['ctrl'] = ctrl;

app.set('port', process.env.PORT || 3000);  //seteo el puerto 3000
app.use(express.static("public"));

require("node-dronestream").listen(server, { ip: droneIP });

// cuando reciba la peticion '/', el servidor redirige a index.html
app.get("/", function (req, res) {
	require("fs").createReadStream(__dirname + "/index.html").pipe(res);
});
 
// Nos ponenemos a escuchar en el puerto 3000 en localhost
server.listen(app.get("port"), function () { 
  console.log("server listening on " + app.get("port")); 
})

io = require('socket.io').listen(5556); // servidor socket escucha en el prueto 3002

var cameraMode = 0;
var anguloAnterior = 0;

io.on("connection", function(socket) // servidor socket a la espera de un cliente que se conecte
{
	console.log(" --=== CLIENTE CONECTADO ===--\n");

	socket.on("comando", function(comando)	{

		 switch(comando[0]) {
    
	        case 'despegar':
	        	  	client.takeoff(); break;
	        case 'aterrizar':
	        		client.land(); break;
	        case 'detener':
	        		ctrl.hover(); break;
	        case 'arriba':
	        		ctrl.up(0.3); break;
	        case 'abajo':
	        		ctrl.down(0.3); break;
	        case 'adelante':
	        		ctrl.forward(0.4); break;
	        case 'atras':
	        		ctrl.backward(0.3); break;
	        case 'atrás':
	        		ctrl.backward(0.3); break;
	        case 'izquierda':
	        	 	ctrl.left(0.5); break;
	        case 'derecha':
	        		ctrl.right(0.5); break;
	        case 'rotar izquierda':
	        		if (comando[1] != anguloAnterior) {
	        		   anguloAnterior = comando[1];
	        		   ctrl.ccw(comando[1]);
	        		}
	        		 break;
	        case 'rotar derecha':
	        		if (comando[1] != anguloAnterior) {
	        		   anguloAnterior = comando[1];
	        		   ctrl.cw(comando[1]);
	        		}
	        		 break;
	        case 'camara frontal':
	        		client.config('video:video_channel', 0);
	        		cameraMode = 3; break;
	        case 'camara descendente':
	        		client.config('video:video_channel', 3);
	        		cameraMode = 0; break;
	       		
	        default: console.log("COMANDO NO VALIDO"); 
    	}
   	  
	});
});

function startNavdataStream(server) {

    var io = require("socket.io").listen(server);
    io.sockets.on("connection", function(socket) {
        droneClient.on("navdata", function(data) {
            socket.emit("navdata", data);
        });
    });
}

module.exports = { startNavdataStream };