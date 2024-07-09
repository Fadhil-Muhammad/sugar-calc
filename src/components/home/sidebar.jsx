import { MdCalculate } from "react-icons/md";
import { RiHomeSmile2Fill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { IoIosLogIn } from "react-icons/io";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <nav
      className="fixed left-0 w-16 h-max  py-2
        border-r-indigo-700 text-black shadow-lg"
    >
      <ul>
        <li>
          <Link to="/" className="hover:text-green-900">
            <SideBarIcon icon={<RiHomeSmile2Fill size={50} />} />
          </Link>
        </li>
        <li>
          <Link to="/calc" className="hover:text-green-900">
            <SideBarIcon icon={<MdCalculate size={50} />} />
          </Link>
        </li>
        <li>
          <Link to="/user" className="hover:text-green-900">
            <SideBarIcon icon={<FaUserCircle size={50} />} />
          </Link>
        </li>
        <li>
          <Link to="/auth" className="hover:text-green-900">
            <SideBarIcon icon={<IoIosLogIn size={50} />} />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

// eslint-disable-next-line react/prop-types
const SideBarIcon = ({ icon }) => <div className="sidebar-icon">{icon}</div>;

export default SideBar;
