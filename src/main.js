import {
  Cartesian3,
  Math as CesiumMath,
  Terrain,
  Viewer,
  createOsmBuildingsAsync,
} from "cesium";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";

/*
// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Viewer("cesiumContainer", {
  terrain: Terrain.fromWorldTerrain(),
});
*/

// Offline viewer:
const viewer = new Cesium.Viewer("cesiumContainer", {
  baseLayer: Cesium.ImageryLayer.fromProviderAsync(
    Cesium.TileMapServiceImageryProvider.fromUrl(
      Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
    ),
  ),
  baseLayerPicker: false,
  geocoder: false,
});

// Fly the camera to San Francisco at the given longitude, latitude, and height.
viewer.camera.flyTo({
  destination: Cartesian3.fromRadians(-1.2918751872011363, 0.7103572663807194, 100), //(-122.4175, 37.655, 400),
  //destination: Cartesian3.fromDegrees(-1.2918751872011363,0.7103572663807194,100), //(-122.4175, 37.655, 400),
  orientation: {
    heading: CesiumMath.toRadians(0.0),
    pitch: CesiumMath.toRadians(-15.0),
  },
});

/*
// Add Cesium OSM Buildings, a global 3D buildings layer.
createOsmBuildingsAsync().then((buildingTileset) => {
  viewer.scene.primitives.add(buildingTileset);
});
*/

// Add customm layer
try {
  const tileset = await Cesium.Cesium3DTileset.fromUrl(
    "http://localhost:8003/tileset.json",
  );
  viewer.scene.primitives.add(tileset);
} catch (error) {
  console.log(`Error loading tileset: ${error}`);
}