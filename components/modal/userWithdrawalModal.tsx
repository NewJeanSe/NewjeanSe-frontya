import React, { useState, useEffect } from 'react';
import styles from './userModal.module.css';

interface UserModalProps {
	closeModal: () => void;
	isOpen: boolean;
	onConfirm: () => void;
}

const UserWithdrawalModal: React.FC<UserModalProps> = ({
	closeModal,
	isOpen,
	onConfirm,
}) => {
	const [password, setPassword] = useState('');
	const [error, setError] = useState(false);

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

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleConfirm = () => {
		const correctPassword = '1234'; // 실제 로그인된 사용자의 비밀번호로 대체
		if (password === correctPassword) {
			onConfirm(); // Thanks Modal 열기
			closeModal(); // 원래 모달 닫기
		} else {
			setError(true);
			setTimeout(() => setError(false), 500); // 애니메이션 후 에러 상태 초기화
		}
	};

	return (
		<>
			<div id="modal" className={styles.modal}>
				<div className={styles.modalContent}>
					<span className={styles.close} onClick={handleClose}>
						&times;
					</span>
					<h2>정말 회원을 탈퇴하시겠습니까?</h2>
					<p>
						회원 탈퇴 시 모든 서비스에서 탈퇴 처리됩니다.
						<br />
						회원 탈퇴 시 계정과 관련된 정보는 복구가 불가능합니다.
					</p>
					<input
						type="password"
						id="current-password"
						name="current-password"
						placeholder="현재 비밀번호"
						value={password}
						onChange={handlePasswordChange}
					/>
					<p className={`${styles.error} ${error ? styles.shake : ''}`}>
						현재 비밀번호를 확인해주세요.
					</p>
					<button id="closeModalBtn" onClick={handleClose}>
						돌아가기
					</button>
					<button id="confirmBtn" onClick={handleConfirm}>
						회원 탈퇴
					</button>
				</div>
			</div>
		</>
	);
};

export default UserWithdrawalModal;
