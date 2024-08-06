import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './userSimulationInputModal.module.css';
import UserSimulationInputWarningModal from './userSimulationInputWarningModal';

const UserSimulationInputModal: React.FC<{ onClose: () => void }> = ({
	onClose,
}) => {
	const router = useRouter();
	const [temperature, setTemperature] = useState('');
	const [humidity, setHumidity] = useState('');
	const [a, setA] = useState('');
	const [b, setB] = useState('');
	const [c, setC] = useState('');
	const [d, setD] = useState('');

	const [showWarning, setShowWarning] = useState(false);
	const [confirmed, setConfirmed] = useState(false);

	const handleSubmit = () => {
		if (
			!confirmed &&
			(temperature === '' ||
				humidity === '' ||
				a === '' ||
				b === '' ||
				c === '' ||
				d === '')
		) {
			setShowWarning(true);
			return;
		}

		const payload = {
			temperature: temperature || '기본값',
			humidity: humidity || '기본값',
			a: a || '기본값',
			b: b || '기본값',
			c: c || '기본값',
			d: d || '기본값',
		};

		const query = new URLSearchParams(payload).toString();
		router.push(`/userSimulation?${query}`);
		onClose();
	};

	const handleWarningClose = () => {
		setShowWarning(false);
	};

	const handleWarningConfirm = () => {
		setConfirmed(true);
		setShowWarning(false);
		handleSubmit();
	};

	return (
		<>
			<div className={styles.modal}>
				<div className={styles.modalContent}>
					<span className={styles.close} onClick={onClose}>
						&times;
					</span>
					<div className={styles.modalHeader}>
						각 설정값에 원하는 값을 입력하세요!
					</div>
					<div className={styles.modalSubHeader}>
						값을 비워두면 기본 설정값이 입력됩니다.
					</div>
					<div className={styles.modalBody}>
						<div className={styles.inputField}>
							<input
								type="text"
								placeholder="기온"
								value={temperature}
								onChange={e => setTemperature(e.target.value)}
							/>
						</div>
						<div className={styles.inputField}>
							<input
								type="text"
								placeholder="습도"
								value={humidity}
								onChange={e => setHumidity(e.target.value)}
							/>
						</div>
						<div className={styles.inputField}>
							<input
								type="text"
								placeholder="A"
								value={a}
								onChange={e => setA(e.target.value)}
							/>
						</div>
						<div className={styles.inputField}>
							<input
								type="text"
								placeholder="B"
								value={b}
								onChange={e => setB(e.target.value)}
							/>
						</div>
						<div className={styles.inputField}>
							<input
								type="text"
								placeholder="C"
								value={c}
								onChange={e => setC(e.target.value)}
							/>
						</div>
						<div className={styles.inputField}>
							<input
								type="text"
								placeholder="D"
								value={d}
								onChange={e => setD(e.target.value)}
							/>
						</div>
					</div>
					<div className={styles.modalFooter}>
						<button className={styles.modalButton} onClick={handleSubmit}>
							시뮬레이션 시작!
						</button>
					</div>
				</div>
			</div>
			{showWarning && (
				<UserSimulationInputWarningModal
					onClose={handleWarningClose}
					onConfirm={handleWarningConfirm}
				/>
			)}
		</>
	);
};

export default UserSimulationInputModal;
