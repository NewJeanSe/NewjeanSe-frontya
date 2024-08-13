import React from 'react';
import styles from './userDBModal.module.css';

const DeleteUserDBModal: React.FC<{
	onClose: () => void;
	onConfirm: () => void;
	selectedItems: string[];
	selectedItemNames: string[]; // 새로운 props 추가
}> = ({ onClose, onConfirm, selectedItems, selectedItemNames }) => {
	return (
		<div className={styles.modal}>
			<div className={styles.modalContent}>
				<span className={styles.close} onClick={onClose}>
					&times;
				</span>
				<div className={styles.modalHeader}>목록 삭제</div>
				<div className={styles.modalBody}>
					{selectedItems.length > 1
						? `선택한 ${selectedItems.length}개의 목록을 삭제하시겠습니까?`
						: `목록 "${selectedItemNames[0]}"을(를) 삭제하시겠습니까?`}
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

export default DeleteUserDBModal;
