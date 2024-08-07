// components/charts/electricDemandChart.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';

interface DataPoint {
	x: string;
	y: number;
}

const ElectricDemandChart: React.FC = () => {
	const [data, setData] = useState<DataPoint[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get('/api/electricRuntimeKoreaDemandData');
				const newPoint = {
					x: new Date(response.data.timestamp * 1000).toLocaleTimeString(),
					y: response.data.power,
				};
				setData(prevData => [...prevData, newPoint]);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData(); // 초기 데이터 가져오기
		const interval = setInterval(fetchData, 5 * 60 * 1000); // 5분마다 데이터 가져오기

		return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 클리어
	}, []);

	return (
		<ResponsiveContainer width="100%" height={500}>
			<LineChart
				data={data}
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
				/>
			</LineChart>
		</ResponsiveContainer>
	);
};

export default ElectricDemandChart;
