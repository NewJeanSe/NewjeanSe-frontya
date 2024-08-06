import React, { useEffect, useRef } from 'react';
import styles from './infoWindow.module.css';

declare global {
	interface Window {
		kakao: any;
		infoWindowClose: () => void;
		toggleFavorite: (polygonId: string) => void;
	}
}

interface InfoWindowProps {
	map: any;
	position: any;
	content: string;
	polygonId: string;
	onLoad: (dimensions: { width: number; height: number }) => void;
	onClose: () => void;
	onToggleFavorite: (polygonId: string) => void;
	isFavorite: boolean;
}

const InfoWindow: React.FC<InfoWindowProps> = ({
	map,
	position,
	content,
	polygonId,
	onLoad,
	onClose,
	onToggleFavorite,
	isFavorite,
}) => {
	const infowindowRef = useRef<any>(null);
	const markerRef = useRef<any>(null);

	useEffect(() => {
		if (infowindowRef.current) {
			infowindowRef.current.close();
		}

		window.infoWindowClose = () => {
			if (infowindowRef.current) {
				infowindowRef.current.close();
			}
			onClose();
		};

		window.toggleFavorite = (id: string) => {
			if (id === polygonId) {
				onToggleFavorite(id);
			}
		};

		const marker = new window.kakao.maps.Marker({
			position: position,
		});
		marker.setMap(map);
		markerRef.current = marker;

		const infowindow = new window.kakao.maps.InfoWindow({
			content: `
				<div class="${styles.infoWindowContent}">
					<span class="${styles.close}" onclick="window.infoWindowClose()">×</span>
					<div class="${styles.infoWindowTitle}">
						<span class="${styles.favorite} ${
							isFavorite ? styles.favoriteActive : ''
						}" onclick="window.toggleFavorite('${polygonId}')">★</span>
						${content}
					</div>
					<div class="${styles.chartContainer}">
					</div>
				</div>
			`,
		});

		infowindow.open(map, marker);
		infowindowRef.current = infowindow;

		const infoWindowElement = document.querySelector(
			`.${styles.infoWindowContent}`,
		);
		if (infoWindowElement) {
			const rect = infoWindowElement.getBoundingClientRect();
			onLoad({ width: rect.width, height: rect.height });
		}

		return () => {
			if (infowindowRef.current) {
				infowindowRef.current.close();
			}
			if (markerRef.current) {
				markerRef.current.setMap(null);
			}
		};
	}, [
		map,
		position,
		content,
		onLoad,
		onClose,
		isFavorite,
		polygonId,
		onToggleFavorite,
	]);

	return null;
};

export default InfoWindow;
