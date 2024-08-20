import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Next.js API 핸들러 함수
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	// 요청의 쿼리 매개변수에서 polygonId를 추출합니다.
	const { polygonId } = req.query;

	try {
		// Flask 서버로 요청을 보냅니다.
		// 여기서 polygonId를 포함한 URL을 사용하여 Flask 서버에서 해당 폴리곤의 데이터를 요청합니다.
		const response = await axios.get(
			`https://e214-34-74-48-166.ngrok-free.app/predict/${polygonId}`,
		);

		// 받은 데이터를 콘솔에 출력합니다.
		console.log('Received data from Flask server:', response.data);

		// Flask 서버에서 받아온 데이터를 클라이언트로 반환합니다.
		res.status(200).json(response.data);
	} catch (error) {
		// 요청이 실패했을 때 오류를 처리하는 부분입니다.
		if (axios.isAxiosError(error)) {
			console.error('Axios error details:', {
				message: error.message, // 오류 메시지
				code: error.code, // 오류 코드
				// 응답 객체가 있으면 상태와 데이터를 포함하여 로그에 출력합니다.
				response: error.response
					? {
							status: error.response.status, // HTTP 상태 코드
							statusText: error.response.statusText, // 상태 텍스트
							data: error.response.data, // 응답 데이터
						}
					: null,
				request: error.request, // 요청 객체
			});
		} else {
			// Axios 외의 예기치 않은 오류를 처리하는 부분입니다.
			console.error('Unexpected error:', error);
		}

		// 클라이언트로 500 상태 코드와 오류 메시지를 반환합니다.
		res.status(500).json({ message: 'Error fetching data from Flask server' });
	}
};

// 이 핸들러 함수를 기본 내보내기로 설정하여 API 라우트로 사용합니다.
export default handler;
