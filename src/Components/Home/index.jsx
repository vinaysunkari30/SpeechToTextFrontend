import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Transcriptions from "../Transcriptions/index.jsx";
import { RxCross2 } from "react-icons/rx";
import { TailSpin } from "react-loader-spinner";
import { useReactMediaRecorder } from "react-media-recorder";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import "./index.css";

const Home = () => {
  const [fileName, setFileName] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [activeTab, setActiveTab] = useState("Upload");
  const [transcription, setTranscription] = useState("");
  const [transcriptionsList, setTranscriptionsList] = useState([]);
  const [startClicked, setStartClicked] = useState(false);

  const navigate = useNavigate();
  const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder(
    { audio: true }
  );

  useEffect(() => {
    getTranscriptionsList();
  }, [transcription]);

  const getTranscriptionsList = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios(
        "https://speechtotextbackend-2owz.onrender.com/transcriptions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setTranscriptionsList(response.data);
      }
    } catch (error) {
      toast.error("Something went wrong...!");
    }
  };
  const handleUploadTab = () => {
    setActiveTab("Upload");
  };
  const handleRecordTab = () => {
    setActiveTab("Record");
    setFile(null);
  };
  const handleTextTab = () => {
    setActiveTab("Transcriptions");
  };
  const onRemoveFile = () => {
    setFile(null);
    setFileName("");
    setAudioUrl(null);
    setTranscription("");
  };
  const handleFileChange = (e) => {
    setTranscription("");
    setFileName("");
    setFile(null);
    setAudioUrl(null);
    const file = e.target.files[0];
    if (!file) return;
    if (file.type === "audio/mpeg") {
      setFileName(file.name);
      setFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    } else {
      toast.error("File must be .mp3 file");
    }
  };
  const onConvertAudio = async () => {
    const token = Cookies.get("token");
    const formData = new FormData();
    try {
      if (file) {
        formData.append("audio", file);
      } else if (mediaBlobUrl) {
        setLoading(true);
        const response = await fetch(mediaBlobUrl);
        const blob = await response.blob();
        const recordedFile = new File([blob], "recorded-audio.mp3", {
          type: blob.type,
        });
        formData.append("audio", recordedFile);
      } else {
        toast.error("Please upload or record an audio first!");
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:3000/upload-audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.transcriptionText) {
        setLoading(false);
        setTranscription(data.transcriptionText);
        toast.success("Audio converted successfully!");
      } else {
        toast.error("Failed to transcribe audio. Retry!");
        setLoading(false);
      }
    } catch (err) {
      toast.error(err.response?.data);
    }
  };

  const renderUploadUptoMedium = () => (
    <>
      <div className="flex flex-col text-center items-center lg:hidden mt-3">
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-purple-950 text-white font-medium px-4 py-2 rounded-lg w-35"
        >
          Upload Audio
        </label>
        <span className="text-xs">*Audio file should be .mp3</span>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {audioUrl && (
        <div className="w-100">
          <audio controls className="mt-2 w-full">
            <source src={audioUrl} type={file?.type || "audio/mpeg"} />
          </audio>
        </div>
      )}
      {fileName && (
        <div className="text-purple-950 text-md font-medium mt-2 mb-3 flex justify-center items-center gap-3">
          <span className="border-2 p-2 rounded-md flex items-center">
            Audio File:
            <span className="text-blue-600 mr-2 ml-2">{fileName}</span>
            <RxCross2
              className="bg-red-600 text-white rounded-full cursor-pointer"
              onClick={onRemoveFile}
            />
          </span>
          {isLoading ? (
            <TailSpin
              height="40"
              width="40"
              color="#4fa94d"
              ariaLabel="tail-spin-loading"
              visible={isLoading}
            />
          ) : (
            <button className="convert ml-3" onClick={onConvertAudio}>
              Convert
            </button>
          )}
        </div>
      )}
    </>
  );

  const renderRecordUptoMedium = () => (
    <div className="flex flex-col justify-center items-center mb-3 mt-3">
      <div className="flex flex-col justify-center items-center">
        {startClicked ? (
          ""
        ) : (
          <div className="p-1 w-100">
            <p className="text-purple-950 mb-5 text-2xl font-semibold font-serif text-center">
              Start Recording and See your words as a Text
            </p>
          </div>
        )}
        <div className="flex gap-5 justify-center mb-4">
          <button
            className="start-btn text-white rounded-lg px-3 py-1"
            onClick={startRecording}
          >
            Start
          </button>
          <button
            className="stop-btn text-white rounded-lg px-3 py-1"
            onClick={stopRecording}
          >
            Stop
          </button>
        </div>
        {mediaBlobUrl && <audio src={mediaBlobUrl} controls className="mb-4" />}
      </div>
      {mediaBlobUrl && (
        <button className="convert ml-3 mb-3" onClick={onConvertAudio}>
          Convert
        </button>
      )}
      {isLoading ? (
        <TailSpin
          height="40"
          width="40"
          color="#4fa94d"
          ariaLabel="tail-spin-loading"
          visible={isLoading}
        />
      ) : (
        ""
      )}
    </div>
  );

  const renderUploadUptoLarge = () => (
    <>
      <div className="flex flex-col mb-3 mt-5">
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-purple-950 text-white font-medium px-4 py-2 rounded-lg w-35"
        >
          Upload Audio
        </label>
        <span className="text-xs">*Audio file should be .mp3</span>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {audioUrl && (
        <div className="w-100">
          <audio controls className="w-full">
            <source src={audioUrl} type={file?.type || "audio/mpeg"} />
          </audio>
        </div>
      )}
      {fileName && (
        <p className="text-purple-950 text-md font-medium mt-1 mb-3 gap-3 flex items-center">
          <span className="border-2 p-2 rounded-md flex items-center">
            Audio File:
            <span className="text-blue-600 mr-2 ml-2">{fileName}</span>
            <RxCross2
              className="bg-red-600 text-white rounded-full cursor-pointer"
              onClick={onRemoveFile}
            />
          </span>
          {isLoading ? (
            <TailSpin
              height="40"
              width="40"
              color="#4fa94d"
              ariaLabel="tail-spin-loading"
              visible={isLoading}
            />
          ) : (
            <button className="convert ml-3 rounded-lg text-center pl-5 pb-2" onClick={onConvertAudio}>
              Convert
            </button>
          )}
        </p>
      )}
    </>
  );

  const renderRecordUptoLarge = () => (
    <>
      <div className="w-100 flex flex-col justify-center items-center mt-5 pt-4">
        <div>
          <div className="flex gap-4 justify-center mb-4">
            <button className="start-btn text-white rounded-lg px-3 py-1" onClick={startRecording}>
              Start
            </button>
            <button className="stop-btn text-white rounded-lg px-3 py-1" onClick={stopRecording}>
              Stop
            </button>
          </div>
          {mediaBlobUrl && (
            <audio src={mediaBlobUrl} controls className="mb-4" />
          )}
        </div>
        {mediaBlobUrl && (
          <button className="convert ml-3 rounded-lg text-center pl-5 pb-2" onClick={onConvertAudio}>
            Convert
          </button>
        )}
        {isLoading ? (
          <TailSpin
            height="40"
            width="40"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            visible={isLoading}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );

  const onLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  useEffect(() => {
    const jwtToken = Cookies.get("token");
    if (!jwtToken) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col justify-start items-center pb-3 h-full md:h-screen ">
      <div className="w-full flex justify-between items-center bg-cyan-800 p-2 mb-3">
        <p className="logo text-white text-2xl font-serif font-semibold">
          Speech to Text
        </p>
        <button className="logout rounded-lg px-4 py-2" onClick={onLogout}>
          Logout
        </button>
      </div>
      <h1 className="text-center text-2xl text-purple-950 font-semibold font-serif underline decoration-2 mb-2">
        Speech to Text
      </h1>
      <p className="text-slate-600 text-center font-medium text-xl mb-4">
        Turn your voice into meaningful words
        <br /> with Artificial Intelligence
      </p>
      <div className="tabs flex gap-3 mb-2 lg:hidden mt-3 w-100 items-center">
        <div className="flex flex-1">
          <button
            onClick={handleUploadTab}
            className={`tab-btn text-sky-900 w-full text-2xl px-2 py-1 rounded-lg cursor-pointer font-semibold border-2
          ${activeTab === "Upload" ? "underline decoration-2 bg-sky-900" : ""}`}
          >
            Upload
          </button>
        </div>
        <div className="flex flex-1">
          <button
            onClick={handleRecordTab}
            className={`tab-btn text-sky-900 w-full text-xl px-2 py-1 rounded-lg cursor-pointer font-semibold
          ${activeTab === "Record" ? "underline decoration-2 bg-sky-900" : ""}`}
          >
            Record
          </button>
        </div>
        <div className="flex flex-1">
          <button
            onClick={handleTextTab}
            className={`tab-btn text-sky-900 text-xl px-2 py-1 rounded-lg cursor-pointer font-semibold
          ${
            activeTab === "Transcriptions"
              ? "underline decoration-2 bg-sky-900"
              : ""
          }`}
          >
            Transcriptions
          </button>
        </div>
      </div>
      {activeTab === "Transcriptions" && (
        <div className="pl-2 pr-2 lg:hidden md:w-180 sm:w-full">
          <ul className="mt-2 p-4 pt-2 rounded-lg trans-div text-center">
            <p className="text-3xl mb-3 font-medium text-center underline decoration-2 font-serif text-purple-950">
              Transcriptions
            </p>

            {transcriptionsList.length > 0 ? (
              transcriptionsList.map((each) => (
                <Transcriptions key={each.id} data={each} />
              ))
            ) : (
              <>
                <h1 className="text-sky-900 font-semibold text-3xl">
                  You have no Transcriptions
                </h1>
                <p className="text-sky-900 text-xl font-semibold">
                  Upload or Record the speech and transfer into Text
                </p>
              </>
            )}
          </ul>
        </div>
      )}
      {/* For small & medium devices */}
      <div className="md:flex sm:block lg:hidden justify-evenly w-full items-center mt-5">
        <div className="flex-1">
          {activeTab === "Upload" && renderUploadUptoMedium()}
          {activeTab === "Record" && renderRecordUptoMedium()}
        </div>
        <div className="flex-1 justify-center flex items-center">
          {activeTab === "Upload" || activeTab === "Record" ? (
            <div className="text-left lg-hidden">
              <h2 className="text-sky-900 font-bold text-2xl ">
                Transcription:
              </h2>
              <div className="border-2 border-sky-900 rounded-xl w-100 md:w-90 h-50 break-words overflow-y-scroll no-scrollbar">
                <p className="p-2 text-md font-semibold text-purple-950">
                  {transcription}
                </p>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      {/* For large devices */}
      <div className="hidden lg:flex flex flex-row justify-between w-270">
        <div className="flex flex-row text-center justify-evenly items-center p-3">
          <div className="flex flex-col justify-center items-center gap-3 pt-5">
            <div className="flex flex-row gap-10">
              <div className="flex flex-1">
                <button
                  onClick={handleUploadTab}
                  className={`tab-btn text-sky-900 w-full px-3 py-1 text-xl rounded-lg cursor-pointer font-semibold
                ${
                  activeTab === "Upload"
                    ? "underline decoration-2 bg-sky-900"
                    : ""
                }`}
                >
                  Upload
                </button>
              </div>
              <div className="flex flex-1">
                <button
                  onClick={handleRecordTab}
                  className={`tab-btn text-sky-900 w-full px-3 py-1 rounded-lg text-xl cursor-pointer font-semibold
                ${
                  activeTab === "Record"
                    ? "underline decoration-2 bg-sky-900"
                    : ""
                }`}
                >
                  Record
                </button>
              </div>
            </div>
            {activeTab === "Upload" && renderUploadUptoLarge()}
            {activeTab === "Record" && renderRecordUptoLarge()}
            <div className="text-left">
              <h2 className="text-sky-900 font-bold text-2xl">
                Transcription:
              </h2>
              <div className="border-2 border-sky-900 rounded-xl w-100 h-50 break-words overflow-y-scroll no-scrollbar">
                <p className="p-2 text-md font-semibold text-purple-950">
                  {transcription}
                </p>
              </div>
            </div>
          </div>
          <div className="trans-div bg-white rounded-xl pl-6 pr-6 pt-1 max-h-130 overflow-y-auto no-scrollbar pb-5 ml-8">
            <p className="text-4xl mt-4 mb-5 font-semibold text-center font-serif underline decoration-2 text-purple-950">
              Transcriptions
            </p>
            {transcriptionsList.length > 0 ? (
              <ul className="mt-1">
                {transcriptionsList.map((each) => (
                  <Transcriptions key={each.id} data={each} />
                ))}
              </ul>
            ) : (
              <>
                <p className="text-sky-900 text-xl font-semibold">
                  You have no transcriptions
                </p>
                <p className="text-sky-900 text-xl font-semibold">
                  Upload or Record the speech and transfer into Text
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
