import React, { useState } from 'react';
import UserDBHeaderBar from '../components/userDB/userDBHeaderBar';
import styles from '@/styles/userDB/userDataBaseMain.module.css';
import Image from 'next/image';
import CreateUserDBModal from '@/components/modal/userDB/createUserDBModal';

interface DatabaseItem {
	name: string;
	createdDate: string;
	updatedDate: string;
}

const UserDataBaseMain: React.FC = () => {
	const [districtDatabase, setDistrictDatabase] = useState<DatabaseItem[]>([
		{
			name: '서울시 성북구',
			createdDate: '2023-07-01',
			updatedDate: '2023-08-01',
		},
		{
			name: '서울시 강남구',
			createdDate: '2023-06-15',
			updatedDate: '2023-07-25',
		},
	]);

	const [electricityBillDatabase, setElectricityBillDatabase] = useState<
		DatabaseItem[]
	>([
		{
			name: '2023년 7월 전기 요금',
			createdDate: '2023-07-10',
			updatedDate: '2023-07-30',
		},
		{
			name: '2023년 6월 전기 요금',
			createdDate: '2023-06-05',
			updatedDate: '2023-06-25',
		},
	]);

	const [checkedDistricts, setCheckedDistricts] = useState<string[]>([]);
	const [checkedBills, setCheckedBills] = useState<string[]>([]);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	const toggleSelectAll = (
		list: string[],
		setList: React.Dispatch<React.SetStateAction<string[]>>,
		allItems: string[],
	) => {
		if (list.length === allItems.length) {
			setList([]);
		} else {
			setList(allItems);
		}
	};

	const checkHandler = (
		e: React.ChangeEvent<HTMLInputElement>,
		value: string,
		setList: React.Dispatch<React.SetStateAction<string[]>>,
	) => {
		if (e.target.checked) {
			setList(prev => [...prev, value]);
		} else {
			setList(prev => prev.filter(item => item !== value));
		}
	};

	const sortDatabase = (database: DatabaseItem[], key: keyof DatabaseItem) => {
		const sortedDatabase = [...database].sort((a, b) => {
			const dateA = new Date(a[key]).getTime();
			const dateB = new Date(b[key]).getTime();

			return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
		});

		setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
		return sortedDatabase;
	};

	const handleOpenSelected = (selectedItems: string[]) => {
		if (selectedItems.length === 1) {
			window.open(`/userDataBaseDetailed/${selectedItems[0]}`, '_blank');
		} else {
			alert('보안 상의 이유로 한 번에 여러 개의 탭을 여는 것을 제한합니다.');
		}
	};

	return (
		<div className={styles.container}>
			<UserDBHeaderBar onToggleSidebar={() => {}} isSidebarVisible={true} />
			<div className={styles.content}>
				<div className={styles.listContainer}>
					<div className={styles.listTitleContainer}>
						<div className={styles.listTitle}>시/군/구 데이터베이스</div>
						<div className={styles.buttonContainer}>
							<button
								className={styles.iconButton}
								onClick={() => setIsCreateModalOpen(true)}
							>
								<Image
									src="/images/userDB/DB 테이블 추가.svg"
									alt="DB 테이블 추가하기"
									width={24}
									height={24}
								/>
								<span>목록 추가</span>
							</button>
							<button className={styles.iconButton}>
								<Image
									src="/images/userDB/DB 테이블 삭제.svg"
									alt="DB 테이블 삭제하기"
									width={24}
									height={24}
								/>
								<span>목록 삭제</span>
							</button>
							<button
								className={styles.iconButton}
								onClick={() => handleOpenSelected(checkedDistricts)}
							>
								<Image
									src="/images/userDB/DB 테이블 열기.svg"
									alt="DB 테이블 열기"
									width={24}
									height={24}
								/>
								<span>목록 열기</span>
							</button>
						</div>
					</div>
					<table className={styles.table}>
						<thead>
							<tr>
								<th>
									<input
										type="checkbox"
										checked={
											checkedDistricts.length === districtDatabase.length
										}
										onChange={() =>
											toggleSelectAll(
												checkedDistricts,
												setCheckedDistricts,
												districtDatabase.map(item => item.name),
											)
										}
									/>
								</th>
								<th>시/군/구 테이블 이름</th>
								<th
									onClick={() =>
										setDistrictDatabase(
											sortDatabase(districtDatabase, 'createdDate'),
										)
									}
								>
									생성일자
								</th>
								<th
									onClick={() =>
										setDistrictDatabase(
											sortDatabase(districtDatabase, 'updatedDate'),
										)
									}
								>
									업데이트 일자
								</th>
							</tr>
						</thead>
						<tbody>
							{districtDatabase.map((district, index) => (
								<tr key={index}>
									<td>
										<input
											type="checkbox"
											checked={checkedDistricts.includes(district.name)}
											onChange={e =>
												checkHandler(e, district.name, setCheckedDistricts)
											}
										/>
									</td>
									<td>{district.name}</td>
									<td>{district.createdDate}</td>
									<td>{district.updatedDate}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className={styles.listContainer}>
					<div className={styles.listTitleContainer}>
						<div className={styles.listTitle}>전기 요금 데이터베이스</div>
						<div className={styles.buttonContainer}>
							<button
								className={styles.iconButton}
								onClick={() => setIsCreateModalOpen(true)}
							>
								<Image
									src="/images/userDB/DB 테이블 추가.svg"
									alt="DB 테이블 추가하기"
									width={24}
									height={24}
								/>
								<span>목록 추가</span>
							</button>
							<button className={styles.iconButton}>
								<Image
									src="/images/userDB/DB 테이블 삭제.svg"
									alt="DB 테이블 삭제하기"
									width={24}
									height={24}
								/>
								<span>목록 삭제</span>
							</button>
							<button
								className={styles.iconButton}
								onClick={() => handleOpenSelected(checkedBills)}
							>
								<Image
									src="/images/userDB/DB 테이블 열기.svg"
									alt="DB 테이블 열기"
									width={24}
									height={24}
								/>
								<span>목록 열기</span>
							</button>
						</div>
					</div>
					<table className={styles.table}>
						<thead>
							<tr>
								<th>
									<input
										type="checkbox"
										checked={
											checkedBills.length === electricityBillDatabase.length
										}
										onChange={() =>
											toggleSelectAll(
												checkedBills,
												setCheckedBills,
												electricityBillDatabase.map(item => item.name),
											)
										}
									/>
								</th>
								<th>전기 요금 DB 테이블 이름</th>
								<th
									onClick={() =>
										setElectricityBillDatabase(
											sortDatabase(electricityBillDatabase, 'createdDate'),
										)
									}
								>
									생성일자
								</th>
								<th
									onClick={() =>
										setElectricityBillDatabase(
											sortDatabase(electricityBillDatabase, 'updatedDate'),
										)
									}
								>
									업데이트 일자
								</th>
							</tr>
						</thead>
						<tbody>
							{electricityBillDatabase.map((bill, index) => (
								<tr key={index}>
									<td>
										<input
											type="checkbox"
											checked={checkedBills.includes(bill.name)}
											onChange={e =>
												checkHandler(e, bill.name, setCheckedBills)
											}
										/>
									</td>
									<td>{bill.name}</td>
									<td>{bill.createdDate}</td>
									<td>{bill.updatedDate}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{isCreateModalOpen && (
				<CreateUserDBModal onClose={() => setIsCreateModalOpen(false)} />
			)}
		</div>
	);
};

export default UserDataBaseMain;
