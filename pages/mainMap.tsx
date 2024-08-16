import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import styles from '@/styles/mainMap/mainMap.module.css';
import HeaderBar from '@/components/mainMap/headerBar';
import SideBar from '@/components/mainMap/sideBar';
import { getFavorites, addFavorite, removeFavorite } from '@/lib/api';

const KakaoMap = dynamic(() => import('../components/mainMap/kakaoMap'), {
	ssr: false,
});

const MainMap: React.FC = () => {
	const [isSidebarVisible, setIsSidebarVisible] = useState(true);
	const [favoritePolygons, setFavoritePolygons] = useState<Set<string>>(
		new Set(),
	);

	useEffect(() => {
		const loadFavorites = async () => {
			try {
				const favorites = await getFavorites('mainMap');
				setFavoritePolygons(new Set(favorites.map((f: any) => f.polygonId)));
			} catch (error) {
				console.error('Failed to load favorites:', error);
			}
		};
		loadFavorites();
	}, []);

	const toggleSidebarVisibility = () => {
		setIsSidebarVisible(prevState => !prevState);
	};

	const handleToggleFavorite = async (polygonId: string, name: string) => {
		try {
			let updatedFavorites;
			if (favoritePolygons.has(polygonId)) {
				await removeFavorite('mainMap', polygonId, name);
				updatedFavorites = new Set(favoritePolygons);
				updatedFavorites.delete(polygonId);
			} else {
				await addFavorite('mainMap', polygonId, name);
				updatedFavorites = new Set(favoritePolygons);
				updatedFavorites.add(polygonId);
			}
			setFavoritePolygons(updatedFavorites);
		} catch (error) {
			console.error('Failed to toggle favorite:', error);
		}
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
