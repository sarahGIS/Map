mapboxgl.accessToken =
	"pk.eyJ1Ijoic2FyYTI0MCIsImEiOiJja2lxaDJzdzQwZHYwMzBsM3Rydmx0dmhtIn0.JQiCM00pzHLrDGlXXJATUg";
var map = new mapboxgl.Map({
	container: "map",
	style: "mapbox://styles/sara240/ckif1o9jo46sg19qrxkbo0qpt",
});

map.addControl(
	new MapboxGeocoder({
		accessToken: mapboxgl.accessToken,
		mapboxgl: mapboxgl,
	})
);
var filterGroup = document.getElementById("filter-group");
map.on("load", function () {
	let layers = map.getStyle().layers;
	for (i = 102; i < layers.length; i++) {
		let input = document.createElement("input");
		input.type = "checkbox";
		input.id = layers[i].id;
		input.checked = true;

		input.addEventListener("change", function (e) {
			map.setLayoutProperty(
				input.id,
				"visibility",
				e.target.checked ? "visible" : "none"
			);
		});
		filterGroup.appendChild(input);

		var label = document.createElement("label");
		label.setAttribute("for", layers[i].id);
		label.textContent = layers[i].id;
		filterGroup.appendChild(label);

		var item = document.createElement("div");
		if (layers[i].paint) {
			var key = document.createElement("span");
			key.className = "legend-key";
			key.style.backgroundColor = layers[i].paint["circle-color"];
			item.appendChild(key);
		}
	
		var value = document.createElement("span");
		value.innerHTML = layers[i].id;
		value.style.cursor = "pointer";
		
		item.appendChild(value);
		legend.appendChild(item);

		let layerFeature = map.queryRenderedFeatures({
			layers: [layers[i].id],
		});

		let featureContainer = document.createElement("div");
		featureContainer.setAttribute("class", "feature-container");

		for (let b = 0; b < layerFeature.length; b++) {
			let feature = document.createElement("div");
			feature.setAttribute("class", "feature");
			feature.innerHTML = layerFeature[b].properties.Name;
			feature.addEventListener("click", () => {
				let image, description, date, time, targetAud;
				if (
					layerFeature[b].properties.Image == undefined ||
					layerFeature[b].properties.Image == ""
				) {
					image = "";
				} else {
					image = `<img src=${layerFeature[b].properties.Image} width="200px; height="200px">`;
				}

				if (
					layerFeature[b].properties.Descriptio == undefined ||
					layerFeature[b].properties.Descriptio == ""
				) {
					description = "";
				} else {
					description = `<p>${layerFeature[b].properties.Descriptio}</p>`;
				}

				if (
					layerFeature[b].properties.Date == undefined ||
					layerFeature[b].properties.Date == ""
				) {
					date = "";
				} else {
					date = `<p>${layerFeature[b].properties.Date}</p>`;
				}

				if (
					layerFeature[b].properties.Time == undefined ||
					layerFeature[b].properties.Time == ""
				) {
					time = "";
				} else {
					time = `<p>${layerFeature[b].properties.Time}</p>`;
				}

				if (
					layerFeature[b].properties.Target_aud == undefined ||
					layerFeature[b].properties.Target_aud == ""
				) {
					targetAud = "";
				} else {
					targetAud = `<p>${layerFeature[b].properties.Target_aud}</p>`;
				}

				var popup = new mapboxgl.Popup({ offset: [0, 0] })
					.setLngLat(layerFeature[b].geometry.coordinates)
					.setHTML(
						image +
							"<h3>" +
							layerFeature[b].properties.Name +
							"</h3>" +
							description +
							time +
							date +
							targetAud +
							`<a href=${layerFeature[b].properties.Website} target="_blank">` +
							"Website" +
							"</a>"
					)
					.addTo(map);
			});
			featureContainer.appendChild(feature);
			item.appendChild(featureContainer);
		}

		value.addEventListener("click", () => {
			featureContainer.classList.toggle("feature-container-show");
		});
	}
});

map.on("click", function (e) {
	popUp(e);
});

function popUp(e) {
	var features = map.queryRenderedFeatures(e.point, {
		layers: [
			"Malls",
			"Restaurants And Cafes",
			"Museum And Cultural Centers",
			"Show And Performance",
			"Sport",
			"Gallery",
			"Hotels",
			"Festival",
			"Games",
			"Educational And Art",
			"Diriyah Season",
			"Cinema",
		],
	});
	if (!features.length) {
		return;
	}
	var feature = features[0];
	let image, description, date, time, targetAud;
	if (feature.properties.Image == undefined || feature.properties.Image == "") {
		image = "";
	} else {
		image = `<img src=${feature.properties.Image} width="200px; height="200px">`;
	}

	if (
		feature.properties.Descriptio == undefined ||
		feature.properties.Descriptio == ""
	) {
		description = "";
	} else {
		description = `<p>${feature.properties.Descriptio}</p>`;
	}

	if (feature.properties.Date == undefined || feature.properties.Date == "") {
		date = "";
	} else {
		date = `<p>${feature.properties.Date}</p>`;
	}

	if (feature.properties.Time == undefined || feature.properties.Time == "") {
		time = "";
	} else {
		time = `<p>${feature.properties.Time}</p>`;
	}

	if (
		feature.properties.Target_aud == undefined ||
		feature.properties.Target_aud == ""
	) {
		targetAud = "";
	} else {
		targetAud = `<p>${feature.properties.Target_aud}</p>`;
	}

	var popup = new mapboxgl.Popup({ offset: [0, 0] })
		.setLngLat(feature.geometry.coordinates)
		.setHTML(
			image +
				"<h3>" +
				feature.properties.Name +
				"</h3>" +
				description +
				time +
				date +
				targetAud +
				`<a href=${feature.properties.Website} target="_blank">` +
				"Website" +
				"</a>"
		)
		.addTo(map);
}

const legendSlider = document.querySelector("#legend-slider");
legendSlider.addEventListener("click", () => {
	const legend = document.querySelector("#legend");
	legend.classList.toggle("legend-slide");
	legendSlider.classList.toggle("slider-arrow");
});

const filterSlider = document.querySelector("#filter-slider");
filterSlider.addEventListener("click", () => {
	const filter = document.querySelector("#filter-group");
	filter.classList.toggle("filter-slide");
	filterSlider.classList.toggle("slider-arrow");
});

const directionSlider = document.querySelector("#direction-slider");
let interactivity = false;
directionSlider.addEventListener("click", () => {
	const direction = document.querySelector(".mapboxgl-ctrl-directions");
	direction.classList.toggle("direction-slide");
	directionSlider.classList.toggle("slider-arrow");
	if (interactivity) {
		return (interactivity = false);
	} else {
		return (interactivity = true);
	}
});

map.addControl(new mapboxgl.ScaleControl(), "bottom-right");

let x = window.matchMedia("(max-width: 425px)");
let directionPosition = "top-right";
let mainController = "bottom-right";
function myFunction(x) {
	if (x.matches) {
		directionPosition = "top-left";
		mainController = "top-right";
	} else {
		directionPosition = "top-right";
		mainController = "bottom-right";
	}
}
myFunction(x);

map.addControl(
	new MapboxDirections({
		accessToken: mapboxgl.accessToken,
		interactive: interactivity,
	}),
	directionPosition
);

map.addControl(new mapboxgl.NavigationControl(), mainController);
map.addControl(
	new mapboxgl.GeolocateControl({
		positionOptions: {
			enableHighAccuracy: true,
		},
		trackUserLocation: true,
	}),
	mainController
);
