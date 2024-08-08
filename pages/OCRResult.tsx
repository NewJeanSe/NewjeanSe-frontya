import React from "react";
import { useRouter } from "next/router";

const OCRResult: React.FC = () => {
  const router = useRouter();
  const { fileName } = router.query;

  // fileName이 string | string[] | undefined 중 하나일 수 있음
  const fileNameStr = Array.isArray(fileName) ? fileName[0] : fileName;
  const fileExtension = fileNameStr ? fileNameStr.split(".").pop() : "";

  return (
    <div>
      <h2>OCR 결과창</h2>
      {fileNameStr && (
        <>
          <p>파일 이름: {fileNameStr}</p>
          <p>파일 확장자: {fileExtension}</p>
        </>
      )}
    </div>
  );
};

export default OCRResult;
