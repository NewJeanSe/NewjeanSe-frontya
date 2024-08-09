import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import styles from '@/styles/mainMap/mainMap.module.css';
import HeaderBar from '@/components/mainMap/headerBar';
import SideBar from '@/components/mainMap/sideBar';

const KakaoMap = dynamic(() => import('../components/mainMap/kakaoMap'), {
	ssr: false,
});

const MainMap: React.FC = () => {
	const [isSidebarVisible, setIsSidebarVisible] = useState(true);
	const [favoritePolygons, setFavoritePolygons] = useState<Set<string>>(
		new Set(),
	);

	// LocalStorage에서 즐겨찾기 상태 불러오기
	useEffect(() => {
		const savedFavorites = localStorage.getItem('favoritePolygons_mainMap');
		if (savedFavorites) {
			setFavoritePolygons(new Set(JSON.parse(savedFavorites)));
		}
	}, []);

	// 즐겨찾기 상태를 LocalStorage에 저장
	useEffect(() => {
		localStorage.setItem(
			'favoritePolygons_mainMap',
			JSON.stringify(Array.from(favoritePolygons)),
		);
	}, [favoritePolygons]);

	const toggleSidebarVisibility = () => {
		setIsSidebarVisible(prevState => !prevState);
	};

	const handleToggleFavorite = (polygonId: string) => {
		setFavoritePolygons(prevFavorites => {
			const updatedFavorites = new Set(prevFavorites);
			if (updatedFavorites.has(polygonId)) {
				updatedFavorites.delete(polygonId);
			} else {
				updatedFavorites.add(polygonId);
			}
			return updatedFavorites;
		});
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
			{isSidebarVisible && <SideBar />}
			<div id="map-container" className={styles.mapContainer}>
				<KakaoMap
					pageType="mainMap"
					favoritePolygons={favoritePolygons}
					onToggleFavorite={handleToggleFavorite}
				/>
			</div>
		</div>
	);
};

export default MainMap;
