import React from 'react';
import styles from './userSimulationResultModal.module.css';

interface UserSimulationResultModalProps {
	result: any;
	onClose: () => void;
}

const UserSimulationResultModal: React.FC<UserSimulationResultModalProps> = ({
	result,
	onClose,
}) => {
	return (
		<div className={styles.modal}>
			<div className={styles.modalContent}>
				<span className={styles.close} onClick={onClose}>
					&times;
				</span>
				<div className={styles.modalHeader}>시뮬레이션 결과</div>
				<div className={styles.modalBody}>
					<p>전력 수요량 (current_demand): {result.current_demand} MW</p>
					<p>
						예상 최대 전력 수요량 (max_predicted_demand):{' '}
						{result.max_predicted_demand} MW
					</p>
					<p>공급 용량 (supply_capacity): {result.supply_capacity} MW</p>
				</div>
				<div className={styles.modalFooter}>
					<button className={styles.modalButton} onClick={onClose}>
						닫기
					</button>
				</div>
			</div>
		</div>
	);
};

export default UserSimulationResultModal;
