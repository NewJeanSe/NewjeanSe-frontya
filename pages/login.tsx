import React, { useState } from 'react';
import styles from '@/styles/login/LoginPage.module.css'; // CSS 모듈 import
import LoginFailedModal from '@/components/modal/loginFailedModal';

const LoginPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleLoginClick = () => {
		// 로그인 조건 확인
		if (username === 'a' && password === '1234') {
			window.location.href = '/mainMap';
		} else {
			setIsModalOpen(true); // 로그인 실패 모달을 열도록 설정
		}
	};

	const closeModal = () => {
		setIsModalOpen(false); // 모달 닫기
	};

	const handleSignupClick = () => {
		window.location.href = '/signUp';
	};

	return (
		<div className={styles.newjeanseLoginpage}>
			<div className={styles.loginsection}>
				<div className={styles.columncontrast}>
					<div className={styles.rowcontrastOne}>
						<img
							src="/images/img_contrast_login.svg"
							alt="Contrast"
							className={styles.contrastOne}
						/>
						<h1 className="newjeanse ui heading size-textmd">ElectricKo!</h1>
					</div>
					<p className="ui text size-textxl">
						<span className="class--span">
							{' '}
							당신이 알고싶은
							<br />
							대한민국&nbsp;
						</span>
						<span className="class--span-1"> 전력 에너지의 모든 것</span>
					</p>
					<div className={styles.columnelectrick}>
						<h2 className="electricko ui heading size-textmd">
							ElectricKo! 와 함께하실
							<br />
							광고주님의 연락을 기다립니다!
						</h2>
					</div>
				</div>
				<div className={styles.columndivider}>
					<div className={styles.columndivider1}>
						<div className={styles.column1}>
							<button className={styles.flexRowCenterCenter1}>
								<img
									src="/images/img_profile.svg"
									alt="Profile"
									className={styles.profile}
								/>
								<span> 카카오 계정으로 로그인</span>
							</button>
							<button className={styles.flexRowCenterCenter2}>
								<img
									src="/images/img_contrast_white_a700.svg"
									alt="Contrast"
									className={styles.contrast}
								/>
								<span> 네이버 계정으로 로그인</span>
							</button>
						</div>
						<div className={styles.divider}>
							<div className={styles.dividerOne}></div>
							<h2 className="or ui heading size-textlg">OR</h2>
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
										/>
									</label>
								</div>
								<a
									href="../newjeanse_findidpage/NewJeanSeFindIdPage.html"
									className="class-_-1 ui text size-textxs"
								>
									아이디를 잊어버리셨나요?
								</a>
							</div>
							<div className={styles.column1}>
								<div className={styles.column2}>
									<div className={styles.columnlabel}>
										<div className={styles.rowlabelOne}>
											<p className="or ui text size-textxs">비밀번호</p>
											<div className={styles.passwordhide}>
												<img
													src="/images/img_icon.svg"
													alt="Icon"
													className={styles.iconOne}
												/>
												<p className="hide ui text size-texts">Hide</p>
											</div>
										</div>
										<label className={styles.edittext1}>
											<input
												name="edittext_one"
												type="password"
												value={password}
												onChange={e => setPassword(e.target.value)}
											/>
										</label>
									</div>
									<a
										href="../newjeanse_findpasswordpage_2/NewJeanSeFindPasswordPage.html"
										className="class-_-1 ui text size-textxs"
									>
										비밀번호를 잊어버리셨나요?
									</a>
								</div>
								<label className="-2 ui checkbox">
									<input
										type="checkbox"
										name="아이디저장"
										className="ui checkbox size-xs primary"
									/>
									<div>아이디 저장</div>
								</label>
							</div>
							<button
								id="loginButton"
								className={styles.flexRowCenterCenter3}
								onClick={handleLoginClick}
							>
								로그인
							</button>
						</div>
					</div>
					<div className={styles.dividerFive}></div>
					<div className={styles.column}>
						<h3 className="class-__ ui heading size-textlg">
							아직 회원이 아니신가요?
						</h3>
						<button
							id="signupButton"
							className={styles.flexRowCenterCenter4}
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
