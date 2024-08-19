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
	supply_capacity: number;
	supply_reserve_power: number;
	supply_reserve_rate: number;
	max_predicted_demand: number;
}

const formatTime = (dateString: string) => {
	const date = new Date(dateString);
	let hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12;
	const strMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
	const strTime = `${hours}:${strMinutes} ${ampm}`;
	return strTime;
};

const ElectricDemandChart: React.FC = () => {
	const [chartData, setChartData] = useState<DataPoint[]>([]);
	const [showCurrentDemand, setShowCurrentDemand] = useState(true);
	const [showSupplyCapacity, setShowSupplyCapacity] = useState(true);
	const [showSupplyReservePower, setShowSupplyReservePower] = useState(true);
	const [showSupplyReserveRate, setShowSupplyReserveRate] = useState(true);
	const [showMaxPredictedDemand, setShowMaxPredictedDemand] = useState(true);
	const [currentTime, setCurrentTime] = useState<string>('');
	const [currentDate, setCurrentDate] = useState<string>('');

	const fetchData = async () => {
		try {
			const response = await axios.get('/api/electricRuntimeKoreaDemandData');
			console.log('API 응답 데이터:', response.data);

			const formattedData = response.data.map((item: any) => ({
				datetime: formatTime(item.datetime),
				current_demand: item.current_demand,
				supply_capacity: item.supply_capacity,
				supply_reserve_power: item.supply_reserve_power,
				supply_reserve_rate: item.supply_reserve_rate,
				max_predicted_demand: item.max_predicted_demand,
			}));

			setChartData(formattedData);
		} catch (error) {
			console.error('데이터 가져오기 오류:', error);
		}
	};

	useEffect(() => {
		fetchData();

		const dataInterval = setInterval(
			() => {
				fetchData();
			},
			5 * 60 * 1000,
		);

		return () => {
			clearInterval(dataInterval);
		};
	}, []);

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

		const timeInterval = setInterval(updateTime, 1000);

		return () => {
			clearInterval(timeInterval);
		};
	}, []);

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
					{showCurrentDemand && (
						<Line
							type="monotone"
							dataKey="current_demand"
							stroke="#8884d8"
							activeDot={{ r: 8 }}
							name="전력 수요량"
						/>
					)}
					{showSupplyCapacity && (
						<Line
							type="monotone"
							dataKey="supply_capacity"
							stroke="#82ca9d"
							name="공급 용량"
						/>
					)}
					{showSupplyReservePower && (
						<Line
							type="monotone"
							dataKey="supply_reserve_power"
							stroke="#ff7300"
							name="공급 예비 전력"
						/>
					)}
					{showSupplyReserveRate && (
						<Line
							type="monotone"
							dataKey="supply_reserve_rate"
							stroke="#387908"
							name="공급 예비율"
						/>
					)}
					{showMaxPredictedDemand && (
						<Line
							type="monotone"
							dataKey="max_predicted_demand"
							stroke="#FF0000" // 색상을 빨간색으로 변경하여 구분
							name="최대 예측 수요"
						/>
					)}
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
				<label
					style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}
				>
					<input
						type="checkbox"
						checked={showCurrentDemand}
						onChange={() => setShowCurrentDemand(!showCurrentDemand)}
						style={{ marginRight: '5px' }}
					/>
					전력 수요량
				</label>
				<label
					style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}
				>
					<input
						type="checkbox"
						checked={showSupplyCapacity}
						onChange={() => setShowSupplyCapacity(!showSupplyCapacity)}
						style={{ marginRight: '5px' }}
					/>
					공급 용량
				</label>
				<label
					style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}
				>
					<input
						type="checkbox"
						checked={showSupplyReservePower}
						onChange={() => setShowSupplyReservePower(!showSupplyReservePower)}
						style={{ marginRight: '5px' }}
					/>
					공급 예비 전력
				</label>
				<label
					style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}
				>
					<input
						type="checkbox"
						checked={showSupplyReserveRate}
						onChange={() => setShowSupplyReserveRate(!showSupplyReserveRate)}
						style={{ marginRight: '5px' }}
					/>
					공급 예비율
				</label>
				<label
					style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}
				>
					<input
						type="checkbox"
						checked={showMaxPredictedDemand}
						onChange={() => setShowMaxPredictedDemand(!showMaxPredictedDemand)}
						style={{ marginRight: '5px' }}
					/>
					최대 예측 수요
				</label>
			</div>
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
	);
};

export default ElectricDemandChart;
