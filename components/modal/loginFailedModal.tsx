import React, { useState, useEffect } from 'react';
import styles from './userModal.module.css';

interface UserModalProps {
	closeModal: () => void;
	isOpen: boolean;
}

const LoginFailedModal: React.FC<UserModalProps> = ({ closeModal, isOpen }) => {
	useEffect(() => {
		if (isOpen) {
			document.getElementById('modal')!.style.display = 'block';
		} else {
			document.getElementById('modal')!.style.display = 'none';
		}
	}, [isOpen]);

	const handleClose = () => {
		closeModal();
	};

	return (
		<div id="modal" className={styles.modal}>
			<div className={styles.modalContent}>
				<span className={styles.close} onClick={handleClose}>
					&times;
				</span>
				<h2>로그인 실패!</h2>
				<p className={styles.error}>아이디와 패스워드 입력값을 확인하세요!</p>
				<button id="closeModalBtn" onClick={handleClose}>
					돌아가기
				</button>
			</div>
		</div>
	);
};

export default LoginFailedModal;
