import React, { useState, useEffect } from "react";
import { CategoryScale, Chart, LinearScale, PointElement, LineElement, BarElement } from "chart.js";
import { Bar, Line } from "react-chartjs-2";

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(PointElement);
Chart.register(LineElement);
Chart.register(BarElement);

// gcs full form, team logo
//multiple boxes for every parameter
//telemetry input/output
//better font
//more params in bigger display
//live values in text
//graph zooming
//csv export
//radar, ultrasonic, lidar
// battery percent, expected time left
// bg logos
// top right created by <> terradroid
// initiation date

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
const updateInterval = 250;

const App = () => {
  const [temperatureData, setTemperatureData] = useState(Array.from({ length: dataPoints }, () => 30));
  const [altitudeData, setAltitudeData] = useState(Array.from({ length: dataPoints }, () => 1100));
  const [pressureData, setPressureData] = useState(Array.from({ length: dataPoints }, () => 76));
  const [moistureData, setMoistureData] = useState(Array.from({ length: dataPoints }, () => 50));
  // add barchart data here
  const [metalData, setMetalData] = useState(
    [
      {
        name: "Aluminum",
        value: Math.random() * 100,
        color: "#ffffff"
      },
      {
        name: "Copper",
        value: Math.random() * 100,
        color: "#b87333"
      },
      {
        name: "Iron",
        value: Math.random() * 100,
        color: "#a19d94"
      },
      {
        name: "Lead",
        value: Math.random() * 100,
        color: "#b8b8b8"
      },
      {
        name: "Magnesium",
        value: Math.random() * 100,
        color: "#ff7f00"
      },
      {
        name: "Nickel",
        value: Math.random() * 100,
        color: "#808080"
      },
      {
        name: "Silver",
        value: Math.random() * 100,
        color: "#c0c0c0"
      },
    ]);

  // Generate random data for the charts
  const generateData = () => {
    const newData = {
      temperature: getRandomInt(temperatureData[temperatureData.length - 1]),
      altitude: getRandomInt(altitudeData[altitudeData.length - 1]),
      pressure: getRandomInt(pressureData[pressureData.length - 1]),
      moisture: getRandomInt(moistureData[moistureData.length - 1]),
    };

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
    labels: metalData.map((_, index) => `${metalData[index].name}`),
    datasets: [
      {
        label: metalData.map((_, index) => `${metalData[index].name}`),
        data: metalData.map((_, index) => `${metalData[index].value || Math.random() * 100}`),
        backgroundColor: metalData.map((_, index) => `${metalData[index].color}69`),
        borderColor: metalData.map((_, index) => `${metalData[index].color}`),
        borderWidth: 2
      }
    ]
  };


  return (
    <div className="bg-zinc-900 text-white px-20 p-5 min-h-[100vh]">
      <div className="text-center text-5xl pb-5 tracking-widest">
        Ground Control System
      </div>
      <div className="grid grid-cols-4 gap-5 px-10">
        <div className="text-center ring-1 ring-white/30">
          Temperature
          <Line data={temperatureChartData} />
        </div>
        <div className="text-center ring-1 ring-white/30">
          Altitude
          <Line data={altitudeChartData} />
        </div>
        <div className="text-center ring-1 ring-white/30">
          Pressure
          <Line data={pressureChartData} />
        </div>
        <div className="text-center ring-1 ring-white/30">
          Moisture
          <Line data={moistureChartData} />
        </div>
        <div className="text-center col-span-1 ring-1 ring-white/30">
          Metals Detected
          <Bar data={metalChartData} />
        </div>
      </div>
    </div>
  );
};

export default App;