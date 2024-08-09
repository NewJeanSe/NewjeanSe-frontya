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
      resultData = JSON.parse(result as string);
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
          <div className={styles.divider} />{" "}
          {/* 이미지와 텍스트 사이의 구분선 */}
          <div className={styles.detailsContainer}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>납기일 :</span>
              <span className={styles.detailValue}>{dueDate}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>청구 금액 :</span>
              <span className={styles.detailValue}>{amountDue} 원</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>사용 전력량 :</span>
              <span className={styles.detailValue}>{powerUsage} kW/h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OCRResult;
