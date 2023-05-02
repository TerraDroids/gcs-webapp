import React, { useState, useEffect, useRef } from "react";
import { CategoryScale, Chart, LinearScale, PointElement, LineElement, BarElement } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group } from '@mantine/core';
import { IconZoomIn } from "@tabler/icons-react";

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(PointElement);
Chart.register(LineElement);
Chart.register(BarElement);

// gcs full form, team logo - done
//more params in bigger display - done
//live values in text - done
// bg logos - done
// battery percent, expected time left - done
//graph zooming - done
//multiple boxes for every parameter - done
// top right created by <> terradroid - done
// initiation date - done

//created by ankush kun (team terradroid) (box me lagado)
//battery niche
//graph niche fill
//live camera feed
//display screen
// move current readings to bottom
//telemetry input/output
//better font
//csv export
//radar, ultrasonic, lidar

Chart.defaults.animation = false;
Chart.defaults.scale.beginAtZero = true;
Chart.defaults.scale.suggestedMin = 0;
Chart.defaults.scale.suggestedMax = 100;
Chart.defaults.scale.grid.display = false;
Chart.defaults.elements.point.radius = 0;
Chart.defaults.elements.line.tension = 0.25;

Chart.defaults.color = "white";

const dataPoints = 100;
const randRange = 5;
// 60FPS = 16.67ms
const updateInterval = 500;

