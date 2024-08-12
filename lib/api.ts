import axios from 'axios';

// API_BASE_URL은 환경 변수에서 가져오며, 설정되지 않은 경우 로컬 서버를 기본값으로 사용합니다.
// 백엔드 서버의 실제 URL 또는 로컬 개발 환경의 URL을 설정합니다.
const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002';

// 사용자의 즐겨찾기 데이터를 가져오는 함수입니다.
export const getFavorites = async (pageType: string) => {
	try {
		const response = await axios.get(`${API_BASE_URL}/favorites`, {
			params: { pageType },
		});
		return response.data;
	} catch (error) {
		console.error('Failed to fetch favorites:', error);
		throw error;
	}
};

// 사용자의 즐겨찾기 데이터를 추가하는 함수입니다.
export const addFavorite = async (pageType: string, polygonId: string) => {
	try {
		console.log(
			`Adding favorite - pageType: ${pageType}, polygonId: ${polygonId}`,
		);
		const response = await axios.post(`${API_BASE_URL}/favorites`, {
			pageType,
			polygonId,
		});
		console.log('API Response:', response.data);
		return response.data;
	} catch (error) {
		console.error('Failed to add favorite:', error);
		throw error;
	}
};

// 사용자의 즐겨찾기 데이터를 삭제하는 함수입니다.
export const removeFavorite = async (pageType: string, polygonId: string) => {
	try {
		const response = await axios.delete(`${API_BASE_URL}/favorites`, {
			data: { pageType, polygonId },
		});
		return response.data;
	} catch (error) {
		console.error('Failed to remove favorite:', error);
		throw error;
	}
};
