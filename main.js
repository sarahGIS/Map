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
		var key = document.createElement("span");
		key.className = "legend-key";
		key.style.backgroundColor = layers[i].paint["circle-color"];

		var value = document.createElement("span");
		value.innerHTML = layers[i].id;
		value.style.cursor = "pointer";
		item.appendChild(key);
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

const legendSlider = document.querySelector(".fa-sort");
const filterSlider = document.querySelector(".fa-layer-group");
const legend = document.querySelector("#legend");
const filter = document.querySelector("#filter-group");

legendSlider.addEventListener("click", () => {
	legend.classList.toggle("legend-slide");
	legendSlider.classList.toggle("slider-group");
	filter.classList.remove("filter-slide");
	filterSlider.classList.remove("slider-group");
});

filterSlider.addEventListener("click", () => {
	filter.classList.toggle("filter-slide");
	filterSlider.classList.toggle("slider-group");
	legend.classList.remove("legend-slide");
	legendSlider.classList.remove("slider-group");
});

map.addControl(new mapboxgl.ScaleControl(), "bottom-right");
map.addControl(
	new MapboxDirections({
		accessToken: mapboxgl.accessToken,
		unit: "metric",
	}),
	"top-right"
);

map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
map.addControl(
	new mapboxgl.GeolocateControl({
		positionOptions: {
			enableHighAccuracy: true,
		},
		trackUserLocation: true,
	}),
	"bottom-right"
);
