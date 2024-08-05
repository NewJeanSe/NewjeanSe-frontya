import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File, Fields, Files } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
	api: {
		bodyParser: false,
	},
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
	const uploadDir = path.join(process.cwd(), '/public/uploads');
	fs.mkdirSync(uploadDir, { recursive: true }); // 디렉토리 생성, 이미 존재하면 무시

	const form = formidable({
		uploadDir: uploadDir, // 파일 저장 디렉토리 설정
		keepExtensions: true, // 파일 확장자 유지
		maxFileSize: 50 * 1024 * 1024, // 최대 파일 크기 설정 (50MB)
		multiples: false, // 여러 파일 업로드 비활성화
	});

	form.parse(req, (err: any, fields: Fields, files: Files) => {
		if (err) {
			console.error('Formidable Error:', err);
			res.status(500).json({ message: 'File upload failed' });
			return;
		}

		const file = files.file;

		if (file && Array.isArray(file)) {
			const singleFile = file[0];
			const data = fs.readFileSync(singleFile.filepath);
			const newPath = path.join(
				uploadDir,
				singleFile.originalFilename || singleFile.newFilename,
			);
			fs.writeFileSync(newPath, data);
			fs.unlinkSync(singleFile.filepath); // 임시 파일 삭제

			res
				.status(200)
				.json({ message: 'File uploaded successfully', filePath: newPath });
		} else if (file) {
			const singleFile = file as File;
			const data = fs.readFileSync(singleFile.filepath);
			const newPath = path.join(
				uploadDir,
				singleFile.originalFilename || singleFile.newFilename,
			);
			fs.writeFileSync(newPath, data);
			fs.unlinkSync(singleFile.filepath); // 임시 파일 삭제

			res
				.status(200)
				.json({ message: 'File uploaded successfully', filePath: newPath });
		} else {
			res.status(400).json({ message: 'No file uploaded' });
		}
	});
};

export default handler;
