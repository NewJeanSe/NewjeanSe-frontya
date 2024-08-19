import React from 'react';
import styles from './userSimulationInputWarningModal.module.css';

interface UserSimulationInputWarningModalProps {
	onClose: () => void;
	onConfirm: () => void;
}

const UserSimulationInputWarningModal: React.FC<
	UserSimulationInputWarningModalProps
> = ({ onClose, onConfirm }) => {
	return (
		<div className={styles.modal}>
			<div className={styles.modalContent}>
				<span className={styles.close} onClick={onClose}>
					&times;
				</span>
				<div className={styles.modalHeader}>경고</div>
				<div className={styles.modalBody}>
					<p>입력된 값이 일부 비어 있습니다. 기본값으로 진행할까요?</p>
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
