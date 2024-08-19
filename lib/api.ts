const baseUrl = 'http://172.16.0.122:8080/';

export const callEmailVerificationApi = async (email: string) => {
	try {
		const response = await fetch(baseUrl + 'user/sendMail', {
			method: 'POST', // API 요청 메서드 설정 (예: 'POST', 'GET', 'PUT', 'DELETE' 등)
			headers: {
				'Content-Type': 'application/json', // 요청 헤더에 JSON 형식의 데이터를 명시
			},
			body: JSON.stringify({
				email: email,
			}),
		});

		// 서버 응답이 성공적인지 확인
		if (!response.ok) {
			// 상태 코드가 2xx 범위 밖일 경우 오류로 간주
			throw new Error(`API 호출 실패 - 상태 코드: ${response.status}`);
		}

		// JSON 형식으로 응답 데이터를 파싱
		const data = await response.json();
		console.log('API 응답 데이터:', data); // 응답 데이터를 로그에 기록
		return data; // 필요한 경우 호출자에게 반환
	} catch (error) {
		// API 호출 중 오류가 발생한 경우 처리
		console.error('API 호출 중 오류 발생:', error);

		// 연결되지 않음이나 기타 오류 시 예외 처리 로직을 여기에 추가할 수 있습니다.
		// 예를 들어, 백엔드 개발자가 볼 수 있도록 추가 정보를 로그에 남길 수 있습니다.
		// 개발 환경에서는 console.warn을 사용해 더 많은 정보를 노출시킬 수 있습니다.
		console.warn(
			'백엔드 연결이 아직 설정되지 않았을 수 있습니다. API URL 및 데이터 형식을 확인하세요.',
		);

		// 오류 발생 시 호출자에게 명시적인 오류를 반환
		return {
			success: false,
			message: 'API 호출에 실패했습니다. 서버 연결을 확인하세요.',
		};
	}
};

export const callNewUserRegisterApi = async (
	username: string,
	password: string,
	nickname: string,
	email: string,
) => {
	try {
		const response = await fetch(baseUrl + 'user/register', {
			method: 'POST', // API 요청 메서드 설정 (예: 'POST', 'GET', 'PUT', 'DELETE' 등)
			headers: {
				'Content-Type': 'application/json', // 요청 헤더에 JSON 형식의 데이터를 명시
			},
			body: JSON.stringify({
				username: username,
				password1: password,
				nickname: nickname,
				email: email,
			}),
		});

		// 서버 응답이 성공적인지 확인
		if (!response.ok) {
			// 상태 코드가 2xx 범위 밖일 경우 오류로 간주
			throw new Error(`API 호출 실패 - 상태 코드: ${response.status}`);
		}

		// JSON 형식으로 응답 데이터를 파싱
		const data = await response.json();
		console.log('API 응답 데이터:', data); // 응답 데이터를 로그에 기록
		return data; // 필요한 경우 호출자에게 반환
	} catch (error) {
		// API 호출 중 오류가 발생한 경우 처리
		console.error('API 호출 중 오류 발생:', error);

		// 연결되지 않음이나 기타 오류 시 예외 처리 로직을 여기에 추가할 수 있습니다.
		// 예를 들어, 백엔드 개발자가 볼 수 있도록 추가 정보를 로그에 남길 수 있습니다.
		// 개발 환경에서는 console.warn을 사용해 더 많은 정보를 노출시킬 수 있습니다.
		console.warn(
			'백엔드 연결이 아직 설정되지 않았을 수 있습니다. API URL 및 데이터 형식을 확인하세요.',
		);

		// 오류 발생 시 호출자에게 명시적인 오류를 반환
		return {
			success: false,
			message: 'API 호출에 실패했습니다. 서버 연결을 확인하세요.',
		};
	}
};

export const callLoginApi = async (username: string, password: string) => {
	try {
		const response = await fetch(baseUrl + 'login/login', {
			method: 'POST', // API 요청 메서드 설정 (예: 'POST', 'GET', 'PUT', 'DELETE' 등)
			headers: {
				'Content-Type': 'application/json', // 요청 헤더에 JSON 형식의 데이터를 명시
			},
			body: JSON.stringify({
				username: username,
				password: password,
			}),
		});

		// 응답이 JSON인지 확인 후 처리
		const contentType = response.headers.get('content-type');
		if (contentType && contentType.includes('application/json')) {
			const data = await response.json();
			console.log('API 응답 데이터:', data);
			return data; // JSON 응답 반환
		} else {
			const textData = await response.text();
			console.log('텍스트 응답 데이터:', textData);
			return textData; // 단순 텍스트 응답 반환
		}
	} catch (error) {
		console.error('API 호출 중 오류 발생:', error);
		return {
			success: false,
			message: 'API 호출에 실패했습니다. 서버 연결을 확인하세요.',
		};
	}
};
