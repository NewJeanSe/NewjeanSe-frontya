import React, { useEffect, useState } from 'react';

const UserDataBaseMain: React.FC = () => {
	const [mainMapFavorites, setMainMapFavorites] = useState<string[]>([]);
	const [userSimulationFavorites, setUserSimulationFavorites] = useState<
		string[]
	>([]);

	useEffect(() => {
		const savedMainMapFavorites = localStorage.getItem(
			'favoritePolygons_mainMap',
		);
		const savedUserSimulationFavorites = localStorage.getItem(
			'favoritePolygons_userSimulation',
		);

		if (savedMainMapFavorites) {
			setMainMapFavorites(JSON.parse(savedMainMapFavorites));
		}
		if (savedUserSimulationFavorites) {
			setUserSimulationFavorites(JSON.parse(savedUserSimulationFavorites));
		}
	}, []);

	return (
		<div>
			<h1>즐겨찾기 목록</h1>
			<h2>Main Map</h2>
			<ul>
				{mainMapFavorites.map((favorite, index) => (
					<li key={index}>
						즐겨찾기 {index + 1} - Main Map: {favorite}
					</li>
				))}
			</ul>
			<h2>User Simulation</h2>
			<ul>
				{userSimulationFavorites.map((favorite, index) => (
					<li key={index}>
						즐겨찾기 {index + 1} - User Simulation: {favorite}
					</li>
				))}
			</ul>
		</div>
	);
};

export default UserDataBaseMain;
