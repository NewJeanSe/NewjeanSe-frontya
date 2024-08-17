import UserWithdrawalModal from '@/components/modal/userWithdrawalModal';
import UserWithdrawalThanksModal from '@/components/modal/userWithdrawalThanksModal';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '@/styles/home/NewJeanSeHomePage.module.css';

const HomePage = () => {
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isThanksModalOpen, setIsThanksModalOpen] = useState(false);

	const [currentStartIndex, setCurrentStartIndex] = useState(0);
	const images = [
		'/images/미리보기 1번 이미지.png',
		'/images/미리보기 2번 이미지-바꾸자.png',
		'/images/미리보기 전국 차트.png',
		'/images/미리보기 시군구 차트-바꾸자.png',
		'/images/미리보기 시뮬레이션-바꾸자.png',
		'/images/미리보기 OCR 결과창.png',
		'/images/미리보기 사용자 DB.png',
	];

	const redirectToLogin = () => {
		router.push('/login');
	};

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const openThanksModal = () => {
		setIsModalOpen(false);
		setIsThanksModalOpen(true);
	};

	const closeThanksModal = () => {
		setIsThanksModalOpen(false);
		redirectToHome();
	};

	const redirectToHome = () => {
		router.push('/');
	};

	const handlePrevClick = () => {
		if (currentStartIndex > 0) {
			setCurrentStartIndex(prevIndex => prevIndex - 1);
		}
	};

	const handleNextClick = () => {
		if (currentStartIndex < images.length - 4) {
			setCurrentStartIndex(prevIndex => prevIndex + 1);
		}
	};

	return (
		<div className={styles.newjeanseHomepage}>
			<Head>
				<meta charSet="utf-8" />
				<title>Newjeanse homepage</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="theme-color" content="#000000" />
				<meta
					name="description"
					content="Web site created using create-react-app"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<header className={`${styles.homepageheader} ${styles.fixedNavbar}`}>
				<div className={styles.row}>
					<div className={styles.rowcontrast_one}>
						<a href="#">
							<Image
								src="/images/img_contrast.svg"
								alt="Contrast"
								className={styles.contrast_five}
								width={44}
								height={44}
							/>
						</a>
						<p className={`${styles.logoText} ui text size-textmd`}>
							ElectricKo!
						</p>
					</div>

					<div className={styles.homepagebuttonl}>
						<button className={styles.homepagebutton} onClick={redirectToLogin}>
							<div className={styles.button6}>
								<p className={`${styles.buttonText} ui text size-textmd`}>
									로그인
								</p>
							</div>
						</button>
						<button className={styles.homepagebutton1}>
							<div className={styles.button7}>
								<p className={`${styles.buttonText} ui text size-textmd`}>홈</p>
							</div>
						</button>
						<button className={styles.homepagebutton2}>
							<div className={styles.button6}>
								<p className={`${styles.buttonText} ui text size-textmd`}>
									주요특징
								</p>
							</div>
						</button>
						<button className={styles.homepagebutton2}>
							<div className={styles.button6}>
								<p className={`${styles.buttonText} ui text size-textmd`}>
									미리보기
								</p>
							</div>
						</button>
					</div>
				</div>
			</header>

			<div className={styles.columnsouthkore}>
				<div className={styles.homepagehomesec}>
					<Image
						src="/images/img_southkoreamap.svg"
						alt="Southkoreamap"
						className={styles.southkoreamap}
						width={1000}
						height={894}
					/>
					<div className={styles.columncontrast}>
						<div className={styles.logo1}>
							<Image
								src="/images/img_contrast.svg"
								alt="Contrast"
								className={styles.contrastThree}
								width={84}
								height={44}
							/>
							<h1 className={`${styles.newjeanseOne} ui heading size-textxl`}>
								ElectricKo!
							</h1>
						</div>
						<p className="ui text size-text2xl">
							<span className={styles.classSpan}>
								당신이 알고싶은
								<br />
								대한민국&nbsp;
							</span>
							<span className={styles.classSpan1}>
								<span className={styles.highlightedText}>전력</span> 에너지의
								모든 것
							</span>
						</p>

						<div className={styles.statelayer}>
							<button className={styles.logoButton} onClick={redirectToLogin}>
								<div className={styles.logoContainer}>
									<Image
										src="/images/img_contrast.svg"
										alt="로고"
										className={styles.logo}
										width={44}
										height={44}
									/>
									<p className={`${styles.class___} ui text size-textmd`}>
										나만의 데이터 찾으러 가기
									</p>
								</div>
							</button>
						</div>
					</div>
				</div>
				<div className={styles.homepagekeyfeat}>
					<div className={styles.keyfeatureshead}>
						<h2 className={`${styles.class_one} ui heading size-text3xl`}>
							주요특징
						</h2>
						<p className={`${styles.description} ui text size-texts`}>
							ElectricKo! 프로젝트는 인공지능을 통해 각종 종류의 전력 수요를
							<br />
							예측하여 사용자가 원하는 맞춤 데이터를 지도 형태로 제공합니다.
						</p>
						<div className={styles.keyfeaturesContent}>
							<div className={styles.featuresLeft}>
								<div className={styles.featureItem}>
									<Image
										src="/images/healthicons_provider-fst.svg"
										alt="Image"
										className={styles.replyOne}
										width={50}
										height={50}
									/>
									<p className={`${styles.newjeanseOne} ui text size-textlg`}>
										데이터 전국 시군구 지원
									</p>
									<p className={`${styles._11} ui text size-textxs`}>
										월간 전력 수요 예측 데이터를 <br />
										전국 시군구 단위로 지원합니다.
									</p>
								</div>
								<div className={styles.featureItem}>
									<Image
										src="/images/mainMap/simulation.png"
										alt="Image"
										className={styles.replyOne}
										width={50}
										height={50}
									/>
									<p className={`${styles.newjeanseOne} ui text size-textlg`}>
										사용자 시뮬레이션 지원
									</p>
									<p className={`${styles._12} ui text size-textxs`}>
										사용자가 맞춤 설정한 값을 <br />
										기반으로 전력 데이터를 예측하는 <br />
										시뮬레이션 기능을 지원합니다.
									</p>
								</div>
								<div className={styles.featureItem}>
									<Image
										src="/images/mainMap/ocr.png"
										alt="Image"
										className={styles.replyOne}
										width={50}
										height={50}
									/>
									<p className={`${styles.newjeanseOne} ui text size-textlg`}>
										우리집 전기 요금 관리하기
									</p>
									<p className={`${styles._12} ui text size-textxs`}>
										정확한 OCR 스캔 기능을 지원해 <br />
										우리집 전기 요금 내역을 쉽게 관리할 수 있습니다.
									</p>
								</div>
							</div>

							<div className={styles.mapCenter}>
								<Image
									src="/images/img_southkoreamap_blue_800.svg"
									alt="South Korea Map"
									className={styles.southKoreaMap}
									width={550}
									height={500}
								/>
							</div>

							<div className={styles.featuresRight}>
								<div className={styles.featureItem}>
									<Image
										src="/images/img_group_black_900.svg"
										alt="Image"
										className={styles.replyOne}
										width={50}
										height={50}
									/>
									<p className={`${styles.newjeanseOne} ui text size-textlg`}>
										직관적이고 아름다운 차트
									</p>
									<p className={`${styles._11} ui text size-textxs`}>
										한 눈에 이해하기 쉽고 아름다운 차트를 제공합니다.
									</p>
								</div>
								<div className={styles.featureItem}>
									<Image
										src="/images/ic_outline-analytics.svg"
										alt="Image"
										className={styles.replyOne}
										width={50}
										height={50}
									/>
									<p className={`${styles.newjeanseOne} ui text size-textlg`}>
										다양한 예측 데이터 제공
									</p>
									<p className={`${styles._12} ui text size-textxs`}>
										사용자의 수요에 걸맞은 다양한 종류의 <br />
										전력 예측 데이터를 제공합니다.
									</p>
								</div>
								<div className={styles.featureItem}>
									<Image
										src="/images/img_mdi_database_outline.svg"
										alt="Image"
										className={styles.replyOne}
										width={50}
										height={50}
									/>
									<p className={`${styles.newjeanseOne} ui text size-textlg`}>
										회원 전용 데이터베이스 제공
									</p>
									<p className={`${styles._12} ui text size-textxs`}>
										회원 가입 시, 다양한 예측 데이터와 <br />
										이용 콘텐츠들을 저장할 수 있는 <br />
										나만의 전용 데이터베이스를 제공합니다.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div
					className={`${styles.flexColCenterCenter} ${styles.homepagepreview}`}
				>
					<div className={styles.previewheader}>
						<h3 className={`${styles.class__one} ui heading size-text3xl`}>
							미리 보기
						</h3>
						<p className={`${styles.electricko} ui text size-texts`}>
							스크린샷을 통해 ElectricKo! 를 미리 맛 보세요!
						</p>
					</div>
					<div className={styles.previewbodylist}>
						<div
							className={`${styles.previewbutton} ${
								currentStartIndex === 0 ? styles.disabledButton : ''
							}`}
							onClick={handlePrevClick}
						>
							<Image
								src="/images/mingcute_left-fill.svg"
								alt="Previewbuttonim"
								className={styles.previewbuttonim1}
								width={50}
								height={50}
							/>
						</div>
						<div className={styles.previewimagelis}>
							<div
								className={`${styles.previewimagebod} ${styles.smoothTransition}`}
							>
								{images
									.slice(currentStartIndex, currentStartIndex + 4)
									.map((image, index) => (
										<Image
											key={index}
											src={image}
											alt={`Tabpanelimg ${index}`}
											className={styles.tabpanelimgOne}
											width={150} // 가로 크기를 150px로 조정
											height={400} // 세로 크기를 400px로 고정
										/>
									))}
							</div>
							<div className={styles.tablist}>
								{images.map((_, index) => (
									<div
										key={index}
										className={
											index >= currentStartIndex &&
											index < currentStartIndex + 4
												? styles.tab2ofthreeOne
												: styles.tab1ofthreeOne
										}
									/>
								))}
							</div>
						</div>
						<div
							className={`${styles.previewbutton} ${
								currentStartIndex >= images.length - 4
									? styles.disabledButton
									: ''
							}`}
							onClick={handleNextClick}
						>
							<Image
								src="/images/mingcute_right-fill.svg"
								alt="Previewbuttonim"
								className={styles.previewbuttonim1}
								width={50}
								height={50}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className={styles.footerContainer}>
				<div className={styles.homepagefooters}>
					<div className={styles.footerContent}>
						<div className={styles.column}>
							<div className={styles.footerinfobutto}>
								<div className={styles.button2}>
									<div className={styles.statelayer1}>
										<p className={`${styles._6} ui text size-textxs`}>
											제휴문의
										</p>
									</div>
								</div>
								<div className={styles.button2}>
									<div className={styles.statelayer1}>
										<p className={`${styles._6} ui text size-textxs`}>
											이용약관
										</p>
									</div>
								</div>
								<div className={styles.button4}>
									<div className={styles.statelayer1}>
										<p className={`${styles._6} ui text size-textxs`}>
											개인정보 처리방침
										</p>
									</div>
								</div>
								<div>
									<p
										className={`${styles._6} ui text size-textxs ${styles.textButton}`}
										onClick={openModal}
										style={{ cursor: 'pointer' }}
									>
										회원 탈퇴
									</p>
									{isModalOpen && (
										<UserWithdrawalModal
											closeModal={closeModal}
											isOpen={isModalOpen}
											onConfirm={openThanksModal}
										/>
									)}
								</div>
							</div>
							<div className={styles.homepageaddress}>
								<div className={styles.rownewjeanse}>
									<p className={`${styles.newjeanseTwo} ui text size-textxs`}>
										팀 New JeanSe
									</p>
									<p className={`${styles.class_} ui text size-textxs`}>|</p>
									<p className={`${styles.class_1} ui text size-textxs`}>
										대표자 : 이상무
									</p>
									<p className={`${styles.one} ui text size-textxs`}>|</p>
									<p className={`${styles.ksebthree} ui text size-textxs`}>
										KSEB 3기
									</p>
								</div>
								<div className={styles.link}>
									<p className={`${styles.newjeanseTwo} ui text size-textxs`}>
										이메일 :
									</p>
									<p className={`${styles.electricko} ui text size-textxs`}>
										newjeanse@gmail.com
									</p>
								</div>
							</div>
							<p className={`${styles.copyright} ui text size-textxs`}>
								Copyright @2024 New JeanSe. All right reserved.
							</p>
						</div>
						<div className={styles.rowcontrast}>
							<Image
								src="/images/img_contrast.svg"
								alt="Contrast"
								className={styles.contrastFive}
								width={50}
								height={50}
							/>
							<p className={`${styles.newjeanseThree} ui text size-textmd`}>
								ElectricKo!
							</p>
						</div>
					</div>
				</div>
			</div>
			{isThanksModalOpen && (
				<UserWithdrawalThanksModal
					isOpen={isThanksModalOpen}
					onClose={closeThanksModal}
				/>
			)}
		</div>
	);
};

export default HomePage;
