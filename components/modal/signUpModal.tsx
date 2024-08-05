import Image from 'next/image';
import Link from 'next/link';
import styles from './signUpModal.module.css'; // 상대 경로 수정

interface SignUpModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const SignUpModal = ({ isOpen, onClose }: SignUpModalProps) => {
	if (!isOpen) return null;

	return (
		<div className={styles.modal} onClick={onClose}>
			<div className={styles.modalContent} onClick={e => e.stopPropagation()}>
				<span className={styles.close} onClick={onClose}>
					&times;
				</span>
				<div className={styles.modalBody}>
					<Image
						src="/images/img_contrast_signUp.svg"
						alt="Check Icon"
						width={50}
						height={50} // 예시 크기
						className={styles.checkIcon}
					/>
					<h2>회원가입을 완료했습니다</h2>
					<p>감사합니다!</p>
					<button className={styles.modalButton} id="login-button">
						<Link href="/login">로그인하기</Link>
					</button>
				</div>
			</div>
		</div>
	);
};

export default SignUpModal;
