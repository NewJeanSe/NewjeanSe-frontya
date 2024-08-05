import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './sideBar.module.css';
import Image from 'next/image';

const SideBar: React.FC = () => {
	const [isOpen, setIsOpen] = useState(true);
	const [width, setWidth] = useState(800); // 기본 너비를 800px로 설정합니다.
	const sidebarRef = useRef<HTMLDivElement>(null);
	const isResizing = useRef(false);

	const toggleSidebar = () => {
		setIsOpen(!isOpen);
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		isResizing.current = true;
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (isResizing.current && sidebarRef.current) {
			const newWidth =
				e.clientX - sidebarRef.current.getBoundingClientRect().left;
			if (newWidth > 0 && newWidth < 1200) {
				// 최소 및 최대 너비 설정
				setWidth(newWidth);
			}
		}
	};

	const handleMouseUp = useCallback(() => {
		isResizing.current = false;
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
	}, []);

	useEffect(() => {
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [handleMouseUp]);

	return (
		<div
			ref={sidebarRef}
			className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
			style={{ width: isOpen ? width : 0 }}
		>
			<div className={styles.toggleButton} onClick={toggleSidebar}>
				<Image
					src={
						isOpen
							? '/images/mainMap/닫기 이미지.svg'
							: '/images/mainMap/열기 이미지.svg'
					}
					alt="Toggle Sidebar"
					width={25}
					height={25}
				/>
			</div>
			<div className={styles.resizeButton} onMouseDown={handleMouseDown} />
			<div className={styles.content}>
				{[...Array(6)].map((_, index) => (
					<div key={index} className={styles.section}>
						<div className={styles.sectionHeader}>Section {index + 1}</div>
						<div className={styles.sectionContent}>
							<div className={styles.chartPlaceholder}>
								Chart space for section {index + 1}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default SideBar;
