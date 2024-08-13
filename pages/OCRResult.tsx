import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/OCRResult/OCRResult.module.css';
import HeaderBar from '@/components/mainMap/headerBar';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid'; // UUID 생성기

// OCR 결과 데이터의 타입 정의
interface OCRResultData {
	imagePath: string;
	imageName: string;
	dueDate: string;
	amountDue: number;
	powerUsage: number;
}

const OCRResult: React.FC = () => {
	const router = useRouter();
	const { result } = router.query;

	const hasRunRef = useRef(false);

	let resultData: OCRResultData | null = null;
	if (result) {
		try {
			resultData = JSON.parse(result as string) as OCRResultData;
		} catch (e) {
			console.error('Failed to parse result JSON', e);
			resultData = null;
		}
	}

	const imageUrl = resultData ? resultData.imagePath : '';
	const imageName = resultData ? resultData.imageName : 'Unknown Image';
	const dueDate = resultData ? resultData.dueDate : 'Unknown';
	const amountDue = resultData ? resultData.amountDue : 1;
	const powerUsage = resultData ? resultData.powerUsage : 1;

	// OCR 데이터를 서버로 전송하여 데이터베이스에 추가
	useEffect(() => {
		if (resultData && !hasRunRef.current) {
			hasRunRef.current = true;
			const addBillData = async () => {
				const response = await fetch('/api/database', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						id: uuidv4(), // 고유 ID 추가
						name: imageName,
						type: 'bill',
						dueDate,
						amountDue,
						powerUsage,
					}),
				});

				if (response.ok) {
					console.log('Data added successfully');
				} else {
					const errorData = await response.json();
					console.error('Failed to add bill data', errorData);
				}
			};

			addBillData();
		}
	}, [resultData, imageName, dueDate, amountDue, powerUsage]);

	return (
		<div>
			<HeaderBar showSidebarToggle={false} />
			<div className={styles.content}>
				<h2>OCR 결과창</h2>
				<div className={styles.resultContainer}>
					{imageUrl && (
						<div className={styles.imageContainer}>
							<div className={styles.imageWrapper}>
								<div className={styles.imageName}>{imageName}</div>
								<Image
									src={imageUrl}
									alt="Uploaded file"
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
							<span className={styles.detailValue}>{dueDate}</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>청구 금액 :</span>
							<span className={styles.detailValue}>{amountDue} 원</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>사용 전력량 :</span>
							<span className={styles.detailValue}>{powerUsage} kW/h</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OCRResult;
