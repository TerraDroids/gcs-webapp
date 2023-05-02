import { useState, useEffect, useRef } from "react";
import { CategoryScale, Chart, LinearScale, PointElement, LineElement, BarElement } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group } from '@mantine/core';
import { IconZoomIn } from "@tabler/icons-react";
import { Map, Marker } from "pigeon-maps"
import { osm } from 'pigeon-maps/providers'


Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(PointElement);
Chart.register(LineElement);
Chart.register(BarElement);

Chart.defaults.animation = false;
Chart.defaults.scale.beginAtZero = true;
Chart.defaults.scale.suggestedMin = 0;
Chart.defaults.scale.suggestedMax = 100;
Chart.defaults.scale.grid.display = false;
Chart.defaults.elements.point.radius = 0;
Chart.defaults.elements.line.tension = 0.25;
Chart.defaults.elements.line.fill = true;
Chart.defaults.elements.line.backgroundColor = "rgba(0, 0, 0, 0.1)";
Chart.defaults.datasets.line.fill = true;
Chart.defaults.datasets.line.backgroundColor = "rgba(0, 0, 0, 0.1)";


Chart.defaults.color = "white";

const dataPoints = 100;
const randRange = 5;
// 60FPS = 16.67ms
const updateInterval = 500;


const buttonClasses = "hover:bg-zinc-700 active:bg-zinc-800 px-3 rounded-md";
const backgroundColor = "#282B30";
const foregroundColor = "#424548";

export default function App() {
    const [opened, { open, close }] = useDisclosure(false);
    const [batteryPerc, setBatteryPerc] = useState(100);
    const [batteryTime, setBatteryTime] = useState(40); // in minutes
    const [coords, setCoords] = useState([30.769696, 76.577091]);
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
    const [mode, setMode] = useState("Manual");
    const [state, setState] = useState("Idle");
    const [cmdHistory, setCmdHistory] = useState(Array.from({ length: 25 }, () => "> "));
    const [expandedViewName, setExpandedViewName] = useState("");
    const batteryDiv = useRef();

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
                backgroundColor: "transparent",
                borderColor: "green",
                borderWidth: 2,
                pointRadius: 0,
                fill: true
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


    function sendCommand(e) {
        e.preventDefault();
        const cmd = e.target.parentElement.firstChild.value;
        setCmdHistory([cmd, ...cmdHistory]);
        e.target.parentElement.firstChild.value = "";
    }

    return <div className="h-screen overflow-hidden">
        <div className={`flex gap-2 flex-col bg-[#282B30]`}>
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
            <div className={`flex justify-between p-1 bg-[#424548]`}>
                <div className="flex gap-1 px-2">
                    <button className={buttonClasses}>File</button>
                    <button className={buttonClasses}>Settings</button>
                </div>
                <div className="font-semibold">Terra Droids GCS Software</div>
                <div className="invisible">File Settings</div>
            </div>
            <div className="">
                <div className="grid grid-cols-5 gap-2 px-2 mb-2">
                    <div className={`p-2 rounded bg-[${foregroundColor}] min-w-fit flex flex-col gap-1 row-span-1`}>
                        <div>
                            <div className="ring-1 ring-white/70 h-5 bg-gray-300/60 text-center text-sm font-bold text-black">
                                <div className={`h-full bg-lime-400 bottom-6`} ref={batteryDiv}></div>
                                <div className="relative bottom-5">{batteryPerc.toFixed(0)}% [{batteryTime}m]</div>
                            </div>
                            {/* ETD: {batteryTime}m */}
                        </div>
                        <div className="cursor-pointer"
                            onClick={() => { expand("temperature") }}>{temperatureData[temperatureData.length - 1]}°C</div>
                        <div className="cursor-pointer"
                            onClick={() => { expand("temperature") }}>{altitudeData[altitudeData.length - 1]}°C</div>
                        <div>23.32432°N 34.23542°E</div>
                        <div>Mode: {mode}</div>
                        <div>State: {state}</div>
                    </div>
                    <div className={`rounded flex flex-col justify-between p-2 bg-[${foregroundColor}] col-span-3 row-span-1 w-full`}>
                        <div className="bg-black/40 h-full rounded"></div>
                        <div className="font-bold text-center text-4xl uppercase">Ground Control System</div>
                    </div>
                    <div className={`rounded flex flex-col p-2 bg-[${foregroundColor}] min-w-fit row-span-1`}>
                        GPS Tracking<br />
                        <Map boxClassname="rounded h-full" height={300}
                            defaultCenter={coords}
                            center={coords}
                            defaultZoom={16} provider={osm}>
                            {/* <Marker width={10} color="red" anchor={coords} />
                            <Marker width={10} color="red" anchor={coords} /> */}
                            <Marker width={25} color="green" anchor={coords} />
                        </Map>
                    </div>
                </div>
                {/*  */}
                <div className="grid grid-cols-5 gap-2 px-2">
                    <div className={`rounded p-2 bg-[${foregroundColor}] flex flex-col gap-1 row-span-1`}>
                        <div>Commands</div>
                        <div className=" bg-black/20 rounded overflow-scroll px-1 flex flex-col-reverse">
                            {cmdHistory.map((cmd, i) => <div key={i}>{cmd}</div>)}
                        </div>
                        <div className="flex"><input className="w-full rounded-l px-1" placeholder="Command" />
                            <button className="p-1 bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-black rounded-r" onClick={sendCommand}>send</button>
                        </div>
                    </div>
                    <div className={`rounded p-2 bg-[${foregroundColor}] w-full col-span-3`}><div>Video Feed</div>
                        <div className="w-full h-[90%] bg-black/60 rounded">
                        </div>
                    </div>
                    <div className={`rounded p-2 bg-[${foregroundColor}] row-span-2`}><div className="font-bold">Maneuver Settings</div>
                        <div className="flex justify-between"><div>Auto Pilot</div><input type="checkbox" /></div>
                        <div className="flex justify-between"><div>Bomb Detect</div><input type="checkbox" /></div>
                        <div className="flex justify-between"><div>Sonar</div><input type="checkbox" /></div>
                        <div className="flex justify-between"><div>Lidar</div><input type="checkbox" /></div>
                        <div className="flex justify-between"><div>4WD</div><input type="checkbox" /></div>
                        <div className="flex justify-between"><div>Survey</div><input type="checkbox" /></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}