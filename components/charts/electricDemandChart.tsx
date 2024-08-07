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

const generateInitialXAxisLabels = () => {
  const labels = [];
  const now = new Date();
  for (let i = 0; i < 36; i++) {
    // 3시간 = 36 * 5분
    const label = new Date(
      now.getTime() + i * 5 * 60 * 1000
    ).toLocaleTimeString();
    labels.push(label);
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
        x: new Date().toLocaleTimeString(),
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
          const newLabel = new Date(
            new Date(prevLabels[prevLabels.length - 1]).getTime() +
              5 * 60 * 1000
          ).toLocaleTimeString();
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

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart
        data={[...data, ...predictedData]}
        margin={{
          top: 50,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" />
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
