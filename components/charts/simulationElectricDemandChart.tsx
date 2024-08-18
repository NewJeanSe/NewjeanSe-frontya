import React, { useEffect, useState } from 'react';
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
	supply_capacity: number;
	supply_reserve_power: number;
	supply_reserve_rate: number;
}

const SimulationElectricDemandChart: React.FC<{ data: any | null }> = ({
	data,
}) => {
	const [chartData, setChartData] = useState<DataPoint[]>([]);
	const [currentTime, setCurrentTime] = useState<string>('');
	const [currentDate, setCurrentDate] = useState<string>('');

	useEffect(() => {
		if (data) {
			// 서버로부터 받은 데이터를 가공하여 chartData에 저장
			const supply_reserve_power = data.supply_capacity - data.current_demand;
			const supply_reserve_rate =
				(supply_reserve_power / data.supply_capacity) * 100;

			const formattedData: DataPoint = {
				datetime: new Date().toLocaleTimeString(),
				current_demand: data.current_demand,
				supply_capacity: data.supply_capacity,
				supply_reserve_power: supply_reserve_power,
				supply_reserve_rate: supply_reserve_rate,
			};

			setChartData([formattedData]);
		}
	}, [data]);

	useEffect(() => {
		const updateTime = () => {
			setCurrentTime(new Date().toLocaleTimeString());
			setCurrentDate(
				new Date().toLocaleDateString('ko-KR', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				}),
			);
		};

		updateTime();
		const interval = setInterval(updateTime, 1000);

		return () => clearInterval(interval);
	}, []);

	// 최대부하전망 단계 계산 함수
	const getMaxLoadForecastStage = (supplyReservePower: number) => {
		if (supplyReservePower >= 5500) {
			return { stage: '정상', color: 'black' };
		} else if (supplyReservePower >= 4500) {
			return { stage: '준비', color: 'green' };
		} else if (supplyReservePower >= 3500) {
			return { stage: '관심', color: 'blue' };
		} else if (supplyReservePower >= 2500) {
			return { stage: '주의', color: 'yellow' };
		} else if (supplyReservePower >= 1500) {
			return { stage: '경계', color: 'orange' };
		} else {
			return { stage: '심각', color: 'red' };
		}
	};

	// 최대전력 및 해당 시간 계산
	const maxDemandData = chartData.reduce(
		(max, item) => (item.current_demand > max.current_demand ? item : max),
		{ datetime: '', current_demand: 0 },
	);

	const currentSupplyReservePower = chartData.length
		? chartData[chartData.length - 1].supply_reserve_power
		: 0;

	const maxLoadForecastStage = getMaxLoadForecastStage(
		currentSupplyReservePower,
	);

	return (
		<div>
			<ResponsiveContainer width={750} height={590}>
				<LineChart
					data={chartData}
					margin={{
						top: 50,
						right: 30,
						left: 20,
						bottom: 50,
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
						name="전력 수요량"
					/>
					<Line
						type="monotone"
						dataKey="supply_capacity"
						stroke="#82ca9d"
						name="공급 용량"
					/>
					<Line
						type="monotone"
						dataKey="supply_reserve_power"
						stroke="#ff7300"
						name="공급 예비 전력"
					/>
					<Line
						type="monotone"
						dataKey="supply_reserve_rate"
						stroke="#387908"
						name="공급 예비율"
					/>
				</LineChart>
			</ResponsiveContainer>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					marginTop: '10px',
					whiteSpace: 'nowrap',
				}}
			>
				<div
					style={{
						marginTop: '20px',
						textAlign: 'center',
						fontSize: '18px',
						lineHeight: '1.6',
					}}
				>
					<div style={{ marginBottom: '10px' }}>
						현재 시각: <strong>{currentTime}</strong>
					</div>
					<div style={{ marginBottom: '10px' }}>
						최대부하전망 단계:{' '}
						<strong style={{ color: maxLoadForecastStage.color }}>
							{maxLoadForecastStage.stage}
						</strong>
					</div>
					<div style={{ marginBottom: '10px' }}>
						최대전력 발생 시간: <strong>{maxDemandData.datetime}</strong>
					</div>
					<div style={{ marginBottom: '10px' }}>
						최대전력:{' '}
						<strong>{maxDemandData.current_demand.toLocaleString()} MW</strong>
					</div>
					<div style={{ marginBottom: '10px' }}>
						<strong>{currentDate}</strong>은 전력수급이{' '}
						<strong style={{ color: 'green' }}>안정적</strong>일 것으로
						예상됩니다.
					</div>
				</div>
			</div>
		</div>
	);
};

export default SimulationElectricDemandChart;
