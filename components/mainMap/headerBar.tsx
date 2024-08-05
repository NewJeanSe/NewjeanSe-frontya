import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from './headerBar.module.css';
import UserSimulationInputModal from '../modal/userSimulationInputModal';
import SelectOCRImageModal from '../modal/selectOCRImageModal';

const HeaderBar: React.FC<{
	onToggleSidebar: () => void;
	isSidebarVisible: boolean;
}> = ({ onToggleSidebar, isSidebarVisible }) => {
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

	return (
		<div className={styles.headerBar}>
			<span className={styles.userName}>User&apos;s Nickname</span>
			<div className={styles.divider}></div>
			<label className={styles.sidebarToggle}>
				<input
					type="checkbox"
					checked={!isSidebarVisible}
					onChange={onToggleSidebar}
				/>
				사이드바 숨기기
			</label>
			<div className={styles.headerButtons}>
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
					우리 집 전기 요금 예측하기
				</button>
			</div>

			{showSimulationModal && (
				<UserSimulationInputModal onClose={closeSimulationModal} />
			)}
			{showOCRModal && <SelectOCRImageModal onClose={closeOCRModal} />}
		</div>
	);
};

export default HeaderBar;
