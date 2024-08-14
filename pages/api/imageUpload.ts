import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import axios from 'axios';

export const config = {
	api: {
		bodyParser: false,
	},
};

// 현재 파일 처리가 진행 중인지 확인하는 플래그
let isProcessing = false;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (isProcessing) {
		// 이미 처리 중인 경우 새로운 요청을 차단
		res.status(429).json({
			message: '이미 처리가 진행 중입니다. 잠시 후 다시 시도해 주세요.',
		});
		return;
	}

	isProcessing = true; // 파일 처리를 시작

	try {
		const uploadDir = path.join(process.cwd(), '/public/uploads');
		fs.mkdirSync(uploadDir, { recursive: true }); // 디렉토리 생성, 이미 존재하면 무시

		const form = formidable({
			uploadDir: uploadDir, // public/uploads 디렉토리 설정
			keepExtensions: true, // 파일 확장자 유지
			maxFileSize: 50 * 1024 * 1024, // 최대 파일 크기 설정 (50MB)
			multiples: false, // 여러 파일 업로드 비활성화
		});

		form.parse(
			req,
			async (err: any, fields: formidable.Fields, files: formidable.Files) => {
				if (err) {
					console.error('Formidable Error:', err);
					res.status(500).json({ message: '파일 업로드 실패' });
					isProcessing = false; // 처리 완료 후 플래그 해제
					return;
				}

				const file = Array.isArray(files.file) ? files.file[0] : files.file;

				if (!file) {
					res.status(400).json({ message: '업로드된 파일이 없습니다' });
					isProcessing = false;
					return;
				}

				await sendFileToFlask(file, req, res); // Flask 서버로 파일 전송
			},
		);
	} catch (error) {
		console.error('Unexpected Error:', error);
		res.status(500).json({ message: '파일 업로드 중 오류가 발생했습니다.' });
		isProcessing = false;
	} finally {
		isProcessing = false; // 모든 처리가 끝나면 플래그 해제
	}
};

const sendFileToFlask = async (
	file: File,
	req: NextApiRequest,
	res: NextApiResponse,
) => {
	const formData = new FormData();
	formData.append(
		'file',
		fs.createReadStream(file.filepath),
		file.originalFilename || file.newFilename,
	);

	try {
		// Flask 서버에 파일 전송
		const response = await axios.post(
			'http://127.0.0.1:5000/upload', // Flask 서버의 엔드포인트 URL
			formData,
			{
				headers: formData.getHeaders(),
				timeout: 60000, // 타임아웃 시간을 60초로 설정
			},
		);

		const responseData = response.data;

		// Flask 서버에서 이미지 경로가 전달된 경우에만 처리
		if (responseData.imagePath) {
			const databaseResponse = await fetch(
				`${req.headers.origin}/api/database`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						id: responseData.id || crypto.randomUUID(), // 유니크 ID 추가
						name: file.originalFilename || file.newFilename,
						imagePath: responseData.imagePath, // Flask에서 전달된 imagePath 사용
						dueDate: responseData.dueDate,
						amountDue: responseData.amountDue,
						powerUsage: responseData.powerUsage,
						type: 'bill', // Type을 bill로 설정
					}),
				},
			);

			if (!databaseResponse.ok) {
				throw new Error('Failed to save to database');
			}

			res.status(200).json(responseData);
		} else {
			throw new Error('Failed to get imagePath from Flask server');
		}
	} catch (error: any) {
		console.error('Error sending file to Flask server:', error.message);
		res.status(500).json({ message: 'OCR 서버에 이미지 업로드 실패' });
	}
};

export default handler;
