//Declara los modulos utilizados
//Express para manejar las conexiones, body-parser para manejar la data ingresada por el usuario y ejs para la presentacion
//OS obtiene información del equipo del usuario, fs maneja archivos en la pc, path para ubicaciones
var express = require("express");
var app = express();
const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var path = require("path");
var os = require('os');
var fs = require("fs");
var sqlite3 = require('sqlite3').verbose();
const escritorio = require("./dir.js")

var direccion = '';

// Revisa si la base de datos esta local o en el servidor
// Para operativos sin conexion a internet
if (fs.existsSync(path.join(escritorio,'/Modulo Contingencia/CREDITO_DB.db'))) {
    direccion = path.join(escritorio,'/Modulo Contingencia/CREDITO_DB.db');     
  }
  else{
  	direccion = '//Serv_p02_27emm/Servidor_GG_Admision/Consumo/Simuladores/CREDITO_DB.db';
  }

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

app.get("/consulta", (req,res,next)=>{
	res.render("consulta");
});

// Recibe CI empleado y consulta la BD
app.post("/consultar", urlencodedParser, (req,res,next)=>{	
	var tipo = req.body.tipo;
	var simulador = req.body.simu;	
	if(tipo == "CI"){
		var nac = req.body.nac;
		var ci = req.body.ci;
		if(ci.length<8){
			while(ci.length<8){
				ci = "0"+ci;
			}
		}
		//Une la nacionalidad con la cedula creando una variable alfanumerica 9 para la comparacion
		var cedula = nac + ci;

	}else{
		var nm = req.body.NM1;
		if(nm.length<5){
			while(nm.length<5){
				nm = "0"+nm;
			}
		}
		var cedula = "NM"+nm;
	}

	let db;
	let sql;

	if(simulador == "Consumo"){		
		db = new sqlite3.Database(direccion);
		if(tipo == "CI"){
			sql = `SELECT *
           FROM ARCHIVO_CREDISOCIAL
           WHERE CEDULA  = ?`;	
		}else{
			sql = `SELECT *
           FROM ARCHIVO_CREDISOCIAL
           WHERE NM  = ?`;
		}


		const empleado = db.all(sql,cedula,(err,rows)=>{
		if(err){
			return console.log(err);
		}
		if(rows[0] === undefined){
			res.render("no_encontrado", {data: cedula});
		}
		else{
			res.render("consumo", {data: rows});
		}
	});

	}else{		
		db = new sqlite3.Database(direccion);
		if(tipo == "CI"){
			sql = `SELECT *
           FROM ARCHIVO_TDC
           WHERE CEDULA  = ?`;	
		}else{
			sql = `SELECT *
           FROM ARCHIVO_TDC
           WHERE NM  = ?`;
		}
		const empleado = db.all(sql,cedula,(err,rows)=>{		
			if(err){
				return console.log(err);
			}			
			if(rows[0] === undefined){
				res.render("no_encontrado", {data: cedula});
			}
			else{			
				res.render("tdc", {data: rows});
			}
		});
	}	
 
	db.close();

});

//Inicia el servidor en el puerto 8080
app.listen(8080);
console.log("listening on port "+ 8080);