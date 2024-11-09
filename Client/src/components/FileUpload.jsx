import { useRef, useState } from "react";
import icon_upload from "../assets/icons/icon_upload.svg";

const FileUpload = ({ label, onFileChange, fileNames, setFileNames }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    // Programmatically click the file input when the div is clicked
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    if (newFiles.length > 0) {
      if (fileNames.length === 1 && fileNames[0] === "Click to choose files.") {
        setFileNames([]);
      }
      setFileNames(prevFileNames => [...prevFileNames, ...newFiles.map(file => file.name)]);
      onFileChange(newFiles);
    }
  };

  return (
    <div className="pb-7">
      <p className="text-[#829AB1] py-2 text-[17px] ">{label}</p>
      <div
        className="w-full rounded-lg border-2 flex justify-center items-center border-dashed border-[#7c7c7c] hover:border-[#535353] transition-all duration-500"
        onClick={handleClick}
      >
        <input
          type="file"
          className="hidden"
          id="fileInput"
          ref={fileInputRef}
          accept=".pdf,.doc,.docx"
          multiple // Allow multiple file selection
          onChange={handleFileChange}
        />
        <div className="gap-4 flex items-center px-4">
          <img src={icon_upload} alt="upload_icon" />
          <p className="py-8 text-[#9E9D94] cursor-pointer">
            {fileNames.join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;