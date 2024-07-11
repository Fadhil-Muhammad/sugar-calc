/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from "react";
import { db } from "../auth/firebase";
import { AuthContext } from "../auth/authcontect";
import { collection, query, where, getDocs } from "firebase/firestore";
import NotUser from "../overlay/notuser";
import { GrCaretPrevious, GrCaretNext } from "react-icons/gr";

function ShowList() {
  const [dailyEntries, setDailyEntries] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      loadUserDrinks(user.uid);
    }
  }, [user]);

  const loadUserDrinks = async (userId) => {
    const userDrinksQuery = query(
      collection(db, "userDailySugar"),
      where("userId", "==", userId)
    );
    const userDrinksSnapshot = await getDocs(userDrinksQuery);
    const userDailyEntries = userDrinksSnapshot.docs.map((doc) => ({
      ...doc.data(),
      firestoreId: doc.id,
    }));
    setDailyEntries(userDailyEntries);
  };

  const groupEntriesByMonthYear = (entries) => {
    const grouped = {};
    entries.forEach((entry) => {
      const date = new Date(entry.date);
      const monthYear = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      if (!grouped[monthYear]) {
        grouped[monthYear] = {};
      }
      grouped[monthYear][entry.date] = entry;
    });
    return grouped;
  };

  const generateCalendarDays = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        i
      ).padStart(2, "0")}`;
      days.push(date);
    }
    return days;
  };

  const groupedEntries = groupEntriesByMonthYear(dailyEntries);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthYear = `${year}-${String(month + 1).padStart(2, "0")}`;
  const calendarDays = generateCalendarDays(year, month);

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl p-8 my-12 w-screen">
      <NotUser />
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Sugar Intake History
      </h1>
      <div className="flex justify-between items-center mb-6 ">
        <button
          onClick={goToPreviousMonth}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-300 ease-in-out hover:scale-125 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          <GrCaretPrevious size={30} />
        </button>
        <h2 className="text-3xl font-semibold text-gray-700 animate-fade-in">
          {months[month]} {year}
        </h2>
        <button
          onClick={goToNextMonth}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-300 ease-in-out hover:scale-125 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          <GrCaretNext size={30} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <div
            key={day}
            className="text-center font-bold text-gray-600 mb-2 animate-fade-in"
            style={{ animationDelay: `${index}ms` }}
          >
            {day}
          </div>
        ))}
        {calendarDays.map((date, index) => {
          const dayOfWeek = new Date(date).getDay();
          const entry = groupedEntries[monthYear]?.[date];
          return index === 0 ? (
            <React.Fragment key={date}>
              {Array(dayOfWeek)
                .fill()
                .map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="h-24 border border-gray-200 rounded-lg bg-gray-50 animate-fade-in opacity-0"
                    style={{ animationDelay: `${i * 20}ms` }}
                  ></div>
                ))}
              <DayCell date={date} entry={entry} index={dayOfWeek + index} />
            </React.Fragment>
          ) : (
            <DayCell
              key={date}
              date={date}
              entry={entry}
              index={index + dayOfWeek}
            />
          );
        })}
      </div>
    </div>
  );
}

function DayCell({ date, entry, index }) {
  const dayNumber = date.split("-")[2];
  const animationDelay = `${index * 20}ms`;

  return (
    <div
      className={`h-24 border border-gray-200 p-1 overflow-auto animate-fade-in opacity-0 ${
        !entry ? "" : entry.warning ? "bg-green-100" : "bg-red-100"
      }`}
      style={{ animationDelay }}
    >
      <div className="font-bold">{dayNumber}</div>
      {entry && (
        <div className="text-xs">
          <p>Sugar: {entry.totalSugar}g</p>
          <p className={entry.warning ? "text-green-500" : "text-red-500"}>
            {entry.warning ? "Safe" : "Unsafe"}
          </p>
        </div>
      )}
    </div>
  );
}

export default ShowList;
