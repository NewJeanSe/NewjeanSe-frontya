import { GetServerSideProps } from 'next';
import path from 'path';
import fs from 'fs';
import React from 'react';
import Image from 'next/image';
import styles from '@/styles/OCRResult/OCRResult.module.css';
import OCRDataBaseHeaderBar from '@/components/userDB/OCRDataBaseHeaderBar';

interface BillDetailProps {
	bill: {
		id: string;
		name: string;
		imagePath: string;
		dueDate: string;
		amountDue: number;
		powerUsage: number;
	} | null;
}

const BillDetail: React.FC<BillDetailProps> = ({ bill }) => {
	if (!bill) {
		return <div>해당 데이터를 찾을 수 없습니다.</div>;
	}

	return (
		<div>
			<OCRDataBaseHeaderBar
				onToggleSidebar={() => {}} // 적절한 핸들러를 여기에 추가하세요
				isSidebarVisible={false} // 필요에 따라 값을 조정하세요
			/>
			<div className={styles.content}>
				<h2>{bill.name}의 상세 페이지</h2>
				<div className={styles.resultContainer}>
					{bill.imagePath && (
						<div className={styles.imageContainer}>
							<div className={styles.imageWrapper}>
								<div className={styles.imageName}>{bill.name}</div>
								<Image
									src={bill.imagePath}
									alt={bill.name}
									className={styles.image}
									width={500}
									height={500}
								/>
							</div>
						</div>
					)}
					<div className={styles.divider} />
					<div className={styles.detailsContainer}>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>납기일 :</span>
							<span className={styles.detailValue}>{bill.dueDate}</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>청구 금액 :</span>
							<span className={styles.detailValue}>{bill.amountDue} 원</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>사용 전력량 :</span>
							<span className={styles.detailValue}>{bill.powerUsage} kW/h</span>
						</div>
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

	const bill = data.bills.find((bill: any) => bill.id === id) || null;

	return {
		props: {
			bill,
		},
	};
};

export default BillDetail;
