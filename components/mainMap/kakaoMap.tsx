import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import styles from './kakaoMap.module.css';
import InfoWindow from './infoWindow';

declare global {
	interface Window {
		kakao: any;
	}
}

const KakaoMap: React.FC = () => {
	const mapRef = useRef<any>(null);
	const markerRef = useRef<any>(null);
	const [infoWindowData, setInfoWindowData] = useState<{
		position: any;
		content: string;
		marker: any;
	} | null>(null);
	const [selectedPolygon, setSelectedPolygon] = useState<any>(null);

	useEffect(() => {
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
				let areas: any[] = [];

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

				const displayArea = (area: any) => {
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
								if (markerRef.current) {
									markerRef.current.setMap(null);
								}
								setInfoWindowData(null);
								return; // 현재 폴리곤을 다시 클릭했으므로 마커와 인포윈도우를 숨기고 종료합니다.
							}
						}
						polygon.setOptions({ fillColor: '#09f' });
						setSelectedPolygon(polygon);

						if (!detailMode) {
							map.panTo(center);
						} else {
							if (area.location.length === 2) {
								// 광역시/도 단위
								map.panTo(center);
							} else {
								// 시군구 단위
								addMarker(center, '/images/map-marker.svg', area.name);
								setInfoWindowData({
									position: center,
									content: area.name,
									marker: markerRef.current,
								});
							}
						}
					});
				};

				const addMarker = (
					position: any,
					imageSrc: string,
					content: string,
				) => {
					if (markerRef.current) {
						markerRef.current.setMap(null);
					}

					const imageSize = new window.kakao.maps.Size(64, 69);
					const imageOption = { offset: new window.kakao.maps.Point(27, 69) };
					const markerImage = new window.kakao.maps.MarkerImage(
						imageSrc,
						imageSize,
						imageOption,
					);
					const marker = new window.kakao.maps.Marker({
						position: position,
						image: markerImage,
					});
					marker.setMap(map);
					markerRef.current = marker;

					const headerBarHeight =
						document.querySelector(`.${styles.headerBar}`)?.clientHeight || 0;
					const mapHeight = container.offsetHeight;
					const mapHeightAdjustment = 26; // 26px adjustment

					const moveMap = () => {
						const newCenter = new window.kakao.maps.LatLng(
							position.getLat() -
								((headerBarHeight + mapHeightAdjustment) / mapHeight) * 0.1,
							position.getLng(),
						);
						map.panTo(newCenter);
					};

					setInfoWindowData({ position, content, marker });
					moveMap();
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
					if (markerRef.current) {
						markerRef.current.setMap(null);
					}
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
	}, []);

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
					marker={infoWindowData.marker}
					onLoad={() => {}}
					onClose={() => {
						if (markerRef.current) {
							markerRef.current.setMap(null);
						}
						setInfoWindowData(null);
					}}
				/>
			)}
		</>
	);
};

export default KakaoMap;
