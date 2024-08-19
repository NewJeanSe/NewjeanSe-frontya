import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import styles from '../styles/simulation/userSimulation.module.css';
import UserDBHeaderBar from '@/components/userDB/userDBHeaderBar';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';

const UserSimulation: React.FC = () => {
	const router = useRouter();
	const {
		supply_capacity,
		current_demand,
		max_predicted_demand,
		supply_reserve_power,
		supply_reserve_rate,
	} = router.query;

	const [isSidebarVisible, setIsSidebarVisible] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	const handleToggleSidebar = () => {
		setIsSidebarVisible(!isSidebarVisible);
	};

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// 데이터 배열 생성 (공급 예비율은 차트에서 제외)
	const data = [
		{
			name: '공급 용량',
			value: parseFloat(supply_capacity as string),
		},
		{
			name: '현재 수요',
			value: parseFloat(current_demand as string),
		},
		{
			name: '최대 예측 수요',
			value: parseFloat(max_predicted_demand as string),
		},
		{
			name: '공급 예비 전력',
			value: parseFloat(supply_reserve_power as string),
		},
	];

	if (!isMounted) {
		return null; // 클라이언트가 마운트되기 전까지 아무것도 렌더링하지 않음
	}

	return (
		<div className={styles.container}>
			<UserDBHeaderBar
				onToggleSidebar={handleToggleSidebar}
				isSidebarVisible={isSidebarVisible}
			/>
			<div className={styles.content}>
				<div className={styles.chartWrapper}>
					<h1 className={styles.title}>시뮬레이션 결과</h1>
					<ResponsiveContainer width="100%" height={400}>
						<BarChart
							data={data}
							margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis tickFormatter={value => `${value}`} />
							<Tooltip formatter={(value, name) => `${value} kW/H`} />
							<Legend />
							<Bar dataKey="value" fill="#8884d8" />
						</BarChart>
					</ResponsiveContainer>
				</div>
				<div className={styles.textWrapper}>
					<h2>공급 예비율: {parseFloat(supply_reserve_rate as string)}%</h2>
				</div>
			</div>
		</div>
	);
};

export default UserSimulation;
