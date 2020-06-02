// Exercici-Leaflet-2-Filtres-API 
// https://github.com/fausto-luna/Exercici-Leaflet-2-Filtres-API/blob/master/script.js
var map = L.map('mapid',{ maxZoom: 17 }).on('load', onMapLoad).setView([41.400, 2.206], 9);
var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);
//en el clusters almaceno todos los markers
let markers = L.markerClusterGroup(); // https://github.com/Leaflet/Leaflet.markercluster
let data_markers = [];
// ============================= onMapLoad ============================= //
function onMapLoad() {
	console.log("Mapa cargado");
	//FASE 3.1
	// 1) Relleno el data_markers con una petición a la api
	var kind_food_selector = $('#kind_food_selector');
	console.log('select OK');
	$.ajax({
		type: 'GET',
	 	url: 'http://192.168.64.2/mapa/api/apiRestaurants.php',
	 	// data: data_markers,
	 	// dataType: 'json',
	 	success: function(data){
		// kindsFood filter from data (data_markers)
		data_markers = JSON.parse(data); // converts string to json
		let kindsFood = [];
		for (i = 0; i < data_markers.length; i++){
			// array from string ex. "Bar,Mediterranean,Vegetarian" to kindFood = [Bar, Mediterranean, Vegetarian];
			data_markers[i].kindFood = data_markers[i].kindFood.split(',');
			// getting all kinds of food from each marker from data (data_markers)
			for(j = 0; j < data_markers[i].kindFood.length; j++){
				// duplicated kindFood filter
				let existent = false;
				for (k = 0; k < kindsFood.length; k++){
					if (data_markers[i].kindFood[j] === kindsFood[k]){
						existent = true;
					}
				}
				// push filtered kind of food
				if( existent === false){
					kindsFood.push(data_markers[i].kindFood[j]);
				}
			}
		}
		console.log(kindsFood);
		// 2) adding options to selector
		kind_food_selector.append(`<option value="all">All</option>`);
		for (i = 0; i < kindsFood.length; i++){
			kind_food_selector.append(`<option value="${kindsFood[i]}">${kindsFood[i]}</option>`);
		}
		// 3) Llamo a la función para --> render_to_map(data_markers, 'all'); <-- para mostrar restaurantes en el mapa
		render_to_map(data_markers, 'all' );
		console.log('rendered to map');
		}
	});
}
// ============================= selector on change ============================= //
$('#kind_food_selector').on('change', function() {
	console.log(this.value);
	render_to_map(data_markers, this.value);
});
// ============================= render_to_map ============================= //
function render_to_map(data_markers,filter){
	//FASE 3.2
	// 1) Limpio todos los marcadores
	markers.clearLayers(); // https://github.com/Leaflet/Leaflet.markercluster#bulk-adding-and-removing-markers
	// 2) Realizo un bucle para decidir que marcadores cumplen el filtro, y los agregamos al mapa
	for (i = 0; i < data_markers.length; i++){
		for (j = 0; j < data_markers[i].kindFood.length; j++){
			if(data_markers[i].kindFood[j] == filter || filter == 'all'){
				markers.addLayer(L.marker([data_markers[i].lat, data_markers[i].lng])
				.bindPopup(`${data_markers[i].name}<br>${data_markers[i].address}<br>${data_markers[i].kindFood}`).openPopup());
			}
		}
	}
	map.addLayer(markers);
	map.setView([41.3972911,2.1803389], 13);
}
