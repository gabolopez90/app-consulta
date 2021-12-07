// Simulador empleados

// El monto aprobado no puede ser mayor al solicitado
var checkSol = parseInt($("#solicitado").text().replace(".",""));
var checkApr = parseInt($("#monto_aprobado_empleado").text().replace(".",""));
if(checkApr > checkSol){
	$("#monto_aprobado_empleado").text(checkSol);
}

// Selecciona nacionalidad
$("#ve").click(()=>{
	$("#dropdownMenuButton").text("V");
});

$("#ex").click(()=>{
	$("#dropdownMenuButton").text("E");
});

// Recalculo para simulador empleados
$("#sobregiro").click(()=>{
	$("#nuevo-pago-min-manual").hide();
	$("#nuevo-pago-min").show();
});

$("#pago_min_manual").click(()=>{
	$("#nuevo-pago-min").hide();
	$("#nuevo-pago-min-manual").show();
});




// Funcion para mostrar la fecha actual en formato dd/mm/yyyy
function dia(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!

	var yyyy = today.getFullYear();
	if(dd<10){
	    dd='0'+dd;
	} 
	if(mm<10){
	    mm='0'+mm;
	} 
	var fecha = dd+'/'+mm+'/'+yyyy;
	return fecha;
}