
var map = L.map('mapid',{ maxZoom: 17 }).on('load', onMapLoad).setView([41.400, 2.206], 9);

//map.locate({setView: true, maxZoom: 17});
// map = L.map('map', {
// 	center: [7.2, 40.9],
// 	zoom: 2,
// 	maxZoom: 20
//   });

var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

//en el clusters almaceno todos los markers
let markers = L.markerClusterGroup();
let data_markers = [];

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
	 	dataType: 'json',
	 	success: function(data_markers){
	 //}).done(function(data_markers) {  
		// kindsFood filter from data (data_markers)
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

$('#kind_food_selector').on('change', function() {
	console.log(this.value);
	render_to_map(data_markers, this.value);
});

// $('#kind_food_selector').on('change', function() {
// 	console.log(`selector value changed to "${this.value}"`);
// 	let selector = this.value;
// 	$.ajax({
// 		type: 'GET',
// 	 	url: 'http://192.168.64.2/mapa/api/apiRestaurants.php',
// 	 	// data: data_markers,
// 	 	dataType: 'json',
// 	 	success: function(data_markers){
// 			render_to_map(data_markers, selector);
// 		}
// 	});
// });

function render_to_map(data_markers,filter){
	 console.log('entrada en render_to_map' );
	//FASE 3.2
	// 1) Limpio todos los marcadores
	map.removeLayer(markers);
	console.log('removed markers from map');
	// 2) Realizo un bucle para decidir que marcadores cumplen el filtro, y los agregamos al mapa
	for (i = 0; i < data_markers.length; i++){
		console.log(`looping data_makers; lap ${i+1}`);
		for (j = 0; j < data_markers[i].kindFood.length; j++){
			if(data_markers[i].kindFood[j] == filter){
				console.log(`in if data_markers[i].kindFood[j] == filter ${i+1}`);
				markers.addLayer(L.marker([data_markers[i].lat, data_markers[i].lng])
				.bindPopup(`${data_markers[i].name}<br>${data_markers[i].address}<br>${data_markers[i].kindFood.toString()}`)
				.openPopup());
				console.log(`marker added cause kindFood == filter ${i+1}`);
			}
		}
		if (filter == 'all'){
			markers.addLayer(L.marker([data_markers[i].lat, data_markers[i].lng])
			.bindPopup(`${data_markers[i].name}<br>${data_markers[i].address}<br>${data_markers[i].kindFood}`)
			.openPopup());
			console.log('marker added cause filter == all');
		}
	}
	map.addLayer(markers);
	console.log('markers layer added');
	map.setView([41.3869685, 2.1699427], 9);
	console.log('map.setView OK');
}
