
import { wait } from "./utils.js";

import * as Cesium from "cesium";

// Promise-based flyCameraTo
export function flyCameraTo(viewer, destination, orientation, duration, waitAfterTime) {
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

export function orbitCamera(viewer, stopTime){

    return new Promise(resolve => {
        // camera rotation
        const ray = viewer.camera.getPickRay(new Cesium.Cartesian2(
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
        const range = Cesium.Cartesian3.distance(viewer.camera.positionWC, center);
        let heading = initialHeading; // mutable heading for animation

        // STEP 2: Orbit camera around center point using lookAt + HeadingPitchRange


        // Save handler reference
        const orbitCallback = () => {
          heading += Cesium.Math.toRadians(0.2);
          viewer.camera.lookAt(center, new Cesium.HeadingPitchRange(heading, pitch, range));
        };

        viewer.scene.preRender.addEventListener(orbitCallback);

        // Stop orbit after stopTime ms
        setTimeout(() => {
          viewer.scene.preRender.removeEventListener(orbitCallback);
          viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY); // release lookAt
          resolve(); // allow next sequence run
        }, stopTime);
        
    });
}


