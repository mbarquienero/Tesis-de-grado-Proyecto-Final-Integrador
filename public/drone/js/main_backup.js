
  var socket = io.connect('http://localhost:5556'),
  
  	  comando = [];
  	  var objeto = '',
  	  	  mision = '';
  	  localStorage.clear();
  	  const habilitar = "habilitar rounded-circle",
  	  		deshabilitar = "deshabilitar rounded-circle";

  	  desactivarDeteccion();
  	  deshabilitado();

  	  function activarDeteccion() {
	  	var deteccion = document.getElementById("deteccionPorVoz");
		deteccion.innerText = "ACTIVADO"
		deteccion.style.fontWeight = "bold";
		deteccion.style.backgroundColor = "GREEN";;
		deteccion.style.color = "white";
		deteccion.style.textAlign = 'center';
	  }

	  function desactivarDeteccion() {
	  	var deteccion = document.getElementById("deteccionPorVoz");
		deteccion.innerText = "DESACTIVADO"
		deteccion.style.fontWeight = "bold";
		deteccion.style.backgroundColor = "RED";;
		deteccion.style.color = "white";
		deteccion.style.textAlign = 'center';
	  }

  	  function habilitarPesona() {
		 document.getElementById("persona").className = habilitar;
		 document.getElementById("tv").className = deshabilitar;
		 document.getElementById("celular").className = deshabilitar;
		 document.getElementById("botella").className = deshabilitar;
		 document.getElementById("total").className = deshabilitar;
  	  }

  	  function habilitarTelevisor() {
  	  	 document.getElementById("tv").className = habilitar;
		 document.getElementById("persona").className = deshabilitar;
		 document.getElementById("celular").className = deshabilitar;
		 document.getElementById("botella").className = deshabilitar;
		 document.getElementById("total").className = deshabilitar;
  	  }

  	  function habilitarCelular() {
  	  	document.getElementById("celular").className = habilitar;
		 document.getElementById("persona").className = deshabilitar;
		 document.getElementById("tv").className = deshabilitar;
		 document.getElementById("botella").className = deshabilitar;
		 document.getElementById("total").className = deshabilitar;
  	  }

  	  function habilitarBotella() {
		 document.getElementById("botella").className = habilitar;
		 document.getElementById("persona").className = deshabilitar;
		 document.getElementById("tv").className = deshabilitar;
		 document.getElementById("celular").className = deshabilitar;
		 document.getElementById("total").className = deshabilitar;
  	  }

  	  function habilitarTotal() {
		 document.getElementById("botella").className = habilitar;
		 document.getElementById("persona").className = habilitar;
		 document.getElementById("tv").className = habilitar;
		 document.getElementById("celular").className = habilitar;
		 document.getElementById("total").className = habilitar;
  	  }

  	 function deshabilitado() {
		 document.getElementById("botella").className = deshabilitar;
		 document.getElementById("persona").className = deshabilitar;
		 document.getElementById("tv").className = deshabilitar;
		 document.getElementById("celular").className = deshabilitar;
		 document.getElementById("total").className = deshabilitar;
  	  }

  	  function isDeteccionPorVozActivado() {
  	  	return Boolean(localStorage.getItem("deteccionPorVoz") == "ACTIVADO");
  	  }

	if (annyang)
	{
		var comando = {

			'despegar': function () {
				       comando.length = 0;
       				   comando = ['despegar'];
				socket.emit('comando', comando);
			},

			'aterrizar': function() {
					   comando.length = 0;
       				   comando = ['aterrizar'];
				socket.emit('comando', comando);
			},

			'arriba': function() {
					   comando.length = 0;
       				   comando = ['arriba'];
				socket.emit('comando', comando);
			},

			'abajo': function() {
					   comando.length = 0;
       				   comando = ['abajo'];
				socket.emit('comando', comando);
			},

			'izquierda': function()	{
					   comando.length = 0;
       				   comando = ['izquierda'];
				socket.emit('comando', comando);
			},

			'derecha': function()	{
					   comando.length = 0;
       				   comando = ['derecha'];
				socket.emit('comando', comando);
			},

			'adelante': function()	{
					   comando.length = 0;
       				   comando = ['adelante'];
				socket.emit('comando', comando);
			},

			'atras': function()	{
					   comando.length = 0;
       				   comando = ['atras'];
				socket.emit('comando', comando);
			},

			'atrás': function()	{
					   comando.length = 0;
       				   comando = ['atrás'];
				socket.emit('comando', comando);
			},

			'rotar izquierda': function()	{
				       comando.length = 0;
       				   comando = ['rotar izquierda',45];
				socket.emit('comando', comando);
			},

			'rotar derecha': function()	{
					   comando.length = 0;
       				   comando = ['rotar derecha',45];
				socket.emit('comando', comando);
			},

			'parar': function()	{
					   comando.length = 0;
       				   comando = ['parar'];
				socket.emit('comando', comando);
			},

			'cámara frontal': function () {
				       comando.length = 0;
       				   comando = ['camara frontal'];
				socket.emit('comando', comando);
			},

			'cámara descendente': function () {
				       comando.length = 0;
       				   comando = ['camara descendente'];
				socket.emit('comando', comando);
			},

			/** Detección de objetos **/
			'activar detección': function()	{
				localStorage.setItem("deteccionPorVoz", "ACTIVADO");
				localStorage.setItem("objeto", '');
				activarDeteccion();
			},

			'activar deteccion': function()	{
				localStorage.setItem("deteccionPorVoz", "ACTIVADO");
				localStorage.setItem("objeto", '');
				activarDeteccion();
			},
			
			'desactivar detección': function()	{
				localStorage.setItem("deteccionPorVoz", "DESACTIVADO");
				localStorage.setItem("objeto", '');
				desactivarDeteccion();
				deshabilitado();
			},

			'desactivar deteccion': function()	{
				localStorage.setItem("deteccionPorVoz", "DESACTIVADO");
				localStorage.setItem("objeto", '');
				desactivarDeteccion();
				deshabilitado();
			},

			'persona': function()	{
				 if (isDeteccionPorVozActivado()) {
					 objeto = 'persona';
					 localStorage.setItem("objeto", objeto);
					 habilitarPesona();
				}
			},

			'televisor': function()	{
				if (isDeteccionPorVozActivado()) {
				  objeto = 'televisor';
				  localStorage.setItem("objeto", objeto);
				  habilitarTelevisor();
				}
			},			

			'celular': function()	{
				if (isDeteccionPorVozActivado()) {
				  objeto = 'celular';
				  localStorage.setItem("objeto", objeto);
				  habilitarCelular();
				}
			},

			'botella': function()	{
				if (isDeteccionPorVozActivado()) {
				  objeto = 'botella';
				  localStorage.setItem("objeto", objeto);
				  habilitarBotella();
				}
			},

			'pelota': function()	{
				if (isDeteccionPorVozActivado()) {
				  objeto = 'pelota';
				  localStorage.setItem("objeto", objeto);
				  deshabilitado()
				}
			},

			'barco': function()	{
				if (isDeteccionPorVozActivado()) {
				  objeto = 'barco';
				  localStorage.setItem("objeto", objeto);
				  deshabilitado()
				}
			},

			'detección total': function()	{
				if (isDeteccionPorVozActivado()) {
				  objeto = 'total';
				  localStorage.setItem("objeto", objeto);
				  habilitarTotal();
				}
			},

			'deteccion total': function()	{
				if (isDeteccionPorVozActivado()) {
				  objeto = 'total';
				  localStorage.setItem("objeto", objeto);
				  habilitarTotal();
				}
			},

			'seguimiento de objeto': function()	{
				  mision = 'seguimientoObjeto';
				  localStorage.setItem("mision", mision);
				  localStorage.setItem("deteccionPorVoz", "ACTIVADO");
				  localStorage.setItem("objeto", '');
				  activarDeteccion();
				  comando.length = 0;
       			  comando = ['despegar'];
				  socket.emit('comando', comando);
			},						
		};

		// Se activa el debug
		annyang.debug(true);

		// Agrega los comandos a la libreria
		annyang.addCommands(comando);
		
		annyang.setLanguage('es-ES');

		annyang.addCallback('resultMatch', function(userSaid, commandText, phrases) {
		  var text = document.getElementById("comando");
		  text.value = commandText.toUpperCase();
		  document.getElementById("comando").style.fontWeight = "bold";
		  document.getElementById("comando").style.color = "green";
		  phrases.forEach(phrase => {
		   if (phrase == 'seguimiento de personas' || phrase == 'seguimiento de personal') {
		   	  var text = document.getElementById("comando");
			  text.value = 'seguimiento de persona'.toUpperCase();
			  document.getElementById("comando").style.fontWeight = "bold";
			  document.getElementById("comando").style.color = "green";
		   }
		  });
		});

		annyang.addCallback('resultNoMatch', function(phrases) {
		  var text = document.getElementById("comando");
		  text.value = phrases[0].toUpperCase();
		  document.getElementById("comando").style.fontWeight = "bold";
		  document.getElementById("comando").style.color = "red";
		});

		// Inicia el reconocimiento de voz
		annyang.start({ continuous: false });

		annyang.addCallback('soundstart', function() {
         console.log('sound detected');
       });
	}