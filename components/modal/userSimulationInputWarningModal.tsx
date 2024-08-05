import React from 'react';
import styles from './userSimulationInputWarningModal.module.css';

const UserSimulationInputWarningModal: React.FC<{
	onClose: () => void;
	onConfirm: () => void;
}> = ({ onClose, onConfirm }) => {
	return (
		<div className={styles.modal}>
			<div className={styles.modalContent}>
				<span className={styles.close} onClick={onClose}>
					&times;
				</span>
				<div className={styles.modalHeader}>설정값이 비어있습니다!</div>
				<div className={styles.modalBody}>
					일부 설정값이 비어있습니다.
					<br />
					기본값으로 설정하고 계속하시겠습니까?
				</div>
				<div className={styles.modalFooter}>
					<button className={styles.modalButton} onClick={onConfirm}>
						예
					</button>
					<button className={styles.modalButton} onClick={onClose}>
						아니오
					</button>
				</div>
			</div>
		</div>
	);
};

export default UserSimulationInputWarningModal;
