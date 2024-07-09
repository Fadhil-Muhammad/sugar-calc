import { Link } from "react-router-dom";
import { IoIosLogIn } from "react-icons/io";
import { AuthContext } from "../auth/authcontect";
import { useContext } from "react";

function NotUser() {
  const { user } = useContext(AuthContext);
  if (!user) {
    return (
      <>
        <div className="fixed items-center left-1/2 transform top-0 -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg z-50 text-center">
          <p>Log in to save your daily sugar calculation</p>
          <Link to="/auth" className="inline-block hover:text-green-900">
            <IoIosLogIn size={50} />
          </Link>
        </div>
      </>
    );
  }
}

export default NotUser;
