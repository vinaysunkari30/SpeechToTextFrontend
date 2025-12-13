import './index.css'

const Transcriptions = (props) => {
  const {data} = props
  const {text, audio, createdAt} = data

  const formatDate = (utcDate) => {
    const date = new Date(utcDate);
    const istDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const now = new Date();
    const today = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const diffInDays = Math.floor((today - istDate) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) {
      return `${istDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
    } else if (diffInDays === 1) {
      return `Yesterday at ${istDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
    } else {
      return istDate.toLocaleString("en-IN", { 
        day: "2-digit", 
        month: "short", 
        year: "numeric", 
        hour: "2-digit", 
        minute: "2-digit" 
      });
    }
  };

  return(
    <li className="transcription pt-3 pb-3 pl-3 pr-3 flex flex-col justify-center items-center rounded-md mb-4 bg-white">
      <div className='w-100 flex flex-row justify-start items-center gap-5 mt-2'>
        <p className='text-purple-950 text-xl font-medium underline decoration-2'>Audio:</p>
        <audio controls className="mt-2 w-full">
          <source src={audio} type={"audio/mpeg"} />
        </audio>
      </div>
      <div className='flex mt-4 justify-between items-center w-full'>
        <p className='text-purple-950 text-xl text-left font-medium underline decoration-2 mb-1'>Transcription:</p>
        <p className='text-black text-sm font-medium text-right'>{formatDate(createdAt)}</p>
      </div>
      <p className='text-md text-slate-800 font-medium break-words overflow-y-scroll no-scrollbar max-h-32 pl-2 pt-1 pb-1 border-1 rounded-lg text-left'>{text}</p>
    </li>
  )
}

export default Transcriptions