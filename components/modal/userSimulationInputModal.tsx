import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './userSimulationInputModal.module.css';
import UserSimulationInputWarningModal from './userSimulationInputWarningModal';

interface Payload {
	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
	weekday: number;
	humidity: number;
	temperature: number;
}

interface UserSimulationInputModalProps {
	onClose: () => void;
	onSimulationComplete: (result: any) => void;
}

const UserSimulationInputModal: React.FC<UserSimulationInputModalProps> = ({
	onClose,
	onSimulationComplete,
}) => {
	const router = useRouter();
	const [year, setYear] = useState<string>('');
	const [month, setMonth] = useState<string>('');
	const [day, setDay] = useState<string>('');
	const [hour, setHour] = useState<string>('');
	const [minute, setMinute] = useState<string>('');
	const [weekday, setWeekday] = useState<string>('');
	const [humidity, setHumidity] = useState<string>('');
	const [temperature, setTemperature] = useState<string>('');

	const [showWarning, setShowWarning] = useState(false);
	const [confirmed, setConfirmed] = useState(false);

	const defaultValues: Payload = {
		year: 2024,
		month: 1,
		day: 1,
		hour: 0,
		minute: 0,
		weekday: 1,
		humidity: 50,
		temperature: 20,
	};

	// 숫자 검증 함수
	const isNumeric = (value: string) => /^\d*$/.test(value);

	// 범위 검증 함수
	const isWithinRange = (value: number, min: number, max: number) =>
		value >= min && value <= max;

	const handleSubmit = () => {
		// 입력된 값이 모두 숫자인지 확인
		if (
			!confirmed &&
			[year, month, day, hour, minute, weekday, humidity, temperature].some(
				value => !isNumeric(value),
			)
		) {
			alert('변수에는 숫자만 입력해주세요.');
			return;
		}

		// 비어있는 필드가 있을 경우 경고 모달 표시
		if (
			[year, month, day, hour, minute, weekday, humidity, temperature].some(
				value => value === '',
			)
		) {
			setShowWarning(true);
			return;
		}

		// 범위 검증
		const numericValues = {
			year: parseInt(year) || defaultValues.year,
			month: parseInt(month) || defaultValues.month,
			day: parseInt(day) || defaultValues.day,
			hour: parseInt(hour) || defaultValues.hour,
			minute: parseInt(minute) || defaultValues.minute,
			weekday: parseInt(weekday) || defaultValues.weekday,
			humidity: parseInt(humidity) || defaultValues.humidity,
			temperature: parseInt(temperature) || defaultValues.temperature,
		};

		if (
			!isWithinRange(numericValues.month, 1, 12) ||
			!isWithinRange(numericValues.day, 1, 31) ||
			!isWithinRange(numericValues.hour, 0, 23) ||
			!isWithinRange(numericValues.minute, 0, 59) ||
			!isWithinRange(numericValues.weekday, 1, 7)
		) {
			alert(
				'월은 1~12, 일은 1~31, 시는 0~23, 분은 0~59, 요일은 1~7 사이의 값을 입력해주세요.',
			);
			return;
		}

		const payload: Payload = {
			year: numericValues.year,
			month: numericValues.month,
			day: numericValues.day,
			hour: numericValues.hour,
			minute: numericValues.minute,
			weekday: numericValues.weekday,
			humidity: numericValues.humidity,
			temperature: numericValues.temperature,
		};

		sendPayloadToPython(payload);
	};

	const sendPayloadToPython = async (payload: Payload) => {
		try {
			console.log('Sending payload to Python:', payload); // 전송 전 데이터 확인
			const response = await fetch('/api/predict', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const result = await response.json();
			console.log('Simulation result:', result);
			alert('데이터가 성공적으로 전송되었습니다.');
			router.push('/userSimulation');
		} catch (error) {
			console.error('Error:', error);
			alert('데이터 전송에 실패했습니다. 다시 시도해 주세요.');
		} finally {
			onClose(); // 페이지 이동 후 모달 닫기
		}
	};

	const handleWarningClose = () => {
		setShowWarning(false);
	};

	const handleWarningConfirm = () => {
		setConfirmed(true);
		setShowWarning(false);

		const payload: Payload = {
			year: parseInt(year) || defaultValues.year,
			month: parseInt(month) || defaultValues.month,
			day: parseInt(day) || defaultValues.day,
			hour: parseInt(hour) || defaultValues.hour,
			minute: parseInt(minute) || defaultValues.minute,
			weekday: parseInt(weekday) || defaultValues.weekday,
			humidity: parseInt(humidity) || defaultValues.humidity,
			temperature: parseInt(temperature) || defaultValues.temperature,
		};

		sendPayloadToPython(payload);
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
								placeholder="연도"
								value={year}
								onChange={e => setYear(e.target.value)}
							/>
						</div>
						<div className={styles.inputField}>
							<input
								type="text"
								placeholder="월"
								value={month}
								onChange={e => setMonth(e.target.value)}
							/>
						</div>
						<div className={styles.inputField}>
							<input
								type="text"
								placeholder="일"
								value={day}
								onChange={e => setDay(e.target.value)}
							/>
						</div>
						<div className={styles.inputField}>
							<input
								type="text"
								placeholder="시"
								value={hour}
								onChange={e => setHour(e.target.value)}
							/>
						</div>
						<div className={styles.inputField}>
							<input
								type="text"
								placeholder="분"
								value={minute}
								onChange={e => setMinute(e.target.value)}
							/>
						</div>
						<div className={styles.inputField}>
							<input
								type="text"
								placeholder="요일"
								value={weekday}
								onChange={e => setWeekday(e.target.value)}
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
								placeholder="기온"
								value={temperature}
								onChange={e => setTemperature(e.target.value)}
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
