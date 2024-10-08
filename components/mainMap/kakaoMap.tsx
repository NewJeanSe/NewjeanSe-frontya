import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import InfoWindow from './infoWindow';
import styles from './kakaoMap.module.css';
import Head from 'next/head';

declare global {
	interface Window {
		kakao: any;
	}
}

interface Area {
	name: string;
	path: any[];
	location: string;
}

interface Favorite {
	polygonId: string;
	name: string;
	isFavorite: boolean;
}

interface KakaoMapProps {
	pageType: string;
	favoritePolygons: Set<string>;
	onToggleFavorite: (polygonId: string, name: string) => void; // 이름을 추가
}

const KakaoMap: React.FC<KakaoMapProps> = ({
	pageType,
	favoritePolygons,
	onToggleFavorite,
}) => {
	const mapRef = useRef<any>(null);
	const [infoWindowData, setInfoWindowData] = useState<{
		position: any;
		content: string;
		polygonId: string;
		isFavorite: boolean;
	} | null>(null);
	const [selectedPolygon, setSelectedPolygon] = useState<any>(null);
	const [favorites, setFavorites] = useState<Favorite[]>([]);

	useEffect(() => {
		const fetchFavorites = async () => {
			try {
				const response = await axios.get('/api/database');
				setFavorites(response.data.favorites);
			} catch (error) {
				console.error('Error fetching favorites:', error);
			}
		};

		fetchFavorites();

		const apiKey = process.env.NEXT_PUBLIC_KAKAO_API_KEY;
		const scriptSrc = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;

		const script = document.createElement('script');
		script.src = scriptSrc;
		script.async = true;
		document.head.appendChild(script);

		script.onload = () => {
			window.kakao.maps.load(() => {
				const container = document.getElementById('map');
				if (!container) {
					console.error('Map container not found.');
					return;
				}

				const options = {
					center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
					level: 12,
				};
				const map = new window.kakao.maps.Map(container, options);
				mapRef.current = map;

				const customOverlay = new window.kakao.maps.CustomOverlay({});
				const infowindow = new window.kakao.maps.InfoWindow({
					removable: true,
				});

				let detailMode = false;
				let level: number;
				let polygons: any[] = [];
				let areas: Area[] = [];

				const calculateCentroid = (path: any) => {
					let xSum = 0;
					let ySum = 0;
					let area = 0;
					const numPoints = path.length;

					for (let i = 0; i < numPoints; i++) {
						const x0 = path[i].getLng();
						const y0 = path[i].getLat();
						const x1 = path[(i + 1) % numPoints].getLng();
						const y1 = path[(i + 1) % numPoints].getLat();

						const a = x0 * y1 - x1 * y0;
						area += a;
						xSum += (x0 + x1) * a;
						ySum += (y0 + y1) * a;
					}

					area *= 0.5;
					const centroidX = xSum / (6 * area);
					const centroidY = ySum / (6 * area);

					return new window.kakao.maps.LatLng(centroidY, centroidX);
				};

				const init = (path: string) => {
					axios
						.get(path)
						.then(response => {
							const geojson = response.data;
							const units = geojson.features;

							units.forEach((unit: any, index: number) => {
								const coordinates = unit.geometry.coordinates;
								const name = unit.properties.SIG_KOR_NM;
								const cd_location = unit.properties.SIG_CD;

								const ob = {
									name,
									path: coordinates[0].map(
										(coordinate: any) =>
											new window.kakao.maps.LatLng(
												coordinate[1],
												coordinate[0],
											),
									),
									location: cd_location,
								};

								areas[index] = ob;
							});

							areas.forEach(area => {
								displayArea(area);
							});
						})
						.catch(error => {
							console.error(`Error loading data from ${path}:`, error);
						});
				};

				const displayArea = (area: Area) => {
					const polygon = new window.kakao.maps.Polygon({
						map,
						path: area.path,
						strokeWeight: 2,
						strokeColor: '#004c80',
						strokeOpacity: 0.8,
						fillColor: '#fff',
						fillOpacity: 0.7,
					});
					polygons.push(polygon);

					const center = calculateCentroid(area.path);

					window.kakao.maps.event.addListener(
						polygon,
						'mouseover',
						function (mouseEvent: any) {
							if (selectedPolygon !== polygon) {
								polygon.setOptions({ fillColor: '#09f' });
								customOverlay.setContent(
									'<div class="area">' + area.name + '</div>',
								);
								customOverlay.setPosition(mouseEvent.latLng);
								customOverlay.setMap(map);
							}
						},
					);

					window.kakao.maps.event.addListener(
						polygon,
						'mousemove',
						function (mouseEvent: any) {
							if (selectedPolygon !== polygon) {
								customOverlay.setPosition(mouseEvent.latLng);
							}
						},
					);

					window.kakao.maps.event.addListener(polygon, 'mouseout', function () {
						if (selectedPolygon !== polygon) {
							polygon.setOptions({ fillColor: '#fff' });
							customOverlay.setMap(null);
						}
					});

					window.kakao.maps.event.addListener(polygon, 'click', function () {
						if (selectedPolygon) {
							selectedPolygon.setOptions({ fillColor: '#fff' });
							if (selectedPolygon === polygon) {
								setSelectedPolygon(null);
								setInfoWindowData(null);
								return;
							}
						}
						polygon.setOptions({ fillColor: '#09f' });
						setSelectedPolygon(polygon);

						// 즐겨찾기 상태 확인
						const favorite = favorites.find(
							(fav: Favorite) => fav.polygonId === area.location,
						);

						const isFavorite = favorite ? favorite.isFavorite : false;

						if (!detailMode) {
							map.panTo(center);
						} else {
							if (area.location.length === 2) {
								// 광역시/도 단위
								map.panTo(center);
							} else {
								setInfoWindowData({
									position: center,
									content: area.name,
									polygonId: area.location,
									isFavorite: isFavorite, // 즐겨찾기 상태 전달
								});
							}
						}
					});
				};

				window.kakao.maps.event.addListener(map, 'zoom_changed', function () {
					level = map.getLevel();
					if (!detailMode && level <= 10) {
						detailMode = true;
						removePolygon();
						init('/polygon/sig.json');
					} else if (detailMode && level > 10) {
						detailMode = false;
						removePolygon();
						init('/polygon/sido.json');
					}
				});

				const removePolygon = () => {
					polygons.forEach(polygon => polygon.setMap(null));
					setInfoWindowData(null);
					areas = [];
					polygons = [];
					setSelectedPolygon(null);
				};

				init('/polygon/sido.json');
			});
		};

		script.onerror = () => {
			console.error('Failed to load Kakao API script.');
		};
	}, []); // 빈 배열을 사용하여 처음 마운트될 때만 실행되도록 합니다.

	return (
		<>
			<Head>
				<style>{`
					.area {
						position: absolute;
						background: #fff;
						border: 1px solid #888;
						border-radius: 3px;
						font-size: 12px;
						top: -5px;
						left: 15px;
						padding: 2px;
					}
				`}</style>
			</Head>
			<div id="map" className={styles.map}></div>
			{infoWindowData && (
				<InfoWindow
					map={mapRef.current}
					position={infoWindowData.position}
					content={infoWindowData.content}
					polygonId={infoWindowData.polygonId}
					pageType={pageType}
					onLoad={() => {}}
					onClose={() => {
						setInfoWindowData(null);
					}}
					onToggleFavorite={onToggleFavorite}
					isFavorite={infoWindowData.isFavorite} // 즐겨찾기 상태 전달
				/>
			)}
		</>
	);
};

export default KakaoMap;
