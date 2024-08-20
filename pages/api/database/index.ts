import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// 데이터베이스 파일 경로 설정
const filePath = path.join(process.cwd(), 'data', 'database.json');

// 데이터베이스를 읽어오는 함수
const readDatabase = () => {
	const data = fs.readFileSync(filePath, 'utf-8');
	return JSON.parse(data);
};

// 데이터베이스에 데이터를 쓰는 함수
const writeDatabase = (data: any) => {
	fs.writeFileSync(filePath, JSON.stringify(data, null, 2)); // JSON 데이터를 포맷팅하여 저장
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const database = readDatabase(); // 요청이 들어오면 데이터베이스를 읽어옴

	// GET 요청 처리: 데이터베이스의 내용을 반환
	if (req.method === 'GET') {
		res.status(200).json(database);
	}
	// POST 요청 처리: 새로운 항목을 추가
	else if (req.method === 'POST') {
		const { id, name, type, dueDate, amountDue, powerUsage, imagePath } =
			req.body;

		// 유효성 검사: id, name, type, imagePath가 필수
		if (!id || !name || !type || (type === 'bill' && !imagePath)) {
			res.status(400).json({ error: 'Invalid input' });
			return;
		}

		// 새 항목 생성
		const newEntry = {
			id,
			name,
			createdDate: new Date().toISOString().split('T')[0], // 현재 날짜를 생성일로 설정
			updatedDate: new Date().toISOString().split('T')[0], // 현재 날짜를 업데이트일로 설정
		};

		if (type === 'district') {
			// 시/군/구 데이터베이스에 추가
			database.districts.push(newEntry);
		} else if (type === 'bill') {
			// 전기 요금 데이터베이스에 추가
			const billEntry = {
				...newEntry,
				dueDate,
				amountDue,
				powerUsage,
				imagePath, // imagePath 추가
			};
			database.bills.push(billEntry);
		} else {
			// 지원하지 않는 타입인 경우 오류 반환
			res.status(400).json({ error: 'Invalid type' });
			return;
		}

		// 데이터베이스 업데이트
		writeDatabase(database);
		res.status(201).json({ message: 'Entry added successfully' });
	}
	// PUT 요청 처리: 항목 업데이트
	else if (req.method === 'PUT') {
		const { id, dueDate, amountDue, powerUsage } = req.body;

		// 데이터베이스에서 해당 ID의 항목 찾기
		const billIndex = database.bills.findIndex((bill: any) => bill.id === id);

		if (billIndex === -1) {
			res.status(404).json({ error: 'Bill not found' });
			return;
		}

		// 항목 업데이트
		database.bills[billIndex] = {
			...database.bills[billIndex],
			dueDate,
			amountDue,
			powerUsage,
			updatedDate: new Date().toISOString().split('T')[0], // 업데이트일 갱신
		};

		// 데이터베이스 업데이트
		writeDatabase(database);
		res.status(200).json({ message: 'Entry updated successfully' });
	}
	// DELETE 요청 처리: 항목 삭제
	else if (req.method === 'DELETE') {
		const { ids, type } = req.body;

		// 유효성 검사: ids와 type이 필수
		if (!ids || !type) {
			res.status(400).json({ error: 'Invalid input' });
			return;
		}

		if (type === 'district') {
			// 시/군/구 데이터베이스에서 항목 삭제
			database.districts = database.districts.filter(
				(district: any) => !ids.includes(district.id),
			);
		} else if (type === 'bill') {
			// 전기 요금 데이터베이스에서 항목 삭제
			database.bills = database.bills.filter(
				(bill: any) => !ids.includes(bill.id),
			);
		} else {
			// 지원하지 않는 타입인 경우 오류 반환
			res.status(400).json({ error: 'Invalid type' });
			return;
		}

		// 데이터베이스 업데이트
		writeDatabase(database);
		res.status(200).json({ message: 'Entries deleted successfully' });
	}
	// 지원하지 않는 HTTP 메소드 처리
	else {
		res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']); // 지원하는 메소드들을 명시
		res.status(405).end(`Method ${req.method} Not Allowed`); // 405 Method Not Allowed 반환
	}
}
