import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import styles from '@/styles/mainMap/mainMap.module.css';
import HeaderBar from '@/components/mainMap/headerBar';
import SideBar from '@/components/mainMap/sideBar'; // 사이드바 컴포넌트를 가져옵니다.

const KakaoMap = dynamic(() => import('../components/mainMap/kakaoMap'), {
	ssr: false,
});

const MainMap: React.FC = () => {
	const [isSidebarVisible, setIsSidebarVisible] = useState(true);

	const toggleSidebarVisibility = () => {
		setIsSidebarVisible(prevState => !prevState);
	};

	return (
		<div className={styles.container}>
			<Head>
				<title>Main Map</title>
			</Head>
			<HeaderBar
				onToggleSidebar={toggleSidebarVisibility}
				isSidebarVisible={isSidebarVisible}
			/>
			{isSidebarVisible && <SideBar />} {/* 사이드바를 표시할지 여부를 결정 */}
			<div id="map-container" className={styles.mapContainer}>
				<KakaoMap />
			</div>
		</div>
	);
};

export default MainMap;
