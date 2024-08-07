import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  x: string;
  y: number;
}

const formatTime = (date: Date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strMinutes = minutes < 10 ? "0" + minutes : minutes.toString();
  const strTime = ampm + " " + hours + ":" + strMinutes;
  return strTime;
};

const generateInitialXAxisLabels = () => {
  const labels = [];
  const now = new Date();
  labels.push(formatTime(now)); // 현재 시간을 첫 번째 값으로 추가
  for (let i = 1; i <= 36; i++) {
    // 3시간 = 36 * 5분
    const label = new Date(now.getTime() + i * 5 * 60 * 1000);
    labels.push(formatTime(label));
  }
  return labels;
};

const ElectricDemandChart: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [predictedData, setPredictedData] = useState<DataPoint[]>([]);
  const [xAxisLabels, setXAxisLabels] = useState<string[]>(
    generateInitialXAxisLabels()
  );

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/electricRuntimeKoreaDemandData");
      const newPoint: DataPoint = {
        x: formatTime(new Date()),
        y: response.data.power,
      };
      setData((prevData) => [...prevData, newPoint]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPredictionData = async () => {
    try {
      const response = await axios.get("/api/electricRuntimeKoreaDemandData");
      const predictionPoints = response.data.map(
        (point: number[], index: number) => ({
          x: xAxisLabels[index],
          y: point[1], // Assuming the data structure is [[...], [...], ...]
        })
      );
      setPredictedData(predictionPoints);
    } catch (error) {
      console.error("Error fetching prediction data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch initial data
    fetchPredictionData(); // Fetch initial prediction data

    const dataInterval = setInterval(
      () => {
        fetchData();
        fetchPredictionData();

        setXAxisLabels((prevLabels) => {
          const newLabels = prevLabels.slice(1);
          const newLabel = formatTime(
            new Date(
              new Date(prevLabels[prevLabels.length - 1]).getTime() +
                5 * 60 * 1000
            )
          );
          newLabels.push(newLabel);
          return newLabels;
        });
      },
      5 * 60 * 1000
    ); // Fetch data every 5 minutes

    return () => {
      clearInterval(dataInterval);
    };
  }, []);

  const combinedData = data.concat(predictedData).slice(0, 36);

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart
        data={combinedData}
        margin={{
          top: 50,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" minTickGap={20} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="y"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          name="Predicted Data"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ElectricDemandChart;
