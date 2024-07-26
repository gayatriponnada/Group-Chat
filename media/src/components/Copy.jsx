import { Copy } from "lucide-react";

const CopyUrl = () => {
  const url = window.location.href;
  const CopyId = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
  };
  return (
    <div className=" p-2">
      <div className="flex justify-between gap-4  bg-[#EEEDEB] p-4 rounded-md w-[40rem]">
        <p>{url}</p>
        <Copy className=" cursor-pointer" onClick={CopyId} />
      </div>
    </div>
  );
};

export default CopyUrl;
