import {
  Cesium3DTileStyle,
  Cartesian2,
  Cartesian3,
  Matrix4,
  Math as CesiumMath,
  Terrain,
  Viewer,
  UrlTemplateImageryProvider,
  createOsmBuildingsAsync,
  createGooglePhotorealistic3DTileset,
  IonGeocodeProviderType,
  Ion,
  HeadingPitchRange,
  GeoJsonDataSource, 
  Color,
  LabelStyle,
  VerticalOrigin
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";
import { revealGeoJsonPointByPoint } from "./revealGeoJson.js";

Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ZjAzN2M0NS00NmI3LTQ5NWItOTJiYy05ODk5YjUwMzM3YjciLCJpZCI6MjI4OTk2LCJpYXQiOjE3MjEyMjMyMTR9.eSNxaAOutms9FO0HlQG-h8Uv5APtjcrZ3LXmAKKqfJY";

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Viewer("cesiumContainer", {
        //terrain: Terrain.fromWorldTerrain(),
        // globe: false,
        geocoder: IonGeocodeProviderType.GOOGLE,

        // optional: if we don't use 3d tile, we can use image provider for base maps:
        /*
        imageryProvider: new UrlTemplateImageryProvider({
          url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          credit: "© OpenStreetMap contributors",
          maximumLevel: 22,
        }),
        */
        baseLayerPicker: false, // optional: disable base layer picker to avoid switching back to Bing

        
        // Disable navigation controls
        navigationHelpButton: false,  // the little "?" button at bottom right
        navigationInstructionsInitiallyVisible: false,
        animation: false,             // timeline animation widget
        timeline: false,              // timeline bar widget
        baseLayerPicker: false,       // layer picker dropdown
        fullscreenButton: false,      // fullscreen button
        vrButton: false,              // VR button
        sceneModePicker: false,       // 3D/2D mode picker
        homeButton: false,            // home/reset button
        geocoder: false,              // search box (if you want to disable geocoder too)

    });

/*
var customLayer = new UrlTemplateImageryProvider({
      //url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      //credit: "© OpenStreetMap contributors",
      
      // Dark mode
      url: "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      credit: "© OpenStreetMap contributors, © CARTO",
      maximumLevel: 19,
      
      
      // Topomap
      //url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      //subdomains: ["a", "b", "c"],
      //credit: "© OpenTopoMap, OpenStreetMap contributors",
      //maximumLevel: 17,
      
});
var imageryLayers = viewer.imageryLayers;
imageryLayers.addImageryProvider(customLayer );
*/

// Load Google 3d tiles
try {
    const tileset = await createGooglePhotorealistic3DTileset();
    viewer.scene.primitives.add(tileset);
} catch (error) {
    console.log(`Failed to load tileset: ${error}`);
}


// add text

const textPositions = [
    { coords: [-25.02870420614961, 46.98251704380331], text: "Taolagnaro", font: "24px sans-serif" },
    { coords: [-25.007746105451954, 46.96489618927976], text: "Pic Saint-Louis", font: "12px sans-serif" },
    { coords: [-25.036358737482214, 46.954329185179034], text: "Aéroport de Tôlanaro", font: "12px sans-serif" },
];

textPositions.forEach(loc => {
    viewer.entities.add({
        position: Cartesian3.fromDegrees(loc.coords[1], loc.coords[0], 500),
        label: { 
            text: loc.text, 
            font: loc.font,
            fillColor: Color.WHITE,
            outlineColor: Color.BLACK,
            outlineWidth: 2,
            style: LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: VerticalOrigin.BOTTOM, // anchor the text
            eyeOffset: new Cartesian3(0, 0, 0), // optional offset
        },
    });
});


/*
// Load OSM Buildings
createOsmBuildingsAsync().then((osmTileset) => {
  // Apply a dark style by modifying the tileset's style property
  osmTileset.style = new Cesium3DTileStyle({
    color: "color('white')",  // base color black
    // Optionally, modulate color with height or other properties
    // e.g., color: "color('black').withAlpha(0.8)"
  });

  viewer.scene.primitives.add(osmTileset);
}
);
*/


/*
// show GeoJSON
// Load from public/data/lisbon-area.geojson
const geoJsonDataSource = await GeoJsonDataSource.load("/data/lisbon-area.geojson", {
  stroke: Color.ORANGE,
  fill: Color.ORANGE.withAlpha(0.4),
  strokeWidth: 0, // no outline
  clampToGround: true,
});

viewer.dataSources.add(geoJsonDataSource);
*/
// revealGeoJsonPointByPoint("/data/lisbon-area.geojson", viewer);


const locations = [
  [-25.054414745515704, 47.02176880681622],
  [-25.01638118452486, 46.976640276261904],
  [-24.956062758093807, 46.93795192611665],
]
const heights = [5000, 1000, 5000]

const durations = [5, 8, 8];
const waitTimes = [2000, 1000, 500];

const destinations = [];
for (let i = 0; i < locations.length; i++){
    destinations.push(Cartesian3.fromDegrees(locations[i][1], locations[i][0], heights[i]))
}

const orientations = [
    {
        heading: CesiumMath.toRadians(-45.0), // horizontal rotation, positive to the right
        pitch: CesiumMath.toRadians(-40.0),
        roll: 0.0,
    },
    {
        heading: CesiumMath.toRadians(-45.0),
        pitch: CesiumMath.toRadians(-90.0),
        roll: 0.0,
    },
    {
        heading: CesiumMath.toRadians(10.0),
        pitch: CesiumMath.toRadians(-35.0),
        roll: 0.0,
    }
];

const sequence = []
for (let i = 0; i < destinations.length; i++) {
    sequence.push({
        destination: destinations[i],
        orientation: orientations[i],
        duration: durations[i],
        waitTime: waitTimes[i]
    })
}


function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Promise-based flyCameraTo
function flyCameraTo(viewer, destination, orientation, duration, waitAfterTime) {
  return new Promise((resolve) => {
    viewer.camera.flyTo({
      destination: destination,
      orientation: orientation,
      duration: duration,
      complete: async () => {
        await wait(waitAfterTime);
        resolve(); // continue to next
      }
    });
  });
}

function orbitCamera(viewer, stopTime){

    return new Promise(resolve => {
        // camera rotation
        const ray = viewer.camera.getPickRay(new Cartesian2(
            viewer.canvas.clientWidth / 2,
            viewer.canvas.clientHeight / 2
        ));
        const center = viewer.scene.globe.pick(ray, viewer.scene);
        if (!center) {
            console.warn("Could not determine orbit center");
            return;
        }

        // STEP 1: Get initial heading, pitch, and range from current camera
        const initialHeading = viewer.camera.heading;
        const initialPitch = viewer.camera.pitch;

        const pitch = viewer.camera.pitch;
        const range = Cartesian3.distance(viewer.camera.positionWC, center);
        let heading = initialHeading; // mutable heading for animation

        // STEP 2: Orbit camera around center point using lookAt + HeadingPitchRange


        // Save handler reference
        const orbitCallback = () => {
          heading += CesiumMath.toRadians(0.2);
          viewer.camera.lookAt(center, new HeadingPitchRange(heading, pitch, range));
        };

        viewer.scene.preRender.addEventListener(orbitCallback);

        // Stop orbit after stopTime ms
        setTimeout(() => {
          viewer.scene.preRender.removeEventListener(orbitCallback);
          viewer.camera.lookAtTransform(Matrix4.IDENTITY); // release lookAt
          resolve(); // ✅ allow next sequence run
        }, stopTime);

    });
}



// Usage: loop over your sequence
async function flyThroughSequence(viewer, sequence, timeCoef) {
  for (const step of sequence) {
    const { destination, orientation, duration, waitAfterTime } = step;
    var durationAdjusted = duration * timeCoef;
    await flyCameraTo(viewer, destination, orientation, durationAdjusted, waitAfterTime);
  }
  await orbitCamera(viewer, 10000);
}

await flyThroughSequence(viewer, sequence, 4);
await flyThroughSequence(viewer, sequence, 1);
