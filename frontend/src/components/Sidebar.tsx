import Logo from "../icons/Logo";
import TwitterIcon from "../icons/TwitterIcon";
import YoutubeIcon from "../icons/YoutubeIcon";
import SidebarItem from "./SidebarItem";

const Sidebar = () => {
  return (
    <div className="h-screen bg-white border-r border-slate-200 w-72 fixed left-0 top-0 pl-6">
      <div className="flex text-2xl pt-4 items-center font-bold text-gray-800">
        <div className="pr-4 text-custom-blue">
          <Logo />
        </div>
        Second Brain
      </div>
      <div className="pt-4 pl-4">
        <SidebarItem text="Tweets" icon={<TwitterIcon />}></SidebarItem>
        <SidebarItem text="Videos" icon={<YoutubeIcon />}></SidebarItem>
      </div>
    </div>
  );
};

export default Sidebar;
