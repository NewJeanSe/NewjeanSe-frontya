import React from "react";
import { useRouter } from "next/router";

const OCRResult: React.FC = () => {
  const router = useRouter();
  const { result } = router.query;

  let resultData;
  if (result) {
    try {
      resultData = JSON.parse(result as string); // JSON 문자열을 객체로 변환
    } catch (e) {
      console.error("Failed to parse result JSON", e);
      resultData = null;
    }
  }

  return (
    <div>
      <h2>OCR 결과창</h2>
      {resultData ? (
        <>
          <p>파일 이름: {resultData.filename}</p>
          <p>OCR 결과: {resultData.text}</p>
        </>
      ) : (
        <p>결과를 불러오는 중입니다...</p>
      )}
    </div>
  );
};

export default OCRResult;
