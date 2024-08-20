import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/OCRResult/OCRResult.module.css';
import HeaderBar from '@/components/mainMap/headerBar';

interface OCRResultData {
	imagePath: string;
	imageName: string;
	dueDate: string;
	amountDue: number;
	powerUsage: number;
}

// 납기일 변환 함수
const convertDateToYYYYMMDD = (dateString: string): string => {
	const datePattern = /(\d{4})년(\d{2})월(\d{2})일/;
	const match = dateString.match(datePattern);

	if (match) {
		const year = match[1];
		const month = match[2];
		const day = match[3];
		return `${year}-${month}-${day}`;
	}

	return dateString; // 변환 실패 시 원래 문자열 반환
};

const OCRResult: React.FC = () => {
	const router = useRouter();
	const { result } = router.query;

	let resultData: OCRResultData | null = null;
	if (result) {
		try {
			const parsedResult = JSON.parse(result as string);

			resultData = {
				imagePath: parsedResult.imagePath,
				imageName: parsedResult.imageName,
				dueDate: convertDateToYYYYMMDD(parsedResult.dueDate), // 날짜 변환 적용
				amountDue: parseFloat(parsedResult.amountDue.replace(/,/g, '')), // 쉼표 제거 후 숫자형으로 변환
				powerUsage: parseFloat(parsedResult.powerUsage), // 숫자형으로 변환
			};
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
								<img
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
							<span className={styles.detailValue}>
								{amountDue.toLocaleString()} 원
							</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>사용 전력량 :</span>
							<span className={styles.detailValue}>
								{powerUsage.toLocaleString()} kW/h
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OCRResult;
