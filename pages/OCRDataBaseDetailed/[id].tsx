import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import path from 'path';
import fs from 'fs';
import React from 'react';

interface BillDetailProps {
	bill: {
		name: string;
		createdDate: string;
		updatedDate: string;
		dueDate: string;
		amountDue: number;
		powerUsage: number;
	} | null;
}

const BillDetail: React.FC<BillDetailProps> = ({ bill }) => {
	if (!bill) {
		return <div>해당 데이터를 찾을 수 없습니다.</div>;
	}

	return (
		<div>
			<h1>{bill.name}의 상세 정보</h1>
			<p>생성일자: {bill.createdDate}</p>
			<p>업데이트 일자: {bill.updatedDate}</p>
			<p>납기일: {bill.dueDate}</p>
			<p>청구 금액: {bill.amountDue} 원</p>
			<p>사용 전력량: {bill.powerUsage} kW/h</p>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async context => {
	const { id } = context.params!;
	const databaseFilePath = path.join(process.cwd(), 'data', 'database.json');
	const data = JSON.parse(fs.readFileSync(databaseFilePath, 'utf8'));

	const bill = data.bills.find((bill: any) => bill.id === id) || null;

	return {
		props: {
			bill,
		},
	};
};

export default BillDetail;
