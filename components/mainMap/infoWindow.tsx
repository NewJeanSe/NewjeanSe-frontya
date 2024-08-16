import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'; // Axios를 직접 사용하여 API 호출
import styles from './infoWindow.module.css';
import MonthlyDemandChart from '../charts/monthlyDemandChart';
import Image from 'next/image';

declare global {
	interface Window {
		kakao: any;
		infoWindowClose: () => void;
		toggleFavorite: (polygonId: string) => void;
	}
}

interface Favorite {
	polygonId: string;
	name: string;
	isFavorite: boolean;
}

interface InfoWindowProps {
	map: any;
	position: any;
	content: string;
	polygonId: string;
	pageType: string;
	onLoad: (dimensions: { width: number; height: number }) => void;
	onClose: () => void;
	onToggleFavorite: (polygonId: string, name: string) => void;
	isFavorite: boolean;
}

const InfoWindow: React.FC<InfoWindowProps> = ({
	map,
	position,
	content,
	polygonId,
	pageType,
	onLoad,
	onClose,
	onToggleFavorite,
}) => {
	const infowindowRef = useRef<any>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);

	// 상태 정의 추가
	const [isProcessing, setIsProcessing] = useState(false);
	const [currentIsFavorite, setCurrentIsFavorite] = useState(false);

	useEffect(() => {
		if (containerRef.current) {
			const infowindow = new window.kakao.maps.InfoWindow({
				position,
				content: containerRef.current,
			});
			infowindow.open(map);
			infowindowRef.current = infowindow;

			const rect = containerRef.current.getBoundingClientRect();
			onLoad({ width: rect.width, height: rect.height });
		}

		// 컴포넌트가 처음 로드될 때, 해당 폴리곤의 즐겨찾기 상태를 가져옵니다.
		const fetchFavoriteStatus = async () => {
			try {
				const response = await axios.get('/api/database');
				const favorites = response.data.favorites as Favorite[];
				const favoriteItem = favorites.find(fav => fav.polygonId === polygonId);
				setCurrentIsFavorite(favoriteItem ? favoriteItem.isFavorite : false);
			} catch (error) {
				console.error('Error fetching favorites:', error);
			}
		};

		fetchFavoriteStatus();

		return () => {
			const currentContainer = containerRef.current;
			if (infowindowRef.current) {
				infowindowRef.current.close();
				infowindowRef.current.setMap(null);
				infowindowRef.current = null;
			}

			if (currentContainer && currentContainer.parentNode) {
				ReactDOM.unmountComponentAtNode(currentContainer);
				currentContainer.parentNode.removeChild(currentContainer);
			}
		};
	}, [map, position, onLoad, polygonId]);

	// 즐겨찾기 토글 핸들러
	const handleToggleFavorite = async (polygonId: string, name: string) => {
		if (isProcessing) return;
		setIsProcessing(true);

		try {
			// 사용자에게 바로 반영되도록 먼저 상태를 반전시킵니다.
			setCurrentIsFavorite(prev => !prev);

			// 즐겨찾기 토글 요청 보내기
			await axios.put('/api/database', {
				action: 'toggleFavorite',
				polygonId,
				name,
			});

			// 서버에서 최신 즐겨찾기 목록 가져오기
			const updatedFavoritesResponse = await axios.get('/api/database');
			const updatedFavorites = updatedFavoritesResponse.data.favorites;

			// 서버 상태에 맞게 로컬 상태를 업데이트
			const favoriteItem = updatedFavorites.find(
				(fav: Favorite) => fav.polygonId === polygonId,
			);

			setCurrentIsFavorite(favoriteItem ? favoriteItem.isFavorite : false);
		} catch (error) {
			console.error('Error toggling favorite:', error);
			// 에러가 발생하면 원래 상태로 되돌립니다.
			setCurrentIsFavorite(prev => !prev);
		} finally {
			setIsProcessing(false);
		}
	};

	return ReactDOM.createPortal(
		<div>
			<div ref={containerRef} className={styles.infoWindowContent}>
				<span className={styles.close} onClick={onClose}>
					×
				</span>
				<div className={styles.infoWindowTitle}>
					<button
						className={styles.favoriteButton}
						onClick={() => handleToggleFavorite(polygonId, content)}
					>
						<Image
							src={
								currentIsFavorite
									? '/images/즐겨찾기 true 이미지.svg'
									: '/images/즐겨찾기 false 이미지.svg'
							}
							alt="Favorite"
							width={24}
							height={24}
						/>
					</button>
					{content}
				</div>
				<div className={styles.chartContainer}>
					<MonthlyDemandChart polygonId={polygonId} />
				</div>
			</div>
		</div>,
		document.body,
	);
};

export default InfoWindow;
