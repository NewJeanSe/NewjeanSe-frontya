import { GetServerSideProps } from 'next';
import path from 'path';
import fs from 'fs';
import React, { useState } from 'react';
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
	const [isEditing, setIsEditing] = useState(false);
	const [dueDate, setDueDate] = useState(bill?.dueDate || '');
	const [amountDue, setAmountDue] = useState(bill?.amountDue || 0);
	const [powerUsage, setPowerUsage] = useState(bill?.powerUsage || 0);

	const handleEditClick = async () => {
		if (isEditing) {
			// 수정된 데이터 저장
			await fetch('/api/database', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: bill?.id,
					dueDate,
					amountDue,
					powerUsage,
				}),
			});

			// 수정된 값들을 상태에 반영하여 UI 갱신
			bill!.dueDate = dueDate;
			bill!.amountDue = amountDue;
			bill!.powerUsage = powerUsage;
		}
		setIsEditing(!isEditing);
	};

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
							{isEditing ? (
								<input
									type="text"
									value={dueDate}
									onChange={e => setDueDate(e.target.value)}
									className={styles.inputField}
								/>
							) : (
								<span className={styles.detailValue}>{dueDate}</span>
							)}
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>청구 금액 :</span>
							{isEditing ? (
								<input
									type="number"
									value={amountDue}
									onChange={e => setAmountDue(Number(e.target.value))}
									className={styles.inputField}
								/>
							) : (
								<span className={styles.detailValue}>
									{amountDue.toLocaleString()} 원
								</span>
							)}
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>사용 전력량 :</span>
							{isEditing ? (
								<input
									type="number"
									value={powerUsage}
									onChange={e => setPowerUsage(Number(e.target.value))}
									className={styles.inputField}
								/>
							) : (
								<span className={styles.detailValue}>
									{powerUsage.toLocaleString()} kW/h
								</span>
							)}
						</div>
					</div>
					<div className={styles.divider} />

					{/* 데이터 수정하기 버튼 */}
					<div className={styles.editButtonContainer}>
						<button
							className={`${styles.editButton} ${isEditing ? styles.editing : ''}`}
							onClick={handleEditClick}
						>
							<Image
								src="/images/userDB/데이터 수정하기.svg"
								alt="Edit Data"
								className={styles.editButtonIcon}
								width={20}
								height={20}
							/>
							{isEditing ? '수정 완료' : '데이터 수정하기'}
						</button>
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
