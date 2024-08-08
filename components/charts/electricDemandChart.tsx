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
  const strTime = `${hours}:${strMinutes} ${ampm}`; // 템플릿 리터럴 사용
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
  const [realTimeData, setRealTimeData] = useState<DataPoint[]>([]);
  const [predictionData, setPredictionData] = useState<DataPoint[]>([]);
  const [xAxisLabels, setXAxisLabels] = useState<string[]>(
    generateInitialXAxisLabels()
  );

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/electricRuntimeKoreaDemandData");
      console.log("API 응답 데이터:", response.data);
      const newPoint: DataPoint = {
        x: formatTime(new Date()),
        y: response.data.power,
      };
      console.log("실시간 데이터 포인트:", newPoint);
      setRealTimeData((prevData) => [...prevData, newPoint]);
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
    }
  };

  const fetchPredictionData = async () => {
    try {
      const response = await axios.get("/api/electricRuntimeKoreaDemandData");
      console.log("예측 API 응답 데이터:", response.data);
      const predictionPoints = response.data.map(
        (point: number[], index: number) => ({
          x: xAxisLabels[index + 1], // 첫 번째 라벨은 실시간 데이터가 사용하므로 그 다음부터 시작
          y: point[1], // Assuming the data structure is [[time, value], [...], ...]
        })
      );
      setPredictionData(predictionPoints);
    } catch (error) {
      console.error("예측 데이터 가져오기 오류:", error);
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

  const combinedData = [...realTimeData, ...predictionData];

  console.log("전체 데이터:", combinedData);

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
          name="실시간 전국 예측 전력 수요량"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ElectricDemandChart;
