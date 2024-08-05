import UserWithdrawalModal from '@/components/modal/userWithdrawalModal';
import UserWithdrawalThanksModal from '@/components/modal/userWithdrawalThanksModal'; // 추가
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '@/components/modal/userModal.module.css';
import { useState } from 'react';

const HomePage = () => {
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isThanksModalOpen, setIsThanksModalOpen] = useState(false);

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

	return (
		<div className="newjeanse-homepage">
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
			<div className="columnsouthkore">
				<div className="homepagehomesec">
					<Image
						src="/images/img_southkoreamap.svg"
						alt="Southkoreamap"
						className="southkoreamap"
						width={800}
						height={894}
					/>
					<div className="columncontrast">
						<header className="homepageheader fixed-navbar">
							<div className="row">
								<div className="rowcontrast_one">
									<a href="#">
										<Image
											src="/images/img_contrast.svg"
											alt="Contrast"
											className="contrast_five"
											width={44}
											height={44}
										/>
									</a>
									<p className="newjeanse_three ui text size-textmd">
										ElectricKo!
									</p>
								</div>
								<div className="homepagebuttonl">
									<button className="homepagebutton" onClick={redirectToLogin}>
										<div className="button-6">
											<p className="class-___ ui text size-textmd">로그인</p>
										</div>
									</button>
									<button className="homepagebutton-1">
										<div className="button-7">
											<p className="class-___ ui text size-textmd">홈</p>
										</div>
									</button>
									<button className="homepagebutton-2">
										<div className="button-6">
											<p className="class-___ ui text size-textmd">주요특징</p>
										</div>
									</button>
									<button className="homepagebutton-2">
										<div className="button-6">
											<p className="class-___ ui text size-textmd">미리보기</p>
										</div>
									</button>
								</div>
							</div>
						</header>
						<div className="logo-1">
							<Image
								src="/images/img_contrast.svg"
								alt="Contrast"
								className="contrast_three"
								width={44}
								height={44}
							/>
							<h1 className="newjeanse_one ui heading size-textxl">
								ElectricKo!
							</h1>
						</div>
						<p className="ui text size-text2xl">
							<span className="class--span">
								당신이 알고싶은
								<br />
								대한민국&nbsp;
							</span>
							<span className="class--span-1"> 전력 에너지의 모든 것</span>
						</p>
						<div className="statelayer">
							<button className="logo-button" onClick={redirectToLogin}>
								<div className="logo-container">
									<Image
										src="/images/img_contrast.svg"
										alt="로고"
										className="logo"
										width={44}
										height={44}
									/>
									<p className="class-___ ui text size-textmd">
										나만의 데이터 찾으러 가기
									</p>
								</div>
							</button>
						</div>
					</div>
				</div>
				<div className="homepagekeyfeat">
					<div className="keyfeatureshead">
						<h2 className="class-_one ui heading size-text3xl">주요특징</h2>
						<p className="description ui text size-texts">
							ElectricKo! 프로젝트는 인공지능을 통해 각종 종류의 전력 수요를
							<br />
							예측하여 사용자가 원하는 맞춤 데이터를 지도 형태로 제공합니다.
						</p>
						<div className="stack_">
							<div className="row_">
								<div className="column_-1">
									<div className="keyfeatureimage-2">
										<Image
											src="/images/img_group_black_900.svg"
											alt="Image"
											className="reply_one"
											width={50}
											height={50}
										/>
									</div>
									<div className="row_-1">
										<div className="column_-2">
											<p className="newjeanse_one ui text size-textlg">
												커뮤니티 기능
											</p>
											<p className="-11 ui text size-textxs">
												예측 데이터 관련 회원 간 소통을 위한 <br />
												다양한 커뮤니티 기능을 제공합니다.
											</p>
										</div>
										<div className="row__">
											<div className="keyfeaturecomme">
												<p className="class-__-1 ui text size-textlg">
													사용자 시뮬레이션 지원
												</p>
												<p className="-12 ui text size-textxs">
													사용자가 맞춤 설정한 값을
													<br />
													기반으로 전력 수요를 예측하는
													<br />
													시뮬레이션 기능을 지원합니다.
												</p>
											</div>
											<div className="rowsettings_one">
												<div className="keyfeatureimage-3">
													<Image
														src="/images/img_settings_white_a700.svg"
														alt="Settings"
														className="reply_one"
														width={50}
														height={50}
													/>
												</div>
												<div className="southkoreamapfr">
													<div className="southkoreamap-1">
														<div className="keyfeatureimage-4">
															<Image
																src="/images/img_ic_outline_analytics.svg"
																alt="Icoutline"
																className="reply_one"
																width={50}
																height={50}
															/>
														</div>
														<div className="keyfeatureimage-5">
															<Image
																src="/images/img_mdi_database_outline.svg"
																alt="Mdidatabase"
																className="reply_one"
																width={50}
																height={50}
															/>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="column-1">
									<p className="newjeanse_one ui text size-textlg">
										직관적이고 아름다운 차트
									</p>
									<p className="-3 ui text size-textxs">
										한 눈에 이해하기 쉽고 아름다운 차트를 제공합니다.
									</p>
									<p className="class-___-2 ui text size-textlg">
										다양한 예측 데이터 제공
									</p>
									<p className="-4 ui text size-textxs">
										사용자의 수요에 걸맞은 다양한 종류의
										<br />
										전력 수요 예측 데이터를 제공합니다.
									</p>
									<p className="class-___-3 ui text size-textlg">
										회원 전용 데이터베이스 제공
									</p>
									<p className="-5 ui text size-textxs">
										회원 가입 시, 더욱 다양한 예측 데이터와
										<br />
										이용 컨텐츠들을 저장할 수 있는
										<br />
										나만의 전용 데이터베이스를 제공합니다.
									</p>
								</div>
							</div>
							<div className="column_">
								<p className="class-___-1 ui text size-textlg">
									데이터 전국 시군구 지원
								</p>
								<p className="-1 ui text size-textxs">
									제공하는 모든 데이터는 대한민국
									<br />
									전국 모든 시군구 단위로 지원합니다.
								</p>
							</div>
							<div className="keyfeatureimage">
								<Image
									src="/images/img_reply_white_a700.svg"
									alt="Reply"
									className="reply_one"
									width={50}
									height={50}
								/>
							</div>
							<div className="keyfeatureimage-1">
								<Image
									src="/images/img_tdesign_member.svg"
									alt="Tdesignmember"
									className="reply_one"
									width={50}
									height={50}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="flex-col-center-center homepagepreview">
					<div className="previewheader">
						<h3 className="class-__one ui heading size-text3xl">미리 보기</h3>
						<p className="electricko ui text size-texts">
							스크린샷을 통해 ElectricKo! 를 미리 맛 보세요!
						</p>
					</div>
					<div className="previewbodylist">
						<div className="previewbutton">
							<Image
								src="/images/img_previewbuttonimage.png"
								alt="Previewbuttonim"
								className="previewbuttonim"
								width={50}
								height={50}
							/>
						</div>
						<div className="previewimagelis">
							<div className="previewimagebod">
								<Image
									src="/images/img_tabpanel_img_sreen2_png.png"
									alt="Tabpanelimg"
									className="tabpanelimg_one"
									width={50}
									height={50}
								/>
								<Image
									src="/images/img_tabpanel_img_sreen3_png.png"
									alt="Tabpanelimg"
									className="tabpanelimg"
									width={50}
									height={50}
								/>
								<Image
									src="/images/img_tabpanel_img_sreen4_png.png"
									alt="Tabpanelimg"
									className="tabpanelimg"
									width={50}
									height={50}
								/>
								<Image
									src="/images/img_tabpanel_img_sreen5_png.png"
									alt="Tabpanelimg"
									className="tabpanelimg_one"
									width={50}
									height={50}
								/>
							</div>
							<div className="tablist">
								<div className="tab1ofthree_one"></div>
								<div className="tab2ofthree_one"></div>
								<div className="tab1ofthree_one"></div>
								<div className="tab1ofthree_one"></div>
								<div className="tab1ofthree_one"></div>
								<div className="tab1ofthree_one"></div>
								<div className="tab1ofthree_one"></div>
								<div className="tab1ofthree_one"></div>
							</div>
						</div>
						<div className="previewbutton">
							<Image
								src="/images/img_previewbuttonimage_28x64.png"
								alt="Previewbuttonim"
								className="previewbuttonim-1"
								width={50}
								height={50}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="homepagefooters">
				<div className="logo">
					<div className="column">
						<div className="footerinfobutto">
							<div className="button-2">
								<div className="statelayer-1">
									<p className="-6 ui text size-textxs">제휴문의</p>
								</div>
							</div>
							<div className="button-2">
								<div className="statelayer-1">
									<p className="-6 ui text size-textxs">이용약관</p>
								</div>
							</div>
							<div className="button-4">
								<div className="statelayer-1">
									<p className="-6 ui text size-textxs">개인정보 처리방침</p>
								</div>
							</div>
							<div>
								<button className="button-2 statelayer-1" onClick={openModal}>
									<p className="-6 ui text size-textxs">회원 탈퇴</p>
								</button>
								{isModalOpen && (
									<UserWithdrawalModal
										closeModal={closeModal}
										isOpen={isModalOpen}
										onConfirm={openThanksModal} // 추가
									/>
								)}
							</div>
						</div>
						<div className="homepageaddress">
							<div className="rownewjeanse">
								<p className="newjeanse_two ui text size-textxs">
									팀 New JeanSe
								</p>
								<p className="class-_ ui text size-textxs">|</p>
								<p className="class-_-1 ui text size-textxs">대표자 : 이상무</p>
								<p className="one ui text size-textxs">|</p>
								<p className="ksebthree ui text size-textxs">KSEB 3기</p>
							</div>
							<div className="link">
								<p className="newjeanse_two ui text size-textxs">이메일 :</p>
								<p className="electricko ui text size-textxs">
									newjeanse@gmail.com
								</p>
							</div>
						</div>
						<p className="copyright ui text size-textxs">
							Copyright @2024 New JeanSe. All right reserved.
						</p>
					</div>
					<div className="rowcontrast">
						<Image
							src="/images/img_contrast.svg"
							alt="Contrast"
							className="contrast_five"
							width={50}
							height={50}
						/>
						<p className="newjeanse_three ui text size-textmd">ElectricKo!</p>
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
