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
	type: 'district' | 'bill';
	dueDate?: string;
	amountDue?: number;
	powerUsage?: number;
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

			const districtsWithType = data.districts.map((item: any) => ({
				...item,
				type: 'district',
			}));

			const billsWithType = data.bills.map((item: any) => {
				// amountDue와 powerUsage 값 처리
				const amountDue = parseFloat((item.amountDue ?? '0').replace(/,/g, ''));
				const powerUsage = parseFloat(item.powerUsage ?? '0');

				return {
					...item,
					type: 'bill',
					dueDate: item.dueDate,
					amountDue: isNaN(amountDue) ? 0 : amountDue, // 잘못된 숫자일 경우 0 처리
					powerUsage: isNaN(powerUsage) ? 0 : powerUsage, // 잘못된 숫자일 경우 0 처리
				};
			});

			setDistrictDatabase(districtsWithType);
			setElectricityBillDatabase(billsWithType);
		};

		// 폴링 또는 서버에서 발생한 변경사항을 감지하여 데이터 갱신
		const intervalId = setInterval(fetchDatabase, 5000); // 5초마다 데이터베이스 확인

		fetchDatabase();

		return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 폴링 중지
	}, []);

	const calculateTotals = () => {
		const totalAmountDue = electricityBillDatabase.reduce(
			(acc, item) => acc + (item.amountDue || 0),
			0,
		);
		const totalPowerUsage = electricityBillDatabase.reduce(
			(acc, item) => acc + (item.powerUsage || 0),
			0,
		);
		return { totalAmountDue, totalPowerUsage };
	};

	const { totalAmountDue, totalPowerUsage } = calculateTotals();

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
			const dateA = new Date(a[key] as string).getTime();
			const dateB = new Date(b[key] as string).getTime();

			return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
		});

		setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
		return sortedDatabase;
	};

	const handleOpenSelected = (selectedItems: string[]) => {
		console.log('Selected Items:', selectedItems);

		if (selectedItems.length === 1) {
			const selectedItem = selectedItems[0];
			const district = districtDatabase.find(item => item.id === selectedItem);
			const bill = electricityBillDatabase.find(
				item => item.id === selectedItem,
			);

			let selectedType = '';
			if (district) {
				selectedType = district.type;
			} else if (bill) {
				selectedType = bill.type;
			}

			console.log('Opening item:', selectedItem);
			console.log('Detected Database Type:', selectedType);

			if (selectedType === 'district') {
				console.log('Opening district page');
				window.open(`/userDataBaseDetailed/${selectedItem}`, '_blank');
			} else if (selectedType === 'bill') {
				console.log('Opening bill page');
				window.open(`/OCRDataBaseDetailed/${selectedItem}`, '_blank');
			}
		} else {
			alert('보안 상의 이유로 한 번에 여러 개의 탭을 여는 것을 제한합니다.');
		}
	};

	const handleDoubleClick = (id: string) => {
		const district = districtDatabase.find(item => item.id === id);
		const bill = electricityBillDatabase.find(item => item.id === id);

		let selectedType = '';
		if (district) {
			selectedType = district.type;
		} else if (bill) {
			selectedType = bill.type;
		}

		console.log('Double-clicked ID:', id);
		console.log('Detected Database Type:', selectedType);

		if (selectedType === 'district') {
			console.log('Opening district page');
			window.open(`/userDataBaseDetailed/${id}`, '_blank');
		} else if (selectedType === 'bill') {
			console.log('Opening bill page');
			window.open(`/OCRDataBaseDetailed/${id}`, '_blank');
		} else {
			console.error('Unknown database type:', selectedType);
		}
	};

	const handleAdd = async (name: string) => {
		const type = selectedDatabaseType;
		const newItem: DatabaseItem = {
			id: crypto.randomUUID(),
			name,
			createdDate: new Date().toISOString().split('T')[0],
			updatedDate: new Date().toISOString().split('T')[0],
			type: type,
		};

		const response = await fetch('/api/database', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newItem),
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
		console.log('Opening create modal for:', type);
		setSelectedDatabaseType(type);
		setIsCreateModalOpen(true);
	};

	const openDeleteModal = (type: 'district' | 'bill') => {
		console.log('Opening delete modal for:', type);
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
					<table className={`${styles.districtTable}`}>
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
									<td onDoubleClick={() => handleDoubleClick(district.id)}>
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
					<table className={`${styles.billTable}`}>
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
								<th>청구 금액</th>
								<th>사용 전력량</th>
								<th>납기일</th>
								<th>생성일자</th>
								<th>업데이트 일자</th>
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
									<td onDoubleClick={() => handleDoubleClick(bill.id)}>
										{bill.name}
									</td>
									<td>{(bill.amountDue ?? 0).toLocaleString()} 원</td>{' '}
									{/* 'undefined'일 경우 0으로 처리 */}
									<td>{(bill.powerUsage ?? 0).toLocaleString()} kW/H</td>{' '}
									{/* 'undefined'일 경우 0으로 처리 */}
									<td>{bill.dueDate}</td>
									<td>{bill.createdDate}</td>
									<td>{bill.updatedDate}</td>
								</tr>
							))}
						</tbody>

						<tfoot>
							<tr>
								<th></th> {/* 빈 공간을 위한 열 */}
								<th>총합</th>
								<th>{totalAmountDue.toLocaleString()} 원</th>{' '}
								{/* 로케일에 맞게 출력 */}
								<th>{totalPowerUsage.toLocaleString()} kW/H</th>{' '}
								{/* 로케일에 맞게 출력 */}
								<th colSpan={3}></th>{' '}
								{/* 남은 공간을 채우기 위해 colspan 사용 */}
							</tr>
						</tfoot>
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
