//Declara los modulos utilizados
//Express para manejar las conexiones, body-parser para manejar la data ingresada por el usuario y ejs para la presentacion
//OS obtiene información del equipo del usuario
var express = require("express");
var app = express();
const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var path = require("path");
var os = require('os');
var fs = require("fs");
var sqlite3 = require('sqlite3').verbose();

//Obtiene nm del usuario
var user = os.userInfo().username;

//Usa express para servir el contenido estatico. Define a ejs como el programa para la visualizacion
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use('/assets', express.static(__dirname + '/assets')); // redirect img for build
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/popper.js/dist/umd')); // redirect JS popper
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/css', express.static(__dirname + '/node_modules/font-awesome/css')); // redirect CSS font-awesome
app.use('/fonts', express.static(__dirname +'/node_modules/font-awesome/fonts')) // redirect CSS font-awesome

app.get("/simulador_empleado", (req,res,next)=>{
	res.render("simulador_empleado");
});

// Recibe CI empleado y consulta la BD
app.post("/empleado", urlencodedParser, (req,res,next)=>{		
	var nac = req.body.nac;
	var ci = req.body.ci;	

	//Si la cedula tiene menos de 8 digitos rellena con 0 a la izquierda, para el alfanumerico 9
	if(ci.length<8){
		while(ci.length<8){
			ci = "0"+ci;
		}
	}
	//Une la nacionalidad con la cedula creando una variable alfanumerica 9 para la comparacion
	var cedula = nac + ci;

//Conecta a la base de datos
let db = new sqlite3.Database('A:/Tarjetas_de_Credito/Simuladores/CREDITO_DB.db');

//Query a nomina BdV para traer la información del empleado
let sql = `SELECT *
           FROM NOMINA_BDV
           WHERE CEDULA  = ?`;
	
	const empleado = db.get(sql,cedula,(err,empleado)=>{
		if(err){
			return console.log(err);
		}
		// Si no es empleado, devuelve una pagina de error, si es empleado muestra la informacion
		if(empleado === undefined){
			res.render("no_encontrado", {data: cedula});
		}
		else{
			// Query a tabla ACR para traer el límite actual de TDC
			let sqltdc = `SELECT MONTO_LIQUIDADO
           FROM CONSOLIDADO_ACR
           WHERE PRODUCTO = "TDC" AND CEDULA  = ?`;
  		const tdc = db.get(sqltdc,cedula,(err,tdc)=>{
			if(err){
				return console.log(err);
			}	
				//Agrega información de tdc actual al objeto empleado
				empleado.TDC = tdc.MONTO_LIQUIDADO;
				
				//Si el empleado tiene marca negativa, buscar la descripción
				if(empleado.CONSOLIDADO === 1){

					//Query a acr cliente para traer descripción de marca negativa
					let sqlNegado = `SELECT CONSOLIDADO_DESC
           							FROM CONSOLIDADO_ACR_CLIENTE
           							WHERE CEDULA  = ?`;
					const negado_detalle = db.get(sqlNegado,cedula,(err,negado)=>{
						if(err){
							return console.log(err);
						}
						//Agrega descripcion de marca negativa a objeto empleado
						empleado.DETALLE_NEGADO = negado.CONSOLIDADO_DESC;						
						res.render("empleado", {data: empleado});
					});
				}
				else{
					//Si está aprobado, crea la página
					res.render("empleado", {data: empleado});	
				}
			});
		}
	});
	
	// Cierra la conexión con la BD
	db.close();
});

//Inicia el servidor en el puerto 8080
app.listen(8080);
console.log("listening on port "+ 8080);