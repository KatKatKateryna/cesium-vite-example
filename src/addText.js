
import * as Cesium from "cesium";

export function addTextEntities(viewer, textPositions){
    textPositions.forEach(loc => {
        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(loc.coords[1], loc.coords[0], 500),
            label: { 
                text: loc.text, 
                font: loc.font,
                fillColor: loc.fillColor,
                outlineColor: loc.outlineColor,
                outlineWidth: 2,
                style: loc.style,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // anchor the text
                eyeOffset: new Cesium.Cartesian3(0, 0, 0), // optional offset
            },
        });
    });
}
