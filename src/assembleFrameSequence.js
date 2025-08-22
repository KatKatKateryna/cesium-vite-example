
import * as Cesium from "cesium";

export function assembleSequence(destinationCoords, heights, orientationsDegrees, durations, waitTimes) {
    // calculated values
    const destinations = [];
    for (let i = 0; i < destinationCoords.length; i++){
        destinations.push(Cesium.Cartesian3.fromDegrees(destinationCoords[i][1], destinationCoords[i][0], heights[i]))
    };

    const orientations = [];
    for (let i = 0; i < orientationsDegrees.length; i++){
        orientations.push({
            heading: Cesium.Math.toRadians(orientationsDegrees[i].heading), 
            pitch: Cesium.Math.toRadians(orientationsDegrees[i].pitch), 
            roll: orientationsDegrees[i].roll,
        })
    };

    var sequence = [];
    for (let i = 0; i < destinations.length; i++) {
        sequence.push({
            destination: destinations[i],
            orientation: orientations[i],
            duration: durations[i],
            waitTime: waitTimes[i]
        })
    }
    return sequence;
}