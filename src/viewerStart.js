
import * as Cesium from "cesium";

Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ZjAzN2M0NS00NmI3LTQ5NWItOTJiYy05ODk5YjUwMzM3YjciLCJpZCI6MjI4OTk2LCJpYXQiOjE3MjEyMjMyMTR9.eSNxaAOutms9FO0HlQG-h8Uv5APtjcrZ3LXmAKKqfJY";

export async function loadViewerAndBaseMap(){
    const viewer = new Cesium.Viewer("cesiumContainer", {
        //terrain: Terrain.fromWorldTerrain(),
        // globe: false,
        //geocoder: Cesium.IonGeocodeProviderType.GOOGLE,
        // baseLayerPicker: false, // optional: disable base layer picker to avoid switching back to Bing

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


    // Load Google 3d tiles
    try {
        const tileset = await Cesium.createGooglePhotorealistic3DTileset();
        viewer.scene.primitives.add(tileset);

        tileset.tileLoad.addEventListener((tile) => {
            // Optionally, log when high-res tiles are loaded
            // console.log("Tile loaded:");
            // console.log("   Bounding volume:", tile.boundingVolume);
            // console.log("   Content:", tile.content); // actual tile content object
            // console.log("   Level:", tile.level);    // LOD level
        });
        // A 3D tile failed to load: https://tile.googleapis.com/v1/3dtiles/datasets/CgIYAQ/files/AJVsH2wR2M5i36yxHj0k_uHzkpwG88O-7H8W5A6RGYBPJpjbID7bSt0YQ6XHn_Z-rRIY_pZGvzbkvhGwv2pAt_EpEuxTZw-3hd2XVxVG7qxZ0g3j8kO_4AidgqK2fRtFcdX84OQChcCaMse3POEPpWg.glb?session=CO_U_rGdkqf68QEQ8JmkxQY&key=AIzaSyCbO-hnerlEJm2dte3Psf3Ggh3UJTs3Ui0
        // cesium.js?v=59a37533:128618 

        // Force high-res tiles
        tileset.maximumScreenSpaceError = 8; // default is 16, smaller = more detail: how much a tile can deviate from ideal. Lower = more triangles, sharper.
        tileset.skipLevelOfDetail = false;   // disable skipping levels: if true, tiles can skip LOD levels to speed up loading. Set to false for max detail.
        tileset.dynamicScreenSpaceError = false; // disable dynamic error adjustment: if true, Cesium reduces LOD for performance. Disable for max detail.

    } catch (error) {
        console.log(`Failed to load tileset: ${error}`);
    }
    
    /*
    var customLayer = new Cesium.UrlTemplateImageryProvider({
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


    /*
    // Load OSM Buildings
    Cesium.createOsmBuildingsAsync().then((osmTileset) => {
    // Apply a dark style by modifying the tileset's style property
    osmTileset.style = new Cesium.Cesium3DTileStyle({
        color: "color('white')",  // base color black
        // Optionally, modulate color with height or other properties
        // e.g., color: "color('black').withAlpha(0.8)"
    });

    viewer.scene.primitives.add(osmTileset);
    }
    );
    */

    return viewer;
}


