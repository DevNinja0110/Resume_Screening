import FileUpload from "./components/FileUpload";
import { useState } from "react";
import axios from "axios"; // Add axios for HTTP requests
import { Bars } from "react-loading-icons";
import Modal from "react-modal";
import { PieChart } from "react-minimal-pie-chart";

Modal.setAppElement("#root");

function App() {
  const [isPdfSelected, setIsPdfSelected] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [fileNames, setFileNames] = useState(["Click to choose files."]);

  const [responses, setResponses] = useState([]);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "80%",
      background: "#112B46",
      height:"80%"
    },
  };

  const handleFileChange = (newFiles) => {
    if (newFiles.length > 0) {
      setIsPdfSelected(true);
    } else {
      setIsPdfSelected(false);
    }
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const onHandleNew = () => {
    setIsPdfSelected(false);
    setIsOpenModal(false);
    setJobDescription("");
    setFileNames(["Click to choose files."]);
    setSelectedFiles([]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("job_description", jobDescription);
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log(response.data.scores[0].filename);
      
      const responseObj = response.data.scores.map(score => {
        const messageObject = JSON.parse(score.score);
        return {
          name: score.filename,
          score: messageObject.score,
          summary: messageObject.summary
        };
      });
      setResponses(responseObj);
      setIsOpenModal(true);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  const handleChange = (event) => {
    setJobDescription(event.target.value);
  };

  return (
    <div className="bg-[#0E1D2E] min-h-screen max-[700px]:px-20 pb-8 ">
      <h1 className="text-5xl font-bold text-[#F0F4F8] text-center pt-20">
        Resume Screening Application
      </h1>
      <p className="text-2xl text-[#829AB1] text-center py-10">
        Upload a candidate&#39;s <span className="font-bold ">resume</span> and
        a <span className="font-bold ">job description</span> to get a
        suitability score.
      </p>
      <div className="max-w-[840px] mx-auto ">
        <div className="text-[17px] pb-7">
          <p className="text-[#829AB1] pb-2">
            Enter the Job Description you&#39;re hiring for:
          </p>
          <textarea
            placeholder="Job Description"
            id="Job Description"
            rows={7}
            onChange={handleChange}
            value={jobDescription}
            className="hover:outline-none rounded-lg focus:outline-none px-4 py-2 focus:border-[#0D529B] border-[#112B46] border-2 bg-[#0F2033] text-[#829AB1] w-full transition-all duration-500"
          />
        </div>
        <div className="h-[1px] w-full bg-[#112B46] mb-12 mt-5"></div>
        <FileUpload
          label="Upload the Resume:"
          onFileChange={handleFileChange}
          fileNames={fileNames}
          setFileNames={setFileNames}
        />
        <div className="h-[1px] w-full bg-[#112B46] mb-20 mt-10"></div>
        <button
          disabled={!isPdfSelected && !jobDescription && !isLoading}
          className="bg-[#7520E1] disabled:cursor-not-allowed flex justify-center disabled:bg-[#6d3cae] cursor-pointer  rounded-lg w-full h-[48px] items-center text-center text-white text-[17px] font-bold hover:bg-[#6d3cae] transition-all duration-500"
          onClick={handleSubmit}
        >
          {!isLoading ? "Submit" : <Bars className="h-[20px] w-7" />}
        </button>
      </div>
      <Modal
        isOpen={isOpenModal}
        // onAfterOpen={afterOpenModal}
        // onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="h-[80%] overflow-y-scroll">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Score
              </th>
              <th scope="col" className="px-6 py-3">
                Summary
              </th>
            </tr>
          </thead>
          <tbody>
            {responses.map((res, index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {res.name}
                </th>
                <td className="px-6 py-4">
                  <PieChart
                    data={[
                      {
                        value: parseInt(res.score),
                        color: "#E38627",
                      },
                    ]}
                    lineWidth={30}
                    animate={true}
                    totalValue={100}
                    labelStyle={{
                      fontSize: "25px",
                      fontFamily: "sans-serif",
                      fill: "#E38627",
                    }}
                    labelPosition={0}
                    label={({ dataEntry }) => `${dataEntry.value}%`}
                    style={{ width: "50px", height: "50px" }}
                  />
                </td>
                <td className="px-6 py-4">{res.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <div className=" flex flex-col flex-1 justify-between gap-4 p-10">
            <div className="flex gap-5">
              <button className="bg-[#7520E1] rounded-md disabled:cursor-not-allowed flex justify-center disabled:bg-[#6d3cae] cursor-pointer  px-8 py-2    items-center text-center text-white text-[14px]  hover:bg-[#6d3cae] transition-all duration-500"
            onClick={onHandleNew}
            >New Resume</button>
              <button className="bg-[#7520E1] rounded-md disabled:cursor-not-allowed flex justify-center disabled:bg-[#6d3cae] cursor-pointer  px-8 py-2   items-center text-center text-white text-[14px]  hover:bg-[#6d3cae] transition-all duration-500"
            onClick={closeModal}
            >Close</button>
          </div>
        </div> 
      </Modal>
    </div>
  );
}

export default App;
