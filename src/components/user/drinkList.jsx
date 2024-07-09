import React, { useState, useEffect, useContext } from "react";
import { db } from "../auth/firebase";
import { AuthContext } from "../auth/authcontect";
import { collection, query, where, getDocs } from "firebase/firestore";
import NotUser from "../overlay/notuser";

function ShowList() {
  const [dailyEntries, setDailyEntries] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { user } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDrinks, setShowDrinks] = useState(false);

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

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowDrinks(true);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthYear = `${year}-${String(month + 1).padStart(2, "0")}`;
  const calendarDays = generateCalendarDays(year, month);

  return (
    <div className="flex-col justify-center items-center m-auto shadow-lg p-6 rounded w-3/4">
      <NotUser />
      <h1 className="flex justify-center text-4xl mb-6">User Drink History</h1>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPreviousMonth}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Previous Month
        </button>
        <h2 className="text-3xl">
          {months[month]} {year}
        </h2>
        <button
          onClick={goToNextMonth}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next Month
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-bold">
            {day}
          </div>
        ))}
        {calendarDays.map((date, index) => {
          const dayOfWeek = new Date(date).getDay();
          const entry = groupedEntries[monthYear]?.[date];
          return index === 0 ? (
            <>
              {Array(dayOfWeek)
                .fill()
                .map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="h-24 border border-gray-200"
                  ></div>
                ))}
              <DayCell key={date} date={date} entry={entry} />
            </>
          ) : (
            <DayCell key={date} date={date} entry={entry} />
          );
        })}
      </div>
    </div>
  );
}

function DayCell({ date, entry }) {
  const dayNumber = date.split("-")[2];
  return (
    <div className="h-24 border border-gray-200 p-1 overflow-auto">
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
