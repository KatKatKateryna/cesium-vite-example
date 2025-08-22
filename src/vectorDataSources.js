
import * as Cesium from "cesium";

// original setup: data to add on the map
export const textPositions = [
    { coords: [-25.02870420614961, 46.98251704380331], text: "Taolagnaro", font: "24px sans-serif", fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.BLACK, style: Cesium.LabelStyle.FILL_AND_OUTLINE},
    { coords: [-25.007746105451954, 46.96489618927976], text: "Pic Saint-Louis", font: "12px sans-serif", fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.BLACK, style: Cesium.LabelStyle.FILL_AND_OUTLINE },
    { coords: [-25.036358737482214, 46.954329185179034], text: "Aéroport de Tôlanaro", font: "12px sans-serif", fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.BLACK, style: Cesium.LabelStyle.FILL_AND_OUTLINE },
];


// Load from public/data/lisbon-area.geojson
export const geoJsonDataSources = [
        {
            source: "/data/lisbon-area.geojson",
            functionAdd: await Cesium.GeoJsonDataSource.load("/data/lisbon-area.geojson", {
                stroke: Cesium.Color.ORANGE,
                fill: Cesium.Color.ORANGE.withAlpha(0.4),
                strokeWidth: 0, // no outline
                clampToGround: true,
            }),
            appearMode: 1, // reveal gradually
        },
];