import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth/authcontect";
import { setDoc, getDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../auth/firebase";
import DrinkSelector from "./drinkSelector";
import NotUser from "../overlay/notuser";

function useCurrentDate() {
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const updateDate = () => {
      const newDate = new Date().toISOString().split("T")[0];
      if (newDate !== currentDate) {
        setCurrentDate(newDate);
      }
    };

    const timer = setInterval(updateDate, 1000);
    return () => clearInterval(timer);
  }, [currentDate]);

  return currentDate;
}

function SugarCalculator() {
  const { user } = useContext(AuthContext);
  const currentDate = useCurrentDate();
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [DAILY_SUGAR_LIMIT, setDAILY_SUGAR_LIMIT] = useState(36);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const localData = localStorage.getItem(
      `${currentDate}_${user?.uid}_drinks`
    );
    if (localData) {
      setSelectedDrinks(JSON.parse(localData));
      setIsLoaded(true);
      setIsLoading(false);
    } else {
      const fetchUserDataAndDrinks = async () => {
        console.log("Fetching data. User:", user?.uid, "Date:", currentDate);
        setIsLoading(true);
        if (user) {
          try {
            // Fetch user gender and set sugar limit
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (
              userDocSnap.exists() &&
              userDocSnap.data().gender === "female"
            ) {
              setDAILY_SUGAR_LIMIT(25);
            }

            // Fetch drinks from Firestore
            const userDayDocRef = doc(
              db,
              "userDailySugar",
              `${currentDate}_${user.uid}`
            );
            const userDayDoc = await getDoc(userDayDocRef);
            console.log("User day document exists:", userDayDoc.exists());

            if (userDayDoc.exists()) {
              const data = userDayDoc.data();
              console.log("Fetched drinks from Firestore:", data.drinks);
              setSelectedDrinks(data.drinks || []);
              localStorage.setItem(
                `${currentDate}_${user.uid}_drinks`,
                JSON.stringify(data.drinks || [])
              );
            } else {
              console.log(
                "No data in Firestore for this date, setting empty array"
              );
              setSelectedDrinks([]);
              localStorage.setItem(
                `${currentDate}_${user.uid}_drinks`,
                JSON.stringify([])
              );
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        } else {
          console.log("User not logged in, setting empty array");
          setSelectedDrinks([]);
        }
        setIsLoaded(true);
        setIsLoading(false);
      };

      fetchUserDataAndDrinks();
    }
  }, [user, currentDate]);

  useEffect(() => {
    const saveDailyData = async () => {
      if (user) {
        console.log("Saving data to Firestore:", selectedDrinks);
        try {
          const userDayDocRef = doc(
            db,
            "userDailySugar",
            `${currentDate}_${user.uid}`
          );

          if (selectedDrinks.length > 0) {
            const totalSugar = selectedDrinks.reduce(
              (sum, drink) => sum + drink.sugar,
              0
            );
            const isSafe = totalSugar <= DAILY_SUGAR_LIMIT;

            await setDoc(userDayDocRef, {
              userId: user.uid,
              date: currentDate,
              totalSugar: totalSugar,
              drinks: selectedDrinks,
              warning: isSafe,
            });
            console.log("Data saved successfully for date:", currentDate);
          } else {
            await deleteDoc(userDayDocRef);
            console.log("Empty data, document deleted for date:", currentDate);
          }

          localStorage.setItem(
            `${currentDate}_${user.uid}_drinks`,
            JSON.stringify(selectedDrinks)
          );
        } catch (error) {
          console.error(
            "Error saving/deleting daily data in Firestore:",
            error
          );
        }
      }
    };

    saveDailyData();
  }, [selectedDrinks, user, currentDate, DAILY_SUGAR_LIMIT]);

  const removeDrink = (index) => {
    console.log("Removing drink at index:", index);
    setSelectedDrinks((prevDrinks) => {
      const newDrinks = prevDrinks.filter((_, i) => i !== index);
      console.log("New drinks array after removal:", newDrinks);
      return newDrinks;
    });
  };

  const addDrink = (drink) => {
    console.log("Adding drink:", drink);
    setSelectedDrinks((prevDrinks) => [...prevDrinks, drink]);
  };

  const totalSugar = selectedDrinks.reduce(
    (sum, drink) => sum + drink.sugar,
    0
  );
  const isSafe = totalSugar <= DAILY_SUGAR_LIMIT;

  console.log(
    "Rendering. Selected drinks:",
    selectedDrinks,
    "Total sugar:",
    totalSugar
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-[95.6vh] bg-gradient-to-br from-gray-100 to-green-100 flex items-center justify-center px-4 w-full">
      {!user && <NotUser />}
      <div
        className={`bg-white rounded-xl shadow-2xl p-8 max-w-xl w-full m-6 transition-all duration-500 ease-out ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <p
          className={`text-gray-600 mb-6 text-center transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          Current Date: <span className="font-semibold">{currentDate}</span>
        </p>

        <div
          className={`transition-opacity duration-500 delay-100 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <DrinkSelector onSelect={addDrink} />
        </div>

        <div
          className={`mt-8 transition-opacity duration-500 delay-200 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Today&apos;s Drinks
          </h2>
          <ul className="space-y-3">
            {selectedDrinks.map((drink, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg transition-all duration-200 hover:bg-gray-100"
              >
                <span className="text-gray-700">
                  {drink.name} -{" "}
                  <span className="font-medium text-blue-600">
                    {drink.sugar}g
                  </span>{" "}
                  sugar
                </span>
                <button
                  onClick={() => removeDrink(index)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200 p-2 rounded-full hover:bg-red-100"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`mt-8 pt-6 border-t border-gray-200 transition-opacity duration-500 delay-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-lg font-semibold text-gray-800 flex justify-between items-center">
            Total Sugar:
            <span className="text-3xl text-blue-600 font-bold">
              {totalSugar}g
            </span>
          </p>
          <p
            className={`mt-4 text-center py-3 px-4 rounded-lg font-medium ${
              isSafe
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {isSafe
              ? "You're within the safe limit!"
              : "Warning: You've exceeded the recommended daily sugar intake."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SugarCalculator;
