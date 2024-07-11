import { BsClockHistory } from "react-icons/bs";
import { RiHomeSmile2Fill } from "react-icons/ri";
import { RiDrinks2Fill } from "react-icons/ri";
import { RiUser5Fill } from "react-icons/ri";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const NavItem = ({ to, icon, tooltip }) => (
  <li>
    <Link
      to={to}
      className="relative group flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-700 hover:bg-indigo-500 transition-all hover:scale-110 duration-300 ease-in-out"
    >
      <div className="text-white group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <span className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        {tooltip}
      </span>
    </Link>
  </li>
);

const SideBar = () => {
  return (
    <nav className="fixed left-0 top-10 h-full w-20 bg-gray-100 text-white shadow-sm flex flex-col items-center justify-center py-8 z-50">
      <ul className="space-y-8">
        <NavItem to="/" icon={<RiHomeSmile2Fill size={28} />} tooltip="Home" />
        <NavItem
          to="/calc"
          icon={<RiDrinks2Fill size={28} />}
          tooltip="Calculator"
        />
        <NavItem
          to="/user"
          icon={<BsClockHistory size={28} />}
          tooltip="History"
        />
        <NavItem to="/auth" icon={<RiUser5Fill size={28} />} tooltip="User" />
      </ul>
    </nav>
  );
};

export default SideBar;
