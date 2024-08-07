// pages/api/electricRuntimeKoreaDemandData.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const response = await axios.get(
			'https://1cba-34-125-159-52.ngrok-free.app/predict',
		); // Flask 서버 URL
		res.status(200).json(response.data);
	} catch (error) {
		console.error('Error fetching data from Flask server:', error);
		res.status(500).json({ message: 'Error fetching data from Flask server' });
	}
};

export default handler;
