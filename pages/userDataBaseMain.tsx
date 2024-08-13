import React, { useState, useEffect } from 'react';
import UserDBHeaderBar from '../components/userDB/userDBHeaderBar';
import styles from '@/styles/userDB/userDataBaseMain.module.css';
import Image from 'next/image';
import CreateUserDBModal from '@/components/modal/userDB/createUserDBModal';
import DeleteUserDBModal from '@/components/modal/userDB/deleteUserDBModal';

interface DatabaseItem {
	id: string;
	name: string;
	createdDate: string;
	updatedDate: string;
}

const UserDataBaseMain: React.FC = () => {
	const [districtDatabase, setDistrictDatabase] = useState<DatabaseItem[]>([]);
	const [electricityBillDatabase, setElectricityBillDatabase] = useState<
		DatabaseItem[]
	>([]);
	const [checkedDistricts, setCheckedDistricts] = useState<string[]>([]);
	const [checkedBills, setCheckedBills] = useState<string[]>([]);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
	const [selectedDatabaseType, setSelectedDatabaseType] = useState<
		'district' | 'bill'
	>('district');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	useEffect(() => {
		const fetchDatabase = async () => {
			const response = await fetch('/api/database');
			const data = await response.json();
			setDistrictDatabase(data.districts);
			setElectricityBillDatabase(data.bills);
		};

		fetchDatabase();
	}, []);

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
			const selectedItem = selectedItems[0];
			if (selectedDatabaseType === 'district') {
				window.open(`/userDataBaseDetailed/${selectedItem}`, '_blank');
			} else {
				window.open(`/OCRDataBaseDetailed/${selectedItem}`, '_blank');
			}
		} else {
			alert('보안 상의 이유로 한 번에 여러 개의 탭을 여는 것을 제한합니다.');
		}
	};

	const handleDoubleClick = (id: string) => {
		if (selectedDatabaseType === 'district') {
			window.open(`/userDataBaseDetailed/${id}`, '_blank');
		} else {
			window.open(`/OCRDataBaseDetailed/${id}`, '_blank');
		}
	};

	const handleAdd = async (name: string) => {
		const type = selectedDatabaseType;
		const newItem = {
			id: crypto.randomUUID(),
			name,
			createdDate: new Date().toISOString().split('T')[0],
			updatedDate: new Date().toISOString().split('T')[0],
		};

		const response = await fetch('/api/database', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ ...newItem, type }),
		});

		if (response.ok) {
			if (type === 'district') {
				setDistrictDatabase(prev => [...prev, newItem]);
			} else {
				setElectricityBillDatabase(prev => [...prev, newItem]);
			}
		} else {
			console.error('Failed to add item');
		}
	};

	const handleDeleteSelected = async () => {
		const selectedItems =
			selectedDatabaseType === 'district' ? checkedDistricts : checkedBills;
		const selectedNames = selectedItems.map(id =>
			selectedDatabaseType === 'district'
				? districtDatabase.find(item => item.id === id)?.name
				: electricityBillDatabase.find(item => item.id === id)?.name,
		);

		if (selectedItems.length > 0) {
			const response = await fetch('/api/database', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					ids: selectedItems,
					type: selectedDatabaseType,
				}),
			});

			if (response.ok) {
				if (selectedDatabaseType === 'district') {
					setDistrictDatabase(prev =>
						prev.filter(item => !selectedItems.includes(item.id)),
					);
					setCheckedDistricts([]);
				} else {
					setElectricityBillDatabase(prev =>
						prev.filter(item => !selectedItems.includes(item.id)),
					);
					setCheckedBills([]);
				}
			} else {
				console.error('Failed to delete items');
			}
		}

		setIsDeleteModalOpen(false);
	};

	const openCreateModal = (type: 'district' | 'bill') => {
		setSelectedDatabaseType(type);
		setIsCreateModalOpen(true);
	};

	const openDeleteModal = (type: 'district' | 'bill') => {
		setSelectedDatabaseType(type);
		setIsDeleteModalOpen(true);
	};

	return (
		<div className={styles.container}>
			<UserDBHeaderBar onToggleSidebar={() => {}} isSidebarVisible={true} />
			<div className={styles.content}>
				{/* 시/군/구 데이터베이스 */}
				<div className={styles.listContainer}>
					<div className={styles.listTitleContainer}>
						<div className={styles.listTitle}>시/군/구 데이터베이스</div>
						<div className={styles.buttonContainer}>
							<button
								className={styles.iconButton}
								onClick={() => openCreateModal('district')}
							>
								<Image
									src="/images/userDB/DB 테이블 추가.svg"
									alt="DB 테이블 추가하기"
									width={24}
									height={24}
								/>
								<span>목록 추가</span>
							</button>
							<button
								className={styles.iconButton}
								onClick={() => openDeleteModal('district')}
							>
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
												districtDatabase.map(item => item.id),
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
								<tr key={district.id}>
									<td>
										<input
											type="checkbox"
											checked={checkedDistricts.includes(district.id)}
											onChange={e =>
												checkHandler(e, district.id, setCheckedDistricts)
											}
										/>
									</td>
									<td
										onDoubleClick={() => handleDoubleClick(district.id)}
										style={{ cursor: 'pointer' }}
									>
										{district.name}
									</td>
									<td>{district.createdDate}</td>
									<td>{district.updatedDate}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* 전기 요금 데이터베이스 */}
				<div className={styles.listContainer}>
					<div className={styles.listTitleContainer}>
						<div className={styles.listTitle}>전기 요금 데이터베이스</div>
						<div className={styles.buttonContainer}>
							<button
								className={styles.iconButton}
								onClick={() => openDeleteModal('bill')}
							>
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
												electricityBillDatabase.map(item => item.id),
											)
										}
									/>
								</th>
								<th>전기 요금 고지서 목록</th>
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
								<tr key={bill.id}>
									<td>
										<input
											type="checkbox"
											checked={checkedBills.includes(bill.id)}
											onChange={e => checkHandler(e, bill.id, setCheckedBills)}
										/>
									</td>
									<td
										onDoubleClick={() => handleDoubleClick(bill.id)}
										style={{ cursor: 'pointer' }}
									>
										{bill.name}
									</td>
									<td>{bill.createdDate}</td>
									<td>{bill.updatedDate}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{isCreateModalOpen && (
				<CreateUserDBModal
					onClose={() => setIsCreateModalOpen(false)}
					onAdd={handleAdd}
				/>
			)}

			{isDeleteModalOpen && (
				<DeleteUserDBModal
					onClose={() => setIsDeleteModalOpen(false)}
					onConfirm={handleDeleteSelected}
					selectedItems={
						selectedDatabaseType === 'district'
							? checkedDistricts
							: checkedBills
					}
					selectedItemNames={
						selectedDatabaseType === 'district'
							? checkedDistricts.map(
									id =>
										districtDatabase.find(item => item.id === id)?.name || '',
								)
							: checkedBills.map(
									id =>
										electricityBillDatabase.find(item => item.id === id)
											?.name || '',
								)
					}
				/>
			)}
		</div>
	);
};

export default UserDataBaseMain;
