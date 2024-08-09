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

interface MonthlyDemandChartProps {
	polygonId: string;
}

const generateXAxisLabels = () => {
	const labels = [];
	const now = new Date();
	for (let i = 0; i < 12; i++) {
		const label = new Date(
			now.getFullYear(),
			now.getMonth() + i,
		).toLocaleDateString('default', { year: 'numeric', month: 'short' });
		labels.push(label);
	}
	return labels;
};

const MonthlyDemandChart: React.FC<MonthlyDemandChartProps> = ({
	polygonId,
}) => {
	const [data, setData] = useState<any[]>([]);
	const xAxisLabels = generateXAxisLabels();

	useEffect(() => {
		const fetchMonthlyDemandData = async () => {
			try {
				const response = await axios.get(`/api/monthlyDemand/${polygonId}`);
				const formattedData = response.data.map((item: any, index: number) => ({
					month: xAxisLabels[index],
					demand: item.demand,
				}));
				setData(formattedData);
			} catch (error) {
				console.error('Error fetching monthly demand data:', error);
			}
		};

		fetchMonthlyDemandData();
	}, [polygonId]);

	return (
		<ResponsiveContainer width="100%" height={300}>
			<LineChart
				data={data}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="month" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Line type="monotone" dataKey="demand" stroke="#8884d8" />
			</LineChart>
		</ResponsiveContainer>
	);
};

export default MonthlyDemandChart;
