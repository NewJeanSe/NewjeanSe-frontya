import { useRouter } from 'next/router';
import React from 'react';

const UserDataBaseDetailed: React.FC = () => {
	const router = useRouter();
	const { name } = router.query;

	return (
		<div>
			<h1>{name}의 상세 페이지</h1>
			<p>여기에서 {name}의 세부 정보를 볼 수 있습니다.</p>
		</div>
	);
};

export default UserDataBaseDetailed;
