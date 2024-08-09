import axios from 'axios';

// API_BASE_URL은 환경 변수에서 가져오며, 설정되지 않은 경우 로컬 서버를 기본값으로 사용합니다.
// 백엔드 서버의 실제 URL 또는 로컬 개발 환경의 URL을 설정합니다.
const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// 사용자의 즐겨찾기 데이터를 가져오는 함수입니다.
// 백엔드에서 제공하는 API 경로가 "/api/favorites/:userId"와 일치해야 합니다.
// 필요에 따라 백엔드 API 경로를 수정하세요.
export const getFavorites = async (userId: string) => {
	try {
		// 여기에 백엔드 API의 경로를 명시합니다.
		const response = await axios.get(`${API_BASE_URL}/api/favorites/${userId}`);
		return response.data; // 백엔드에서 받은 데이터를 반환합니다.
	} catch (error) {
		console.error('Failed to fetch favorites:', error);
		throw error;
	}
};

// 사용자의 즐겨찾기 데이터를 추가하는 함수입니다.
// 백엔드에서 제공하는 API 경로가 "/api/favorites"와 일치해야 합니다.
// 필요에 따라 백엔드 API 경로를 수정하세요.
export const addFavorite = async (
	userId: string,
	polygonId: string,
	infoWindowData: string,
) => {
	try {
		// 여기에 백엔드 API의 경로를 명시합니다.
		const response = await axios.post(`${API_BASE_URL}/api/favorites`, {
			userId, // 사용자 ID
			polygonId, // 폴리곤 ID
			infoWindowData, // 정보 창에 표시될 데이터
		});
		return response.data; // 백엔드에서 받은 데이터를 반환합니다.
	} catch (error) {
		console.error('Failed to add favorite:', error);
		throw error;
	}
};
