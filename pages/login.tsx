import React, { useState, useEffect } from 'react';
import styles from '@/styles/login/LoginPage.module.css';
import LoginFailedModal from '@/components/modal/loginFailedModal';
import Image from 'next/image';
import { callLoginApi } from '@/lib/api';

const LoginPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [savedUsername, setSavedUsername] = useState('');
	const [authentication, setAuthentication] = useState('');

	const handleLogin = async () => {
		try {
			const response = await callLoginApi(username, password);
			if (response.status === 'success') {
				setAuthentication(response.status);
				alert('로그인에 성공했습니다.');
				window.location.href = '/mainMap';
			} else {
				alert('로그인에 실패했습니다...');
				setIsModalOpen(true); // 로그인 실패 시 모달 표시
			}
		} catch (error) {
			alert('로그인에 실패했습니다..');
			setIsModalOpen(true); // 예외 발생 시에도 모달 표시
		}
	};

	const handleLoginClick = async () => {
		await handleLogin();
		// 이 부분은 필요 없을 수 있음, 이미 handleLogin 내부에서 성공 여부를 처리합니다.
		// if (authentication === 'success') {
		// 	window.location.href = '/mainMap';
		// } else {
		// 	setIsModalOpen(true);
		// }
	};

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('savedUsername') || '';
			setSavedUsername(saved);
			setUsername(saved);
		}
	}, []);

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const handleSignupClick = () => {
		window.location.href = '/signUp';
	};

	const handleSaveUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
		const checked = event.target.checked;
		if (checked && typeof window !== 'undefined') {
			localStorage.setItem('savedUsername', username);
		} else if (typeof window !== 'undefined') {
			localStorage.removeItem('savedUsername');
		}
	};

	return (
		<div className={styles.newjeanseLoginpage}>
			<div className={`${styles.loginsection}`}>
				<div className={styles.columncontrast}>
					<Image
						src="/images/img_contrast_login.svg"
						alt="ElectricKo!"
						className={styles.contrastOne}
						width={60}
						height={60}
					/>
					<h1 className="newjeanse ui heading size-textmd">ElectricKo!</h1>
					<p className="ui text size-textxl">
						당신이 알고싶은 <br /> 대한민국{' '}
						<span className="class--span-1">전력</span> 에너지의 모든 것
					</p>
					<div className={styles.columnelectrick}>
						<h2 className="electricko ui heading size-textmd">
							ElectricKo! 와 함께하실 <br />
							광고주님의 연락을 기다립니다!
						</h2>
					</div>
				</div>

				<div className={styles.divider}></div>

				<div className={styles.columndivider}>
					<div className={styles.column1}>
						<button
							className={`${styles.flexRowCenterCenter1} ${styles.buttonKakao}`}
						>
							<Image
								src="/images/img_profile.svg"
								alt="Profile"
								className={styles.profile}
								width={20}
								height={20}
							/>
							<span> 카카오 계정으로 로그인</span>
						</button>
						<button
							className={`${styles.flexRowCenterCenter2} ${styles.buttonNaver}`}
							style={{ marginTop: '10px' }}
						>
							<Image
								src="/images/img_contrast_white_a700.svg"
								alt="Contrast"
								className={styles.contrast}
								width={20}
								height={20}
							/>
							<span> 네이버 계정으로 로그인</span>
						</button>
					</div>

					<div className={styles.dividerWrapper} style={{ margin: '20px 0' }}>
						<div className={styles.dividerOne}></div>
						<h2 className={`${styles.or} ui heading size-textlg`}>OR</h2>
						<div className={styles.dividerOne}></div>
					</div>

					<div className={styles.electricko1}>
						<div className={styles.column}>
							<div className={styles.columnlabel}>
								<div className={styles.rowlabel}>
									<p className="label ui text size-textxs">아이디</p>
								</div>
								<label className={styles.edittext1}>
									<input
										name="edittext"
										type="text"
										value={username}
										onChange={e => setUsername(e.target.value)}
										style={{
											border: '1px solid #ccc',
											borderRadius: '4px',
											padding: '10px',
											width: '100%',
										}}
									/>
								</label>
								<a
									href="#"
									className={`${styles.forgotLink} class-_-1 ui text size-textxs`}
									style={{
										textAlign: 'right',
										display: 'block',
										marginTop: '5px',
									}}
								>
									아이디를 잊어버리셨나요?
								</a>
							</div>

							<div className={styles.columnlabel} style={{ marginTop: '20px' }}>
								<div className={styles.rowlabel}>
									<p className="label ui text size-textxs">비밀번호</p>
								</div>
								<label className={styles.edittext1}>
									<input
										name="edittext_one"
										type="password"
										value={password}
										onChange={e => setPassword(e.target.value)}
										style={{
											border: '1px solid #ccc',
											borderRadius: '4px',
											padding: '10px',
											width: '100%',
										}}
									/>
								</label>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										marginTop: '10px',
									}}
								>
									<label
										className={`${styles.saveUsername} -2 ui checkbox`}
										style={{
											display: 'flex',
											alignItems: 'center',
											flexShrink: 0 /* 텍스트와 체크박스가 가깝게 */,
										}}
									>
										<span style={{ whiteSpace: 'nowrap' }}>아이디 저장</span>
										<input
											type="checkbox"
											name="아이디저장"
											className="ui checkbox size-xs primary"
											onChange={handleSaveUsername}
											style={{ marginLeft: '5px' }}
										/>
									</label>
									<a
										href="#"
										className={`${styles.forgotLink} class-_-1 ui text size-textxs`}
										style={{ marginLeft: 'auto' }}
									>
										비밀번호를 잊어버리셨나요?
									</a>
								</div>
							</div>

							<button
								id="loginButton"
								className={`${styles.flexRowCenterCenter3} ${styles.animatedButton}`}
								style={{
									marginTop: '20px',
									padding: '10px',
									width: '100%',
									backgroundColor: '#000',
									color: '#fff',
									borderRadius: '4px',
								}}
								onClick={handleLoginClick}
							>
								로그인
							</button>
						</div>
					</div>

					<div
						className={styles.dividerFive}
						style={{ margin: '20px 0' }}
					></div>
					<div className={styles.column}>
						<h3 className="class-__ ui heading size-textlg">
							아직 회원이 아니신가요?
						</h3>
						<button
							id="signupButton"
							className={`${styles.flexRowCenterCenter4} ${styles.animatedButton}`}
							style={{
								padding: '10px',
								width: '100%',
								backgroundColor: 'transparent',
								color: '#000',
								border: '2px solid #000',
								borderRadius: '4px',
							}}
							onClick={handleSignupClick}
						>
							회원 가입
						</button>
					</div>
				</div>
			</div>

			<LoginFailedModal isOpen={isModalOpen} closeModal={closeModal} />
		</div>
	);
};

export default LoginPage;
