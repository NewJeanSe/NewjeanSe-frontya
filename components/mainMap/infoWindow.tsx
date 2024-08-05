import React, { useEffect, useRef } from 'react';
import styles from './infoWindow.module.css';

declare global {
	interface Window {
		kakao: any;
		infoWindowClose: () => void;
	}
}

interface InfoWindowProps {
	map: any;
	position: any;
	content: string;
	marker: any;
	onLoad: (dimensions: { width: number; height: number }) => void;
	onClose: () => void; // onClose 함수 추가
}

const InfoWindow: React.FC<InfoWindowProps> = ({
	map,
	position,
	content,
	marker,
	onLoad,
	onClose, // onClose 함수 추가
}) => {
	const infowindowRef = useRef<any>(null);

	useEffect(() => {
		if (infowindowRef.current) {
			infowindowRef.current.close();
		}

		window.infoWindowClose = () => {
			if (infowindowRef.current) {
				infowindowRef.current.close();
			}
			onClose(); // onClose 함수 호출
		};

		const infowindow = new window.kakao.maps.InfoWindow({
			content: `
				<div class="${styles.infoWindowContent}">
					<span class="${styles.close}" onclick="window.infoWindowClose()">×</span> <!-- close 추가 -->
					<div class="${styles.infoWindowTitle}">${content}</div>
					<div class="${styles.chartContainer}">
						<!-- 차트가 들어갈 공간 -->
					</div>
				</div>
			`,
		});

		infowindow.open(map, marker);
		infowindowRef.current = infowindow;

		// 인포윈도우가 로드된 후 너비와 높이 계산
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
		};
	}, [map, position, content, marker, onLoad, onClose]);

	return null;
};

export default InfoWindow;
