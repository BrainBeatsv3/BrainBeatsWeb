// ------------- Import Libraries -------------
import React, { useEffect } from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Cards from '../Components/Cards/Cards'
// User Interface
import * as components from "https://cdn.jsdelivr.net/npm/brainsatplay-ui@0.0.7/dist/index.esm.js";

// Data Acquisition
// import * as datastreams from "./src/frontend/dist/index.esm.js"
import * as datastreams from "https://cdn.jsdelivr.net/npm/datastreams-api@latest/dist/index.esm.js";

// Device Drivers
import ganglion from "https://cdn.jsdelivr.net/npm/@brainsatplay/ganglion@0.0.2/dist/index.esm.js";


const Test1 = () => {

  useEffect(() => {

    const dataDevices = new datastreams.DataDevices();
    dataDevices.load(ganglion);
    // ------------- Setup Visualization (very rough) -------------
    const graphDiv = document.getElementById("graph");
    graphDiv.style.padding = "25px";
    const timeseries = new components.streams.data.TimeSeries();
    graphDiv.insertAdjacentElement("beforeend", timeseries);

    // ------------- Declare Global Variables -------------
    const allData = [];
    let channels = 0;
    let trackMap = new Map();
    let contentHintToIndex = {};

    const fastcsv = require('fast-csv');
    const fs = require('fs');
    const ws = fs.createWriteStream("./out.csv");

    // ------------- Declare Data Handler -------------
    const ondata = (data, timestamps, contentHint) => {
      console.log(
        `Data from Electrode ${contentHintToIndex[contentHint]} (${contentHint})`,
        data,
        timestamps,
      );   
      // fastcsv
      // .write(`Data from Electrode ${contentHintToIndex[contentHint]} (${contentHint})`,
      // data,
      // timestamps, { headers: true })
      // .pipe(ws);
    };

    // ------------- Declare Track Handler -------------
    const handleTrack = (track) => {
      // ------------- Map Track Information (e.g. 10-20 Coordinate) to Index -------------
      if (!trackMap.has(track.contentHint)) {
        const index = trackMap.size;
        contentHintToIndex[track.contentHint] = index;
        trackMap.set(index, track);
      }

      // ------------- Grab Index -------------
      const i = contentHintToIndex[track.contentHint];
      channels = i > channels ? i : channels; // Assign channels as max track number

      // ------------- Subscribe to New Data -------------
      track.subscribe((data, timestamps) => {
        // Organize New Data
        let arr = [];
        for (let j = 0; j <= channels; j++)
          i === j ? arr.push(data) : arr.push([]);

        // Add Data to Timeseries Graph
        timeseries.data = arr;
        //debugger;
        //console.log(i, arr);
        timeseries.draw(); // FORCE DRAW: Update happens too fast for UI

        // Run ondata Callback
        ondata(data, timestamps, track.contentHint);
      });
    };

    // ------------- Declare Acquisition Function -------------

    const startAcquisition = async (label) => {
      // ------------- Get Device Stream -------------

      // Method #1: By Label
      const dataDevice = await dataDevices.getUserDevice({ label });

      // Method #2: By Class
      // const dataDevice = await dataDevices.getUserDevice(ganglion)

      // ------------- Grab DataStream from Device -------------
      const stream = dataDevice.stream;

      // ------------- Handle All Tracks -------------
      stream.tracks.forEach(handleTrack);
      stream.onaddtrack = (e) => handleTrack(e.track);
    };

    

    // ------------- Set Button Functionality -------------
    const buttons = document.querySelector("#buttons");
    for (let button of buttons.querySelectorAll("button"))
      button.onclick = () => startAcquisition(button.id);
    })
    
  return (
    <>
    <Navbar />
    <br />
    <h1>Bluetooth Testing</h1>
    <hr />
    
    <div id="buttons">
      <p>Click connect and choose your Ganglion headset in the popup.</p>
      <button id="ganglion">Connect</button>
    </div>

    {/* <div id="buttons">
    <button onClick={disconnectDevice}>Disconnect</button>
    </div> */}



    <div id="graph">
      <p>Graph of live EEG data:</p>
    </div>

    <div>
    </div>
    </>
  )
}

export default Test1
