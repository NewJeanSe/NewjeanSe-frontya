import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/OCRResult/OCRResult.module.css';
import HeaderBar from '@/components/mainMap/headerBar';

const OCRResult: React.FC = () => {
	const router = useRouter();
	const { result } = router.query;

	let resultData;
	if (result) {
		try {
			resultData = JSON.parse(result as string);
		} catch (e) {
			console.error('Failed to parse result JSON', e);
			resultData = null;
		}
	}

	const imageUrl = resultData ? resultData.imagePath : '';
	const imageName = resultData ? resultData.imageName : 'Unknown Image';
	const dueDate = resultData ? resultData.dueDate : 'Unknown';
	const amountDue = resultData ? resultData.amountDue : 0;
	const powerUsage = resultData ? resultData.powerUsage : 0;

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
