import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '@/components/mainMap/headerBar.module.css'; // 새로운 CSS 파일 경로로 변경
import UserSimulationInputModal from '../modal/userSimulationInputModal';
import SelectOCRImageModal from '../modal/selectOCRImageModal';

const UserDBHeaderBar: React.FC<{
	onToggleSidebar: () => void;
	isSidebarVisible: boolean;
	children?: React.ReactNode;
}> = ({ onToggleSidebar, isSidebarVisible, children }) => {
	const router = useRouter();
	const [showSimulationModal, setShowSimulationModal] = useState(false);
	const [showOCRModal, setShowOCRModal] = useState(false);

	const handleUserSettingsClick = () => {
		router.push('/userSettings');
	};

	const handleUserDataBaseClick = () => {
		router.push('/userDataBaseMain');
	};

	const handleUserSimulationClick = () => {
		setShowSimulationModal(true);
	};

	const handleOCRClick = () => {
		setShowOCRModal(true);
	};

	const closeSimulationModal = () => {
		setShowSimulationModal(false);
	};

	const closeOCRModal = () => {
		setShowOCRModal(false);
	};

	const handleMainMapClick = () => {
		router.push('/mainMap');
	};

	return (
		<div className={styles.headerBar}>
			<span className={styles.userName}>User&apos;s Nickname</span>
			<div className={styles.divider}></div>
			<div className={styles.headerButtons}>
				<button className={styles.headerButton} onClick={handleMainMapClick}>
					<Image
						src="/images/mainMap/페이지 돌아가기.png"
						alt="Main Map Icon"
						className={styles.icon}
						width={20}
						height={20}
					/>
					Main Map 으로 이동하기
				</button>
				{children}
				<button
					className={styles.headerButton}
					onClick={handleUserSettingsClick}
				>
					<Image
						src="/images/mainMap/settings.png"
						alt="Settings Icon"
						className={styles.icon}
						width={20}
						height={20}
					/>
					사용자 설정 변경
				</button>
				<button
					className={styles.headerButton}
					onClick={handleUserDataBaseClick}
				>
					<Image
						src="/images/mainMap/database.png"
						alt="Database Icon"
						className={styles.icon}
						width={20}
						height={20}
					/>
					사용자 설정 데이터베이스
				</button>
				<button
					className={styles.headerButton}
					onClick={handleUserSimulationClick}
				>
					<Image
						src="/images/mainMap/simulation.png"
						alt="Simulation Icon"
						className={styles.icon}
						width={20}
						height={20}
					/>
					사용자 설정값 기반 예측 시뮬레이션
				</button>
				<button className={styles.headerButton} onClick={handleOCRClick}>
					<Image
						src="/images/mainMap/ocr.png"
						alt="OCR Icon"
						className={styles.icon}
						width={20}
						height={20}
					/>
					우리 집 전기 요금 기록하기
				</button>
			</div>

			{showSimulationModal && (
				<UserSimulationInputModal onClose={closeSimulationModal} />
			)}
			{showOCRModal && <SelectOCRImageModal onClose={closeOCRModal} />}
		</div>
	);
};

export default UserDBHeaderBar;
