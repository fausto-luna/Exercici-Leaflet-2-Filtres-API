var map = L.map('mapid').on('load', onMapLoad).setView([41.400, 2.206], 9);
//map.locate({setView: true, maxZoom: 17});
	
var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	
	}).addTo(map);

//en el clusters almaceno todos los markers
var markers = L.markerClusterGroup();
var data_markers = [];

function onMapLoad() {

    $.ajax({
		type: "POST",
		url: 'http://localhost/mapa/api/apiRestaurants.php',
		dataType: 'json'
	})
	.done(function(data) {
		
		data_markers = data;
		let names_food = [];
		$.each(data_markers, function(index_o) {
			data_markers[index_o].kind_food.split(",").forEach(function (item,index) {
				if(!names_food.includes(item)){
					names_food.push(item);
					if(index_o==0) $("#kind_food_selector").html(new Option('Todos','all'));
					$("#kind_food_selector").append(new Option(item,item));
			
				}
				
			});
		});	

		render_to_map(data_markers,'all');
		
		
	}).fail(function(jqxhr, textStatus, error) {
		var err = textStatus + ', ' + error + ', Envio al server';
		alert(err);

	});

}

$('#kind_food_selector').on('change', function() {
  console.log(data_markers);
  render_to_map(data_markers, this.value);
});



function render_to_map(data_markers,filter){
	
	//limpio el cluster
	markers.clearLayers();

		//bucle de marcadores
	  $.each(data_markers, function(index_o) {

		if(filter=='all' || data_markers[index_o].kind_food.split(",").includes(filter)){
			//creo un marcador
			var marker = L.marker([data_markers[index_o].lat, data_markers[index_o].lng]).bindPopup("<b>"+data_markers[index_o].name+"</b>");
			//se agregan los marcadores
			markers.addLayer(marker);
		}

	  });

	//agrega el MarkerClusterGroup al mapa
	map.addLayer(markers);
			
}

map.on('click', function(e) {
	
	var center = e.latlng;
	//console.log(center);
    //alert("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
	L.marker(center).addTo(map);
    map.setView(center, 17);
	
});

/*
var geocoder = L.Control.geocoder()
.on('markgeocode', function(event) {
    var center = event.geocode.center;
    L.marker(center).addTo(map);
    map.setView(center, map.getZoom());
})
.addTo(map);
*/
