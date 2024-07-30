import { Copy } from "lucide-react";
const MeetingInfo = () => {
  const url = window.location.href;
  const CopyId = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
  };
  return (
    <div className="w-[30%] h-[80%] rounded-md border-2  border-#dbdad8 bg-white absolute top-2 right-2 p-4">
      <div className="flex gap-4 flex-col">
        <h2 className="text-2xl font-normal">Meeting Details</h2>
        <div className="flex gap-2 flex-col">
          <p>Joining info</p>
          {url}
        </div>

        <button
          onClick={CopyId}
          className=" p-2 text-blue-500 font-medium hover:bg-blue-100 w-auto rounded-md flex gap-4"
        >
          <Copy />
          Copy joining info
        </button>
      </div>
    </div>
  );
};

export default MeetingInfo;
