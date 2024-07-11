import { Link } from "react-router-dom";
import { IoIosLogIn } from "react-icons/io";
import { AuthContext } from "../auth/authcontect";
import { useContext, useState, useEffect } from "react";

function NotUser() {
  const { user } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (!user) {
    return (
      <div
        className={`fixed top-11 transform right-2 transition-all duration-500 ease-out ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className="bg-gradient-to-tr from-gray-100 to-blue-200 px-6 py-4 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl">
          <p className="text-gray-800 font-medium mb-2 animate-fade-in">
            Log in to save your daily sugar calculation
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center bg-white text-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-300 rounded-full p-2 group animate-bounce"
          >
            <IoIosLogIn
              size={30}
              className="transform group-hover:rotate-12 transition-transform duration-300"
            />
            <span className="ml-2 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Login
            </span>
          </Link>
        </div>
      </div>
    );
  }
  return null;
}

export default NotUser;
