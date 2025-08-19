import {
  Cartesian3,
  Math as CesiumMath,
  Terrain,
  Viewer,
  createOsmBuildingsAsync,
  createGooglePhotorealistic3DTileset,
  IonGeocodeProviderType,
  Ion,
  HeadingPitchRange,
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";

Ion.defaultAccessToken = "";

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Viewer("cesiumContainer", {
  //terrain: Terrain.fromWorldTerrain(),
    globe: false,
    geocoder: IonGeocodeProviderType.GOOGLE,
});

try {
  const tileset = await createGooglePhotorealistic3DTileset();
  viewer.scene.primitives.add(tileset);
} catch (error) {
  console.log(`Failed to load tileset: ${error}`);
}
// Define Lisbon coordinates
const lisbonCenterXYDegrees = [-9.1399, 38.7169]
const lisbonCenter = Cartesian3.fromDegrees(-9.1399, 38.7169, 0);
const lisbonCenterHigh = Cartesian3.fromDegrees(-9.1399, 38.7169, 5000);


// STEP 1: Fly to Lisbon, close view
viewer.camera.flyTo({
  destination: Cartesian3.fromDegrees(-9.1399, 38.7169, 1000), // close to ground
  orientation: {
    heading: CesiumMath.toRadians(0.0),
    pitch: CesiumMath.toRadians(-30.0),
    roll: 0.0,
  },
  duration: 3,
  complete: () => {
    // STEP 2: Wait 2 seconds, then zoom out a bit
    setTimeout(() => {
      viewer.camera.flyTo({
        destination: lisbonCenterHigh, // zoomed out
        orientation: {
          heading: CesiumMath.toRadians(10.0),
          pitch: CesiumMath.toRadians(-25.0),
          roll: 0.0,
        },
        duration: 2,
        complete: () => {
          // STEP 3: Wait 1 second, then orbit
          setTimeout(() => {
            const center = lisbonCenterHigh;

            // STEP 1: Get initial heading, pitch, and range from current camera
            const initialHeading = viewer.camera.heading;
            const initialPitch = viewer.camera.pitch;

            const range = Cartesian3.distance(viewer.camera.positionWC, center);

            let heading = initialHeading; // mutable heading for animation

            // STEP 2: Orbit using lookAt + HeadingPitchRange
            const orbitInterval = setInterval(() => {
              heading += CesiumMath.toRadians(0.2); // rotate heading

              viewer.camera.lookAt(
                center,
                new HeadingPitchRange(heading, initialPitch, range)
              );
            }, 30); // every ~33 FPS

            // Optional: Stop orbit after 20 seconds and reset camera
            setTimeout(() => {
              clearInterval(orbitInterval);
              viewer.camera.lookAtTransform(Matrix4.IDENTITY); // reset control
            }, 20000);
          }, 1000); // wait 1 second after zooming out
        },
      });
    }, 2000); // wait 2 seconds after first flyTo
  },
});
