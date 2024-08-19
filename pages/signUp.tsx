import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '../styles/signUp/signUp.module.css';
import SignUpModal from '../components/modal/signUpModal';
import { callEmailVerificationApi, callNewUserRegisterApi } from '../lib/api'; // API 함수 임포트

const SignUpPage = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [nickname, setNickname] = useState('');
	const [emailCode, setEmailCode] = useState('');
	const [verificationCode, setVerificationCode] = useState('');
	const [errorMessage, setErrorMessage] = useState({
		username: '',
		usernameStyle: '',
		password: '',
		passwordStyle: '',
		passwordConfirm: '',
		passwordConfirmStyle: '',
		nickname: '',
		nicknameStyle: '',
		emailCode: '',
		emailCodeStyle: '',
	});

	const [hidePassword1, setHidePassword1] = useState(true);
	const [hidePassword2, setHidePassword2] = useState(true);
	const [hidePassword3, setHidePassword3] = useState(true);

	const toggleHide1 = () => setHidePassword1(!hidePassword1);
	const toggleHide2 = () => setHidePassword2(!hidePassword2);
	const toggleHide3 = () => setHidePassword3(!hidePassword3);

	const [modalOpen, setModalOpen] = useState(false);
	const openModal = () => setModalOpen(true);
	const closeModal = () => setModalOpen(false);

	const handleEmailVerification = async () => {
		try {
			const response = await callEmailVerificationApi(email);
			setVerificationCode(response);
			alert('이메일로 인증번호를 전송했습니다.');
		} catch (error) {
			alert('인증번호 전송에 실패했습니다.');
		}
	};

	// const handleUsernameDuplicateCheck = async () => {
	// 	try {
	// 		const response = await callUsernameDuplicateCheckApi(username);
	// 		if (response === 'success') alert('사용가능한 아이디입니다.');
	// 		else alert('이미 존재하는 아이디입니다.');
	// 	} catch (error) {
	// 		alert('이미 존재하는 아이디입니다..');
	// 	}
	// };

	useEffect(() => {
		const validateForm = () => {
			// 아이디 유효성 검사
			if (username.length >= 6) {
				setErrorMessage(prev => ({
					...prev,
					username: '올바른 아이디 형식입니다',
					usernameStyle: styles.successmessage,
				}));
			} else if (username.length > 0) {
				setErrorMessage(prev => ({
					...prev,
					username: '잘못된 형식입니다',
					usernameStyle: styles.errormessage,
				}));
			} else {
				setErrorMessage(prev => ({
					...prev,
					username: '아이디를 입력해주세요',
					usernameStyle: styles.errormessage,
				}));
			}

			// 비밀번호 유효성 검사
			if (password.length >= 6) {
				setErrorMessage(prev => ({
					...prev,
					password: '올바른 비밀번호 형식입니다',
					passwordStyle: styles.successmessage,
				}));
			} else if (password.length > 0) {
				setErrorMessage(prev => ({
					...prev,
					password: '잘못된 형식입니다',
					passwordStyle: styles.errormessage,
				}));
			} else {
				setErrorMessage(prev => ({
					...prev,
					password: '비밀번호를 입력해주세요',
					passwordStyle: styles.errormessage,
				}));
			}

			// 비밀번호 확인 검사
			if (passwordConfirm === password && passwordConfirm.length >= 6) {
				setErrorMessage(prev => ({
					...prev,
					passwordConfirm: '비밀번호가 일치합니다',
					passwordConfirmStyle: styles.successmessage,
				}));
			} else if (passwordConfirm.length > 0) {
				setErrorMessage(prev => ({
					...prev,
					passwordConfirm: '잘못된 형식입니다',
					passwordConfirmStyle: styles.errormessage,
				}));
			} else {
				setErrorMessage(prev => ({
					...prev,
					passwordConfirm: '위에서 설정하신 비밀번호를 입력해주세요',
					passwordConfirmStyle: styles.errormessage,
				}));
			}

			// 닉네임 유효성 검사
			if (nickname.length >= 2) {
				setErrorMessage(prev => ({
					...prev,
					nickname: '올바른 닉네임 형식입니다',
					nicknameStyle: styles.successmessage,
				}));
			} else if (nickname.length > 0) {
				setErrorMessage(prev => ({
					...prev,
					nickname: '잘못된 형식입니다',
					nicknameStyle: styles.errormessage,
				}));
			} else {
				setErrorMessage(prev => ({
					...prev,
					nickname: '닉네임을 입력해주세요',
					nicknameStyle: styles.errormessage,
				}));
			}

			// 이메일 인증코드 검사
			if (!emailCode || !verificationCode) {
				setErrorMessage(prev => ({
					...prev,
					emailCode: '이메일 인증코드를 입력해주세요',
					emailCodeStyle: styles.errormessage,
				}));
			} else if (emailCode === String(verificationCode)) {
				setErrorMessage(prev => ({
					...prev,
					emailCode: '인증에 성공했습니다',
					emailCodeStyle: styles.successmessage,
				}));
			} else {
				setErrorMessage(prev => ({
					...prev,
					emailCode: '잘못된 형식입니다',
					emailCodeStyle: styles.errormessage,
				}));
			}
		};

		validateForm();
	}, [
		username,
		password,
		passwordConfirm,
		nickname,
		emailCode,
		verificationCode,
	]);

	const router = useRouter();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// 모든 입력 필드에 대한 검증이 성공했는지 확인
		const isFormValid = Object.keys(errorMessage).every(key => {
			if (key.endsWith('Style')) {
				const fieldName = key as keyof typeof errorMessage;
				return errorMessage[fieldName] === styles.successmessage;
			}
			return true;
		});

		if (isFormValid) {
			callNewUserRegisterApi(username, password, nickname, email);
			alert('회원 가입이 완료되었습니다.');
			router.push('/login'); // 여기서 '/nextPage'를 이동하려는 페이지로 변경하세요
		} else {
			alert('모든 필드를 올바르게 입력해주세요.');
		}
	};

	return (
		<div className={styles.columncontrast}>
			<div className={styles.rowcontrast_one}>
				<Image
					src="/images/img_contrast_signUp.svg"
					alt="Contrast"
					width={50}
					height={50}
					className={styles.contrast_one}
				/>
				<h1
					className={`${styles.newjeanse} ${styles.ui} ${styles.heading} ${styles.sizeTextmd}`}
				>
					ElectricKo!
				</h1>
			</div>

			<form className={styles.columndivider} onSubmit={handleSubmit}>
				<div className={styles.electricko}>
					{/* 아이디 필드 */}
					<div className={styles.columnlabel_1}>
						<div className={styles.rowlabel_three}>
							<p className={`${styles.ui} ${styles.text} ${styles.sizeTextxs}`}>
								아이디
							</p>
							<div className={styles.passwordhide} onClick={toggleHide1}>
								<Image
									src="/images/img_icon_signUp.svg"
									alt="Icon"
									width={20}
									height={20}
									className={styles.icon_three}
								/>
								<p
									className={`${styles.hide_one} ${styles.ui} ${styles.text} ${styles.sizeTexts}`}
								>
									{hidePassword1 ? 'Hide' : 'Show'}
								</p>
							</div>
						</div>
						<label className={styles.edittext_one}>
							<input
								name="username"
								type="text"
								value={username}
								onChange={e => setUsername(e.target.value)}
							/>
						</label>
						<p
							className={`${styles.ui} ${styles.text} ${styles.sizeTextxs} ${errorMessage.usernameStyle}`}
						>
							{errorMessage.username}
						</p>
					</div>

					{/* 이메일 필드 */}
					<div className={styles.columnlabel_1}>
						<p
							className={`${styles.rowlabel_three} ${styles.ui} ${styles.text} ${styles.sizeTextxs}`}
						>
							이메일
						</p>
						<label className={styles.edittext_one}>
							<input
								name="email"
								type="email"
								value={email}
								onChange={e => setEmail(e.target.value)}
							/>
						</label>
						<p
							className={`${styles.class_} ${styles.ui} ${styles.text} ${styles.sizeTextxs}`}
							onClick={handleEmailVerification} // 버튼 클릭 시 API 호출
						>
							이메일 인증하기
						</p>
					</div>

					{/* 이메일 인증 코드 필드 */}
					<div className={styles.columnlabel_two}>
						<p
							className={`${styles.rowlabel_three} ${styles.ui} ${styles.text} ${styles.sizeTextxs}`}
						>
							이메일 인증코드 확인
						</p>
						<label className={styles.edittext_two}>
							<input
								name="emailcode"
								type="text"
								value={emailCode}
								onChange={e => setEmailCode(e.target.value)}
							/>
						</label>
						<p
							className={`${styles.ui} ${styles.text} ${styles.sizeTextxs} ${errorMessage.emailCodeStyle}`}
						>
							{errorMessage.emailCode}
						</p>
					</div>

					{/* 비밀번호 필드 */}
					<div className={styles.columnlabel_1}>
						<div className={styles.rowlabel_three}>
							<p className={`${styles.ui} ${styles.text} ${styles.sizeTextxs}`}>
								비밀번호
							</p>
							<div className={styles.passwordhide} onClick={toggleHide2}>
								<Image
									src="/images/img_icon_signUp.svg"
									alt="Icon"
									width={20}
									height={20}
									className={styles.icon_three}
								/>
								<p
									className={`${styles.hide_one} ${styles.ui} ${styles.text} ${styles.sizeTexts}`}
								>
									{hidePassword2 ? 'Hide' : 'Show'}
								</p>
							</div>
						</div>
						<label className={styles.edittext_one}>
							<input
								name="password"
								type={hidePassword2 ? 'password' : 'text'}
								value={password}
								onChange={e => setPassword(e.target.value)}
							/>
						</label>
						<p
							className={`${styles.ui} ${styles.text} ${styles.sizeTextxs} ${errorMessage.passwordStyle}`}
						>
							{errorMessage.password}
						</p>
					</div>

					{/* 비밀번호 확인 필드 */}
					<div className={styles.columnlabel_1}>
						<div className={styles.rowlabel_three}>
							<p className={`${styles.ui} ${styles.text} ${styles.sizeTextxs}`}>
								비밀번호 확인
							</p>
							<div className={styles.passwordhide} onClick={toggleHide3}>
								<Image
									src="/images/img_icon_signUp.svg"
									alt="Icon"
									width={20}
									height={20}
									className={styles.icon_three}
								/>
								<p
									className={`${styles.hide_one} ${styles.ui} ${styles.text} ${styles.sizeTexts}`}
								>
									{hidePassword3 ? 'Hide' : 'Show'}
								</p>
							</div>
						</div>
						<label className={styles.edittext_one}>
							<input
								name="edittext_four"
								type={hidePassword3 ? 'password' : 'text'}
								value={passwordConfirm}
								onChange={e => setPasswordConfirm(e.target.value)}
							/>
						</label>
						<p
							className={`${styles.ui} ${styles.text} ${styles.sizeTextxs} ${errorMessage.passwordConfirmStyle}`}
						>
							{errorMessage.passwordConfirm}
						</p>
					</div>

					{/* 닉네임 필드 */}
					<div className={styles.columnlabel_1}>
						<p
							className={`${styles.rowlabel_three} ${styles.ui} ${styles.text} ${styles.sizeTextxs}`}
						>
							닉네임
						</p>
						<label className={styles.edittext_two}>
							<input
								name="nickname"
								type="text"
								value={nickname}
								onChange={e => setNickname(e.target.value)}
							/>
						</label>
						<p
							className={`${styles.ui} ${styles.text} ${styles.sizeTextxs} ${errorMessage.nicknameStyle}`}
						>
							{errorMessage.nickname}
						</p>
					</div>
				</div>

				{/* 구분선 */}
				<div className={styles.divider_one}></div>

				{/* 회원 가입 완료 버튼 */}
				<button
					className={`${styles.flexRowCenterCenter} ${styles.class__}`}
					type="submit"
				>
					회원 가입 완료
				</button>
			</form>

			<SignUpModal isOpen={modalOpen} onClose={closeModal} />
		</div>
	);
};

export default SignUpPage;
