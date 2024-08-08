import React from "react";
import { useRouter } from "next/router";
import HeaderBar from "../components/mainMap/headerBar";
import styles from "../styles/OCRResult/OCRResult.module.css";

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

  const imageUrl = resultData ? resultData.imagePath : "";
  const dueDate = resultData ? 1 : 0;
  const amountDue = resultData ? 1 : 0;
  const powerUsage = resultData ? 1 : 0;

  return (
    <div>
      <HeaderBar showSidebarToggle={false} />
      <div className={styles.content}>
        <h2>OCR 결과창</h2>
        <div className={styles.resultContainer}>
          {imageUrl && (
            <div className={styles.imageContainer}>
              <img
                src={imageUrl}
                alt="Uploaded file"
                className={styles.image}
              />
            </div>
          )}
          <p>납기일 : {dueDate}</p>
          <p>청구 금액 : {amountDue}</p>
          <p>사용 전력량 : {powerUsage}</p>
        </div>
      </div>
    </div>
  );
};

export default OCRResult;
