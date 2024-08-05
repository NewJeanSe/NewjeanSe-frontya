import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './signUpModal.module.css';

interface SignUpModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const UserWithdrawalThanksModal = ({ isOpen, onClose }: SignUpModalProps) => {
	const router = useRouter();

	if (!isOpen) return null;

	const handleRedirect = () => {
		onClose();
		router.push('/');
	};

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
						height={50}
						className={styles.checkIcon}
					/>
					<h2>회원 탈퇴가 완료되었습니다</h2>
					<p>그동안 ElectricKo 서비스를 이용해주셔서 감사합니다.</p>
					<button className={styles.modalButton} onClick={handleRedirect}>
						홈으로 돌아가기
					</button>
				</div>
			</div>
		</div>
	);
};

export default UserWithdrawalThanksModal;
