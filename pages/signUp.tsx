import { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/signUp/signUp.module.css'; // 스타일 파일 임포트
import SignUpModal from '../components/modal/signUpModal'; // SignUpModal 컴포넌트 임포트

const SignUpPage = () => {
	// 모달 상태 관리
	const [modalOpen, setModalOpen] = useState(false);

	// 모달 열기 함수
	const openModal = () => setModalOpen(true);

	// 모달 닫기 함수
	const closeModal = () => setModalOpen(false);

	return (
		<div className={styles.row}>
			<div className={`${styles.flexColCenterCenter} ${styles.columncontrast}`}>
				<div className={styles.rowcontrast_one}>
					<Image
						src="/images/img_contrast_signUp.svg"
						alt="Contrast"
						width={100}
						height={100} // 예시 크기
						className={styles.contrast_one}
					/>
					<h1
						className={`${styles.newjeanse} ${styles.ui} ${styles.heading} ${styles.sizeTextmd}`}
					>
						ElectricKo!
					</h1>
				</div>
				<div className={styles.columndivider}>
					<div className={styles.electricko}>
						<div>
							<div className={styles.columnerrormess_2}>
								<div className={styles.columnlabel_1}>
									<div className={styles.rowlabel_three}>
										<p
											className={`${styles.ui} ${styles.text} ${styles.sizeTextxs}`}
										>
											아이디
										</p>
										<div className={styles.passwordhide}>
											<Image
												src="/images/img_icon_signUp.svg"
												alt="Icon"
												width={20}
												height={20} // 예시 크기
												className={styles.icon_three}
											/>
											<p
												className={`${styles.hide_one} ${styles.ui} ${styles.text} ${styles.sizeTexts}`}
											>
												Hide
											</p>
										</div>
									</div>
									<label className={styles.edittext_one}>
										<input name="edittext" type="text" />
									</label>
								</div>
								<p
									className={`${styles.errormessage_1} ${styles.ui} ${styles.text} ${styles.sizeTextxs}`}
								>
									아이디를 입력해주세요
								</p>
							</div>
						</div>
						<div className={styles.column_}>
							<div className={styles.columnlabel_one}>
								<div className={styles.rowlabel_one}>
									<p
										className={`${styles.label_two} ${styles.ui} ${styles.text} ${styles.sizeTextxs}`}
									>
										이메일
									</p>
								</div>
								<label className={styles.edittext_one}>
									<input name="edittext_one" type="text" />
								</label>
							</div>
							<p
								className={`${styles.class_} ${styles.ui} ${styles.text} ${styles.sizeTextxs}`}
							>
								이메일 인증하기
							</p>
						</div>
						<div className={styles.columnlabel_two}>
							<div className={styles.rowlabel_two}>
								<p
									className={`${styles.label_two} ${styles.ui} ${styles.text} ${styles.sizeTextxs}`}
								>
									이메일 인증코드 확인
								</p>
							</div>
							<label className={styles.edittext_two}>
								<input name="edittext_two" type="text" />
							</label>
							<p
								className={`${styles.errormessage} ${styles.ui} ${styles.text} ${styles.sizeTextxs}`}
							>
								이메일 인증코드를 입력해주세요
							</p>
						</div>
						<div className={styles.columnerrormess}>
							<div className={styles.columnlabel_1}>
								<div className={styles.rowlabel_three}>
									<p
										className={`${styles.ui} ${styles.text} ${styles.sizeTextxs}`}
									>
										비밀번호
									</p>
									<div className={styles.passwordhide}>
										<Image
											src="/images/img_icon_signUp.svg"
											alt="Icon"
											width={20}
											height={20} // 예시 크기
											className={styles.icon_three}
										/>
										<p
											className={`${styles.hide_one} ${styles.ui} ${styles.text} ${styles.sizeTexts}`}
										>
											Hide
										</p>
									</div>
								</div>
								<label className={styles.edittext_one}>
									<input name="edittext_three" type="text" />
								</label>
							</div>
							<p
								className={`${styles.errormessage_1} ${styles.ui} ${styles.text} ${styles.sizeTextxs}`}
							>
								잘못된 형식입니다
							</p>
						</div>
						<div className={styles.columnerrormess}>
							<div className={styles.columnlabel_1}>
								<div className={styles.rowlabel_three}>
									<p
										className={`${styles.ui} ${styles.text} ${styles.sizeTextxs}`}
									>
										비밀번호 확인
									</p>
									<div className={styles.passwordhide}>
										<Image
											src="/images/img_icon_signUp.svg"
											alt="Icon"
											width={20}
											height={20} // 예시 크기
											className={styles.icon_three}
										/>
										<p
											className={`${styles.hide_one} ${styles.ui} ${styles.text} ${styles.sizeTexts}`}
										>
											Hide
										</p>
									</div>
								</div>
								<label className={styles.edittext_one}>
									<input name="edittext_four" type="text" />
								</label>
							</div>
							<p
								className={`${styles.errormessage_1} ${styles.ui} ${styles.text} ${styles.sizeTextxs}`}
							>
								비밀번호를 입력해주세요
							</p>
						</div>
						<div className={styles.columnlabel}>
							<div className={styles.rowlabel_two}>
								<p
									className={`${styles.label_two} ${styles.ui} ${styles.text} ${styles.sizeTextxs}`}
								>
									닉네임
								</p>
							</div>
							<label className={styles.edittext_two}>
								<input name="edittext_five" type="text" />
							</label>
							<p
								className={`${styles.errormessage_3} ${styles.ui} ${styles.text} ${styles.sizeTextxs}`}
							>
								닉네임을 입력해주세요
							</p>
						</div>
					</div>
					<div className={styles.divider_one}></div>
					<button
						className={`${styles.flexRowCenterCenter} ${styles.class__}`}
						id="signup-complete"
						onClick={openModal}
					>
						회원 가입 완료
					</button>
				</div>
			</div>

			<SignUpModal isOpen={modalOpen} onClose={closeModal} />
		</div>
	);
};

export default SignUpPage;
