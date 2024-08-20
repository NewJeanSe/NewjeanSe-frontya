import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		console.log('Request received at /api/electricRuntimeKoreaDemandData');

		const response = await axios.get(
			'https://a311-34-73-73-241.ngrok-free.app/predict', // Flask 서버 URL
		);

		console.log('Response received from Flask server:', response.data);

		// 응답 데이터를 구조체로 변환하여 예상 데이터 포맷과 비교합니다.
		const currentTimeData = {
			time: new Date().toLocaleTimeString(),
			power: response.data.power, // 예상 응답 데이터 형식에 맞춰 조정합니다.
		};

		console.log('Current time data:', currentTimeData);

		res.status(200).json(response.data);
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('Axios error details:', {
				message: error.message,
				code: error.code,
				response: error.response
					? {
							status: error.response.status,
							statusText: error.response.statusText,
							data: error.response.data,
						}
					: null,
				request: error.request,
			});
		} else {
			console.error('Unexpected error:', error);
		}

		res.status(500).json({ message: 'Error fetching data from Flask server' });
	}
};

export default handler;
