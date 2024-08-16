import React from 'react';
import { GetServerSideProps } from 'next';
import path from 'path';
import fs from 'fs';

import styles from '@/styles/userDB/userDataBaseDetailed.module.css'; // 새로운 CSS 파일 경로로 변경
import OCRDataBaseHeaderBar from '@/components/userDB/OCRDataBaseHeaderBar';
import MonthlyDemandChart from '@/components/charts/monthlyDemandChart'; // MonthlyDemandChart 컴포넌트 가져오기

interface DistrictDetailProps {
	district: {
		id: string;
		name: string;
		createdDate: string;
		updatedDate: string;
	} | null;
}

const DistrictDetail: React.FC<DistrictDetailProps> = ({ district }) => {
	if (!district) {
		return <div>해당 데이터를 찾을 수 없습니다.</div>;
	}

	return (
		<div className={styles.container}>
			<OCRDataBaseHeaderBar
				onToggleSidebar={() => {}}
				isSidebarVisible={false}
			/>
			<div className={styles.content}>
				<div className={styles.detailContainer}>
					<h1 className={styles.title}>{district.name} 테이블의 상세 페이지</h1>

					{/* Divider 추가 */}
					<div className={styles.divider}></div>

					{/* MonthlyDemandChart 컴포넌트를 이 위치에 추가합니다 */}
					<div className={styles.chartContainer}>
						<MonthlyDemandChart polygonId={district.id} />
					</div>
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async context => {
	const { id } = context.params!;
	const databaseFilePath = path.join(process.cwd(), 'data', 'database.json');
	const data = JSON.parse(fs.readFileSync(databaseFilePath, 'utf8'));

	const district =
		data.districts.find((district: any) => district.id === id) || null;

	return {
		props: {
			district,
		},
	};
};

export default DistrictDetail;