const App = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [temperatureData, setTemperatureData] = useState(Array.from({ length: dataPoints }, () => 30));
  const [altitudeData, setAltitudeData] = useState(Array.from({ length: dataPoints }, () => 1100));
  const [pressureData, setPressureData] = useState(Array.from({ length: dataPoints }, () => 76));
  const [moistureData, setMoistureData] = useState(Array.from({ length: dataPoints }, () => 50));
  const [metalData, setMetalData] = useState(
    [
      {
        name: "Al",
        value: Math.random() * 100,
        color: "#ffffff"
      },
      {
        name: "Cu",
        value: Math.random() * 100,
        color: "#b87333"
      },
      {
        name: "Fe",
        value: Math.random() * 100,
        color: "#a19d94"
      },
      {
        name: "Pb",
        value: Math.random() * 100,
        color: "#b8b8b8"
      },
      {
        name: "Mg",
        value: Math.random() * 100,
        color: "#ff7f00"
      },
      {
        name: "Ni",
        value: Math.random() * 100,
        color: "#808080"
      },
      {
        name: "Ag",
        value: Math.random() * 100,
        color: "#c0c0c0"
      },
    ]);
  const [batteryPerc, setBatteryPerc] = useState(100);
  const [batteryTime, setBatteryTime] = useState(40); // in minutes
  const [expandedViewName, setExpandedViewName] = useState("");
  const batteryDiv = useRef();
  //add a use ref

  useEffect(() => {
    batteryDiv.current.style.width = `${batteryPerc.toFixed(0)}%`;
  }, [batteryPerc])

  // Generate random data for the charts
  const generateData = () => {
    const newData = {
      temperature: getRandomInt(temperatureData[temperatureData.length - 1]),
      altitude: getRandomInt(altitudeData[altitudeData.length - 1]),
      pressure: getRandomInt(pressureData[pressureData.length - 1]),
      moisture: getRandomInt(moistureData[moistureData.length - 1]),
    };

    setBatteryPerc(Math.random() * 100);

    setTemperatureData(prevData => {
      if (prevData.length >= dataPoints) {
        prevData.shift();
      }
      return [...prevData, newData.temperature]
    });

    setAltitudeData(prevData => {
      if (prevData.length >= dataPoints) {
        prevData.shift();
      }
      return [...prevData, newData.altitude]
    });

    setPressureData(prevData => {
      if (prevData.length >= dataPoints) {
        prevData.shift();
      }
      return [...prevData, newData.pressure]
    });

    setMoistureData(prevData => {
      if (prevData.length >= dataPoints) {
        prevData.shift();
      }
      return [...prevData, newData.moisture]
    });
  };


  const getRandomInt = (num) => {
    const max = num + randRange;
    const min = num - randRange;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  useEffect(() => {
    const intervalId = setInterval(generateData, updateInterval);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const temperatureChartData = {
    labels: temperatureData.map((_, index) => ``),
    datasets: [
      {
        label: "Temperature",
        data: temperatureData,
        backgroundColor: "black",
        borderColor: "green",
        borderWidth: 2,
        pointRadius: 0
      }
    ]
  };

  const altitudeChartData = {
    labels: altitudeData.map((_, index) => ``),
    datasets: [
      {
        label: "Altitude",
        data: altitudeData,
        backgroundColor: "red",
        borderColor: "red",
        borderWidth: 2,
        pointRadius: 0
      }
    ]
  };

  const pressureChartData = {
    labels: pressureData.map((_, index) => ``),
    datasets: [
      {
        label: "Pressure",
        data: pressureData,
        backgroundColor: "lightblue",
        borderColor: "lightblue",
        borderWidth: 2,
        pointRadius: 0
      }
    ]
  };

  const moistureChartData = {
    labels: moistureData.map((_, index) => ``),
    datasets: [
      {
        label: "Moisture",
        data: moistureData,
        backgroundColor: "blue",
        borderColor: "blue",
        borderWidth: 2,
        pointRadius: 0
      }
    ]
  };

  const metalChartData = {
    labels: metalData.map((_, index) => `${metalData[index].name} ${metalData[index].value.toFixed(2)}%`),
    datasets: [
      {
        label: metalData.map((_, index) => `${metalData[index].name} ${metalData[index].value}`),
        data: metalData.map((_, index) => `${metalData[index].value}`),
        backgroundColor: metalData.map((_, index) => `${metalData[index].color}69`),
        borderColor: metalData.map((_, index) => `${metalData[index].color}`),
        borderWidth: 2
      }
    ]
  };

  function expand(name) {
    setExpandedViewName(name);
    open();
  }


  return (
    <div className="bg-black/80 text-white px-20 min-h-[100vh]">
      <Modal opened={opened} onClose={close} centered size="90%">
        {expandedViewName === "temperature" && (
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold">Temperature</div>
            <div className="flex gap-5">
              <div className="text-xl font-bold">Current: {temperatureData[temperatureData.length - 1]}°C</div>
              <div className="text-xl font-bold">Max: {Math.max(...temperatureData)}°C</div>
              <div className="text-xl font-bold">Min: {Math.min(...temperatureData)}°C</div>
              <div className="text-xl font-bold">Range: {Math.max(...temperatureData) - Math.min(...temperatureData)}°C</div>
            </div>
            <Line data={temperatureChartData} />
          </div>
        )}
        {expandedViewName === "altitude" && (
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold">Altitude</div>
            <div className="flex gap-5">
              <div className="text-xl font-bold">Current: {altitudeData[altitudeData.length - 1]}m</div>
              <div className="text-xl font-bold">Max: {Math.max(...altitudeData)}m</div>
              <div className="text-xl font-bold">Min: {Math.min(...altitudeData)}m</div>
              <div className="text-xl font-bold">Range: {Math.max(...altitudeData) - Math.min(...altitudeData)}m</div>
            </div>
            <Line data={altitudeChartData} />
          </div>
        )}
        {expandedViewName === "pressure" && (
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold">Pressure</div>
            <div className="flex gap-5">
              <div className="text-xl font-bold">Current: {pressureData[pressureData.length - 1]}hPa</div>
              <div className="text-xl font-bold">Max: {Math.max(...pressureData)}hPa</div>
              <div className="text-xl font-bold">Min: {Math.min(...pressureData)}hPa</div>
              <div className="text-xl font-bold">Range: {Math.max(...pressureData) - Math.min(...pressureData)}hPa</div>
            </div>
            <Line data={pressureChartData} />
          </div>
        )}
        {expandedViewName === "moisture" && (
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold">Moisture</div>
            <div className="flex gap-5">
              <div className="text-xl font-bold">Current: {moistureData[moistureData.length - 1]}%</div>
              <div className="text-xl font-bold">Max: {Math.max(...moistureData)}%</div>
              <div className="text-xl font-bold">Min: {Math.min(...moistureData)}%</div>
              <div className="text-xl font-bold">Range: {Math.max(...moistureData) - Math.min(...moistureData)}%</div>
            </div>
            <Line data={moistureChartData} />
          </div>
        )}
        {expandedViewName === "metal" && (
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold">Metal</div>
            <div className="flex gap-5">
              <div className="text-xl font-bold">Current: {metalData[metalData.length - 1].value.toFixed(2)}%</div>
              <div className="text-xl font-bold">Max: {Math.max(...metalData.map((_, index) => metalData[index].value)).toFixed(2)}%</div>
              <div className="text-xl font-bold">Min: {Math.min(...metalData.map((_, index) => metalData[index].value)).toFixed(2)}%</div>
              <div className="text-xl font-bold">Range: {(Math.max(...metalData.map((_, index) => metalData[index].value)) - Math.min(...metalData.map((_, index) => metalData[index].value))).toFixed(2)}%</div>
            </div>
            <Bar data={metalChartData} />
          </div>
        )}
      </Modal>
      <div className="fixed top-3 h-5 w-20 left-4">
        <div className="ring-1 ring-white/70 h-5 bg-gray-300/60 text-center font-bold text-black">
          <div className={`h-full bg-lime-400 bottom-6`} ref={batteryDiv}></div>
          <div className="relative bottom-5">{batteryPerc.toFixed(0)}%</div>
        </div>
        ETD: {batteryTime}m
      </div>
      <div className="fixed -top-3 sm:top-3 right-8 sm:right-4 text-right -rotate-90 sm:rotate-0 origin-right">
        Created by Ankush Singh (Team Terradroids)<br />
        Initiated on April 11, 2023
      </div>
      <div className="bg-terradroids-full w-screen h-screen fixed left-0 top-0 bottom-0 right-0 -z-10 bg-no-repeat bg-center bg-cover"></div>
      <div className="text-center text-xl sm:text-3xl md:text-5xl p-5 tracking-wide font-bold">
        Ground Control System
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 pb-10">
        <div className="text-center ring-1 ring-white/30 bg-neutral-950/50 truncate">
          Temperature [{temperatureData[temperatureData.length - 1]}°C] <button onClick={() => expand("temperature")}><IconZoomIn size={18} className="relative top-1" /></button>
          <Line data={temperatureChartData} />
        </div>
        <div className="text-center ring-1 ring-white/30 bg-neutral-950/50 truncate">
          Altitude [{altitudeData[altitudeData.length - 1]}m] <button onClick={() => expand("altitude")}><IconZoomIn size={18} className="relative top-1" /></button>
          <Line data={altitudeChartData} />
        </div>
        <div className="text-center ring-1 ring-white/30 bg-neutral-950/50 truncate">
          Pressure [{pressureData[pressureData.length - 1]}hPa] <button onClick={() => expand("pressure")}><IconZoomIn size={18} className="relative top-1" /></button>
          <Line data={pressureChartData} />
        </div>
        <div className="text-center ring-1 ring-white/30 bg-neutral-950/50 truncate">
          Moisture [{moistureData[moistureData.length - 1]}%] <button onClick={() => expand("moisture")}><IconZoomIn size={18} className="relative top-1" /></button>
          <Line data={moistureChartData} />
        </div>
        <div className="text-center ring-1 ring-white/30 bg-neutral-950/50 truncate">
          Metals Detected <button onClick={() => expand("metal")}><IconZoomIn size={18} className="relative top-1" /></button>
          <Bar data={metalChartData} />
        </div>
      </div>
    </div>
  );
};

export default App;