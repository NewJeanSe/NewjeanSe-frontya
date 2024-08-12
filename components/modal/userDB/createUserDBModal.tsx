import React from 'react';
import styles from './userDBModal.module.css';

interface CreateUserDBModalProps {
	onClose: () => void;
}

const CreateUserDBModal: React.FC<CreateUserDBModalProps> = ({ onClose }) => {
	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				<h2>DB 테이블 추가하기</h2>
				{/* 모달 내용 */}
				<button onClick={onClose}>닫기</button>
			</div>
		</div>
	);
};

export default CreateUserDBModal;
