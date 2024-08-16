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
	datetime: string;
	current_demand: number;
}

const formatTime = (dateString: string) => {
	const date = new Date(dateString);
	let hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	const strMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
	const strTime = `${hours}:${strMinutes} ${ampm}`; // 템플릿 리터럴 사용
	return strTime;
};

const ElectricDemandChart: React.FC = () => {
	const [chartData, setChartData] = useState<DataPoint[]>([]);

	const fetchData = async () => {
		try {
			const response = await axios.get('/api/electricRuntimeKoreaDemandData');
			console.log('API 응답 데이터:', response.data);

			// 데이터를 적절히 가공합니다.
			const formattedData = response.data.map((item: any) => ({
				datetime: formatTime(item.datetime),
				current_demand: item.current_demand,
			}));

			setChartData(formattedData);
		} catch (error) {
			console.error('데이터 가져오기 오류:', error);
		}
	};

	useEffect(() => {
		fetchData(); // Fetch initial data

		const dataInterval = setInterval(
			() => {
				fetchData();
			},
			5 * 60 * 1000,
		); // Fetch data every 5 minutes

		return () => {
			clearInterval(dataInterval);
		};
	}, []);

	console.log('차트 데이터:', chartData);

	return (
		<ResponsiveContainer width="100%" height={500}>
			<LineChart
				data={chartData}
				margin={{
					top: 50,
					right: 30,
					left: 20,
					bottom: 5,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="datetime" minTickGap={20} />
				<YAxis />
				<Tooltip />
				<Legend />
				<Line
					type="monotone"
					dataKey="current_demand"
					stroke="#8884d8"
					activeDot={{ r: 8 }}
					name="실시간 전국 예측 전력 수요량"
				/>
			</LineChart>
		</ResponsiveContainer>
	);
};

export default ElectricDemandChart;
