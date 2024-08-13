import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'database.json');

const getDatabase = () => {
	if (!fs.existsSync(filePath)) {
		return { districts: [], bills: [] };
	}
	const data = fs.readFileSync(filePath, 'utf-8');
	return JSON.parse(data);
};

const saveDatabase = (database: any) => {
	fs.writeFileSync(filePath, JSON.stringify(database, null, 2));
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const database = getDatabase();
	const { name } = req.query;

	if (req.method === 'DELETE') {
		database.districts = database.districts.filter(
			(item: any) => item.name !== name,
		);
		database.bills = database.bills.filter((item: any) => item.name !== name);

		saveDatabase(database);
		return res.status(200).json({ message: 'Item deleted successfully' });
	}

	res.setHeader('Allow', ['DELETE']);
	return res.status(405).end(`Method ${req.method} Not Allowed`);
}
