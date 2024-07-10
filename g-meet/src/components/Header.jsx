import Googlelogo from "../lib/images/google-image.png";
import { Settings } from "lucide-react";
import { CircleHelp } from "lucide-react";

const Header = () => {
  return (
    <>
      <div className="flex items-center p-4 justify-between ">
        <img className="w-44 p-4" src={Googlelogo} alt="logo" />
        <div className=" p-4 flex gap-3">
          <Settings />
          <CircleHelp />
        </div>
      </div>
    </>
  );
};

export default Header;
