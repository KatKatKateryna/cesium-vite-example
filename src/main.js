
import * as Cesium from "cesium";

import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";

import { revealGeoJsonPointByPoint } from "./revealGeoJson.js";
import { flyCameraTo, orbitCamera, waitForVisibleTiles } from "./cameraMovements.js";
import { loadViewerAndBaseMap } from "./viewerStart.js";
import { addTextEntities } from "./addText.js";
import { assembleSequence } from "./assembleFrameSequence.js";
import { wait } from "./utils.js";

import {textPositions, geoJsonDataSources} from "./vectorDataSources.js";

/////////////////////////////  load viewer with 2d or 3d tiles
const viewer = await loadViewerAndBaseMap();
const onlyFirstFrame = false;
const firstPassCoeff = 5;

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

///////////////////////////// expose animation times in HTML
const exportDuration = durations.reduce((a, b) => a + b)
const startDurationAnimationTimes = [firstPassCoeff*exportDuration, exportDuration ]

const el = document.getElementById('startDurationAnimationTimes');
el.dataset.value = JSON.stringify(startDurationAnimationTimes); // Assign as JSON string
// get element in external app:
// const el = document.getElementById('myElement');
// const pickedList = JSON.parse(el.dataset.value); // [1,2,3,4,5]


///////////////////////////// Set up camera sequence
const sequence = assembleSequence(destinationCoords, heights, orientationsDegrees, durations, waitTimes);

async function flyThroughSequence(viewer, sequence, timeCoef, onlyFirstFrame, waitForTilesLoad) {
    for (const step of sequence) {
        const { destination, orientation, duration, waitAfterTime } = step;
        var durationAdjusted = duration * timeCoef;
        await flyCameraTo(viewer, destination, orientation, durationAdjusted, waitAfterTime, waitForTilesLoad);
    }

    if (onlyFirstFrame == false){
        await orbitCamera(viewer, 10000);
    }
}

////////////////////////////////////// Run animation: do not modify ///////////////////////////////////////////
if (onlyFirstFrame){
    await flyThroughSequence(viewer, [sequence[0]], 1, onlyFirstFrame, false);
}
else {
    await flyThroughSequence(viewer, sequence, firstPassCoeff, onlyFirstFrame, true);
    await flyThroughSequence(viewer, sequence, 1, onlyFirstFrame, false);
}
///////////////////////////////////////////////////////////////////////////////////////////////////

