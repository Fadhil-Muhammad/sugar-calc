import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../auth/authcontect";
import { FaRegSmile, FaMeh, FaRegFrown, FaRegDizzy } from "react-icons/fa";
import { db } from "../auth/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { IoIosLogIn } from "react-icons/io";

export default function SugarEmote() {
  const { user } = useContext(AuthContext);
  const [dailySugar, setDailySugar] = useState(null);

  useEffect(() => {
    const fetchDailySugar = async () => {
      if (user) {
        const today = new Date().toISOString().split("T")[0];
        const userDailySugarRef = collection(db, "userDailySugar");
        const q = query(
          userDailySugarRef,
          where("userId", "==", user.uid),
          where("date", "==", today)
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setDailySugar(querySnapshot.docs[0].data());
        } else {
          setDailySugar({ totalSugar: 0 }); // Set default if no data for today
        }
      }
    };

    fetchDailySugar();
  }, [user]);

  const getSugarInfo = () => {
    const sugarIntake = dailySugar?.totalSugar || 0;
    let maxSugar = 36;
    if (user && user.gender == "female") {
      maxSugar = 25;
    }
    const percentage = (sugarIntake / maxSugar) * 100;
    let message, barColor, emote;

    if (percentage <= 20) {
      message = "Excellent! Your sugar intake is very low.";
      barColor = "bg-emerald-400";
      emote = <FaRegSmile className="text-emerald-400" size={50} />;
    } else if (percentage <= 40) {
      message = "Good job! Your sugar intake is within a healthy range.";
      barColor = "bg-green-500";
      emote = <FaRegSmile className="text-green-500" size={50} />;
    } else if (percentage <= 60) {
      message = "Be careful! Your sugar intake is getting high.";
      barColor = "bg-yellow-500";
      emote = <FaMeh className="text-yellow-500" size={50} />;
    } else if (percentage <= 80) {
      message = "Warning! Your sugar intake is excessive.";
      barColor = "bg-orange-500";
      emote = <FaRegFrown className="text-orange-500" size={50} />;
    } else if (percentage <= 100) {
      message = "Danger! Your sugar intake is very high.";
      barColor = "bg-red-500";
      emote = <FaRegFrown className="text-red-500" size={50} />;
    } else {
      message = "Extreme danger! Your sugar intake is alarmingly high.";
      barColor = "bg-purple-600";
      emote = <FaRegDizzy className="text-purple-600" size={50} />;
    }

    return { sugarIntake, percentage, message, barColor, emote };
  };

  const { sugarIntake, percentage, message, barColor, emote } = getSugarInfo();

  return user ? (
    <div className="w-full max-w-xl flex">
      <div className="mr-4 flex items-center rounded-xl">{emote}</div>
      <div className="flex-1">
        <div className="mb-2 flex justify-between items-center">
          <span className="font-bold flex items-center">
            Sugar Intake: {sugarIntake}g
          </span>
          <span className="text-sm">{percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full max-w-[150%] ${barColor}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
      </div>
    </div>
  ) : (
    <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center mb-4">
        <FaRegFrown className="text-gray-400 mr-2" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">
          Sugar Intake Tracker
        </h2>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        You need to log in to use this feature and track your sugar intake.
      </p>
      <Link
        to="/auth"
        className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 flex items-center justify-center"
      >
        <IoIosLogIn size={24} className="mr-2" />
        <span>Log In to Start Tracking</span>
      </Link>
    </div>
  );
}
