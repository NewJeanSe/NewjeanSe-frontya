import React, { useState } from 'react';
import styles from './userDBModal.module.css';

interface CreateUserDBModalProps {
	onClose: () => void;
	onAdd: (name: string) => void;
}

const CreateUserDBModal: React.FC<CreateUserDBModalProps> = ({
	onClose,
	onAdd,
}) => {
	const [name, setName] = useState('');

	const handleSubmit = () => {
		if (name.trim() === '') {
			alert('이름을 입력해주세요.');
			return;
		}
		onAdd(name.trim());
		onClose();
	};

	return (
		<div className={styles.modal}>
			<div className={styles.modalContent}>
				<span className={styles.close} onClick={onClose}>
					&times;
				</span>
				<div className={styles.modalHeader}>새로운 DB 목록 추가</div>
				<div className={styles.modalBody}>
					<div className={styles.inputField}>
						<input
							type="text"
							placeholder="새로운 DB 목록 이름 입력"
							value={name}
							onChange={e => setName(e.target.value)}
						/>
					</div>
				</div>
				<div className={styles.modalFooter}>
					<button className={styles.modalButton} onClick={handleSubmit}>
						추가하기
					</button>
				</div>
			</div>
		</div>
	);
};

export default CreateUserDBModal;
