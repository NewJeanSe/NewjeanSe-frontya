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
	isFavorite,
}) => {
	const infowindowRef = useRef<any>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);

	// 상태 정의 추가
	const [isProcessing, setIsProcessing] = useState(false);
	const [favorites, setFavorites] = useState<Favorite[]>([]);

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
	}, [map, position, onLoad]);

	// 즐겨찾기 토글 핸들러
	const handleToggleFavorite = async (polygonId: string, name: string) => {
		if (isProcessing) return;
		setIsProcessing(true);

		try {
			// 즐겨찾기 토글 요청 보내기
			const response = await axios.put('/api/database', {
				action: 'toggleFavorite',
				polygonId,
				name,
			});
			console.log('Favorite status toggled:', response.data);

			// 서버에서 최신 즐겨찾기 목록 가져오기
			const updatedFavoritesResponse = await axios.get('/api/database');
			const updatedFavorites = updatedFavoritesResponse.data.favorites;
			setFavorites(updatedFavorites);
		} catch (error) {
			console.error('Error toggling favorite:', error);
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
						style={{
							backgroundColor: isFavorite ? 'blue' : 'transparent',
						}}
						onClick={() => handleToggleFavorite(polygonId, content)}
					>
						<Image
							src={
								isFavorite
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
