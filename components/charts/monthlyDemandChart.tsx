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

// 영어 월 이름을 숫자로 변환하는 함수
const monthNameToNumber = (monthName: string) => {
	const months = {
		January: 1,
		February: 2,
		March: 3,
		April: 4,
		May: 5,
		June: 6,
		July: 7,
		August: 8,
		September: 9,
		October: 10,
		November: 11,
		December: 12,
	};
	return months[monthName as keyof typeof months];
};

// Y축 값 포맷터 함수
const formatYAxis = (tickItem: number) => {
	if (tickItem >= 1000000) {
		return `${(tickItem / 1000000).toFixed(1)}M`; // 백만 단위
	} else if (tickItem >= 1000) {
		return `${(tickItem / 1000).toFixed(1)}K`; // 천 단위
	} else {
		return tickItem.toString();
	}
};

const MonthlyDemandChart: React.FC<MonthlyDemandChartProps> = ({
	polygonId,
}) => {
	const [data, setData] = useState<any[]>([]);

	useEffect(() => {
		const fetchMonthlyDemandData = async () => {
			try {
				const response = await axios.get(`/api/monthlyDemand/${polygonId}`);
				const { predictions } = response.data;

				// 받은 데이터를 차트에 맞게 포맷하고, 월을 숫자로 변환하여 정렬
				const formattedData = Object.keys(predictions)
					.map(month => ({
						month: `${monthNameToNumber(month)}월`, // 'August'를 '8월'로 변환
						demand: predictions[month],
						monthNumber: monthNameToNumber(month), // 정렬을 위한 숫자
					}))
					.sort((a, b) => a.monthNumber - b.monthNumber); // 월 숫자 기준으로 정렬

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
					bottom: 35, // 아래 여백을 늘려 legend 공간 확보
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="month" />
				<YAxis tickFormatter={formatYAxis} domain={['auto', 'auto']} />
				<Tooltip formatter={formatYAxis} />
				<Legend verticalAlign="bottom" align="center" layout="horizontal" />
				<Line
					type="monotone"
					dataKey="demand"
					stroke="#8884d8"
					name="월간 전력 수요량"
				/>
			</LineChart>
		</ResponsiveContainer>
	);
};

export default MonthlyDemandChart;
