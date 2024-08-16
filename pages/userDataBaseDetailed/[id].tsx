import React from 'react';
import { GetServerSideProps } from 'next';
import path from 'path';
import fs from 'fs';

import styles from '@/styles/userDB/userDataBaseDetailed.module.css'; // 새로운 CSS 파일 경로로 변경
import OCRDataBaseHeaderBar from '@/components/userDB/OCRDataBaseHeaderBar';

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
				<h1>{district.name} 테이블의 상세 페이지</h1>
				<p>생성일자: {district.createdDate}</p>
				<p>업데이트 일자: {district.updatedDate}</p>
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
