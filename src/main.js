
import * as Cesium from "cesium";

import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";

import { revealGeoJsonPointByPoint } from "./revealGeoJson.js";
import { flyCameraTo, orbitCamera } from "./cameraMovements.js";
import { loadViewerAndBaseMap } from "./viewerStart.js";
import { addTextEntities } from "./addText.js";
import { assembleSequence } from "./assembleFrameSequence.js";
import { wait } from "./utils.js";

import {textPositions, geoJsonDataSources} from "./vectorDataSources.js";

/////////////////////////////  load viewer with 2d or 3d tiles
const viewer = await loadViewerAndBaseMap();
const firstPassTimeCoeff = 1; // set to 4-5 for final recording

/////////////////////////////  add all text and vector data
addTextEntities(viewer, textPositions);
/*
for (let i = 0; i < geoJsonDataSources.length; i++){
    if (geoJsonDataSources[i].appearMode == 0) {
        viewer.dataSources.add(geoJsonDataSources[i].functionAdd);
    }
    else if (geoJsonDataSources[i].appearMode == 1) {
        revealGeoJsonPointByPoint(geoJsonDataSources[i].source, viewer);
    }
}
*/

/////////////////////////////  set up camera key frames (manual entries)
const destinationCoords = [
  [-25.054414745515704, 47.02176880681622],
  [-25.01638118452486, 46.976640276261904],
  [-24.956062758093807, 46.93795192611665],
]
const heights = [5000, 1000, 5000]; // in meters
const durations = [5, 8, 8];
const waitTimes = [2000, 1000, 500];

const orientationsDegrees = [
  {heading: -45, pitch: -40, roll: 0},
  {heading: -45, pitch: -90, roll: 0},
  {heading: 10, pitch: -35, roll: 0},
];

///////////////////////////// Set up camera sequence
const sequence = assembleSequence(destinationCoords, heights, orientationsDegrees, durations, waitTimes);

async function flyThroughSequence(viewer, sequence, timeCoef) {
  for (const step of sequence) {
    const { destination, orientation, duration, waitAfterTime } = step;
    var durationAdjusted = duration * timeCoef;
    await flyCameraTo(viewer, destination, orientation, durationAdjusted, waitAfterTime);
  }
  await orbitCamera(viewer, 10000);
}

////////////////////////////////////// Run animation: do not modify ///////////////////////////////////////////
await flyThroughSequence(viewer, sequence, firstPassTimeCoeff);
await flyThroughSequence(viewer, sequence, 1);
///////////////////////////////////////////////////////////////////////////////////////////////////

