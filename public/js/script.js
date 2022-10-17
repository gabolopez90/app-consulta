// Oculta NM y CI hasta ser seleccionadas
$("#cedula").hide()
$("#empleado").hide()
$("#consultar").hide()

// Selecciona tipo de consulta
$("#NM").click(()=>{
	$("#tipo-consulta").text("NM");
	$("#empleado").show()
	$("#consultar").show()
	$("#cedula").hide()
});

$("#NM2").click(()=>{
	$("#elegirnm").text("NM");
});

$("#CI").click(()=>{
	$("#tipo-consulta").text("CI");
	$("#cedula").show()
	$("#consultar").show()
	$("#empleado").hide()
});

// Selecciona nacionalidad
$("#ve").click(()=>{
	$("#dropdownMenuButton").text("V");
});

$("#ex").click(()=>{
	$("#dropdownMenuButton").text("E");
});

// Selecciona simulador
$("#Consumo").click(()=>{
	$("#tipo-simulador").text("Consumo");
});

$("#TDC").click(()=>{
	$("#tipo-simulador").text("TDC");
});

// Barra filtradora
$(document).ready(function(){
  $("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();    
    $("#myTable tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
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