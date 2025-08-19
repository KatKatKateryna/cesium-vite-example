// revealGeoJson.js

import * as Cesium from "cesium";

export async function revealGeoJsonPointByPoint(url, viewer) {
  const response = await fetch(url);
  const geojson = await response.json();

  for (const feature of geojson.features) {
    const coords = feature.geometry.coordinates;
    const type = feature.geometry.type;

    if (type === "LineString") {
      animateLine(coords, viewer);
    } else if (type === "Polygon") {
      animatePolygon(coords[0], viewer); // outer ring only
    }
  }
}


function animateLine(coords, viewer, intervalDuration = 200) {
  let currentIndex = 2;
  const positions = coords.slice(0, currentIndex).flat();
  const positionArray = [...positions]; // clone to mutate over time

  const polylineEntity = viewer.entities.add({
    polyline: {
      positions: new Cesium.CallbackProperty(() => {
        return Cesium.Cartesian3.fromDegreesArray(positionArray);
      }, false),
      width: 3,
      material: Cesium.Color.ORANGE,
    },
  });

  const interval = setInterval(() => {
    if (currentIndex >= coords.length) {
      clearInterval(interval);
      return;
    }

    // Add next vertex
    positionArray.push(coords[currentIndex][0], coords[currentIndex][1]);
    currentIndex++;
  }, intervalDuration);
}
function animatePolygon(coords, viewer, intervalDuration = 300) {
  let currentIndex = 3; // need at least 3 points
  const positions = coords.slice(0, currentIndex).flat();
  const positionArray = [...positions];

  const polygonEntity = viewer.entities.add({
    polygon: {
      hierarchy: new Cesium.CallbackProperty(() => {
        return Cesium.Cartesian3.fromDegreesArray(positionArray);
      }, false),
      material: Cesium.Color.ORANGE.withAlpha(0.5),
      outline: true,
      outlineColor: Cesium.Color.ORANGE,
    },
  });

  const interval = setInterval(() => {
    if (currentIndex >= coords.length) {
      clearInterval(interval);
      return;
    }

    // Add next vertex
    positionArray.push(coords[currentIndex][0], coords[currentIndex][1]);
    currentIndex++;
  }, intervalDuration);
}

////////////////////////////////////////////////////////////

function animateLine_flickering(coords, viewer) {
  let currentIndex = 2;
  const positions = coords.slice(0, currentIndex).flat();
  const entity = viewer.entities.add({
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray(positions),
      width: 3,
      material: Cesium.Color.ORANGE,
    },
  });

  const interval = setInterval(() => {
    if (currentIndex >= coords.length) {
      clearInterval(interval);
      return;
    }

    positions.push(coords[currentIndex][0], coords[currentIndex][1]);
    entity.polyline.positions = Cesium.Cartesian3.fromDegreesArray(positions);
    currentIndex++;
  }, 1000);
}

function animatePolygon_flickering(coords, viewer) {
  let currentIndex = 3;
  const positions = coords.slice(0, currentIndex).flat();
  const entity = viewer.entities.add({
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray(positions),
      material: Cesium.Color.ORANGE.withAlpha(0.5),
      outline: true,
      outlineColor: Cesium.Color.ORANGE,
    },
  });

  const interval = setInterval(() => {
    if (currentIndex >= coords.length) {
      clearInterval(interval);
      return;
    }

    positions.push(coords[currentIndex][0], coords[currentIndex][1]);
    entity.polygon.hierarchy = Cartesian3.fromDegreesArray(positions);
    currentIndex++;
  }, 1000);
}
