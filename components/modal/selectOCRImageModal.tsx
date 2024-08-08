import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./selectOCRImageModal.module.css";

const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case "image/jpeg":
    case "image/png":
    case "image/gif":
      return "/images/file-icons/이미지 업로드 아이콘.svg";
    case "application/pdf":
      return "/images/file-icons/pdf 파일 아이콘.svg";
    default:
      return "/images/file-icons/디폴트 파일 아이콘.svg";
  }
};

const SelectOCRImageModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setSuccess(false);
    } else {
      setError("파일이 정상적으로 입력되지 않았습니다.");
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError(null);
      setSuccess(false);
    } else {
      setError("파일이 정상적으로 입력되지 않았습니다.");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const uploadFile = async () => {
    if (!file) {
      setError("업로드할 파일이 없습니다.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await fetch("/api/imageUpload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push({
          pathname: "/OCRResult",
          query: { fileName: file.name },
        });
      }, 2000);
    } catch (error) {
      setError("파일이 정상적으로 입력되지 않았습니다.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>
          &times;
        </span>
        <div className={styles.modalHeader}>우리 집 전기 요금 예측하기</div>
        <div
          className={`${styles.modalBody} ${isDragging ? styles.dragging : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className={styles.fileUploadContainer}>
            <div
              className={`${styles.fileUpload} ${isDragging ? styles.dragging : ""}`}
            >
              {!file && !error && !success && (
                <>
                  <span className={styles.fileUploadIcon}>
                    <Image
                      src="/images/file-icons/이미지 업로드 아이콘.svg"
                      alt="Upload Icon"
                      width={50}
                      height={50}
                    />
                  </span>
                  <span className={styles.fileUploadText}>
                    Drag files to upload
                  </span>
                </>
              )}
              {file && (
                <>
                  <span className={styles.fileIcon}>
                    <Image
                      src={getFileIcon(file.type)}
                      alt="File Icon"
                      width={50}
                      height={50}
                    />
                  </span>
                  <span className={styles.fileName}>{file.name}</span>
                  {success && (
                    <>
                      <br />
                      <span className={styles.successAlert}>
                        OCR 스캔이 성공적으로 완료되었습니다!
                      </span>
                    </>
                  )}
                </>
              )}
              {error && <span className={styles.alert}>{error}</span>}
            </div>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <input
            type="file"
            id="fileInput"
            className={styles.fileInput}
            accept="image/*,application/pdf"
            onChange={handleFileChange}
          />
          <label htmlFor="fileInput" className={styles.modalButton}>
            스캔할 이미지 파일 찾아보기
          </label>
          <button className={styles.modalButton} onClick={uploadFile}>
            이미지 스캔하기
          </button>
          {loading && (
            <div className={styles.loadingOverlay}>
              <div className={styles.loadingSpinner}></div>
              <span className={styles.loadingText}>로딩 중...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectOCRImageModal;
