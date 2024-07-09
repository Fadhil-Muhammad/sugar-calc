import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth/authcontect";
import { setDoc, getDoc, doc } from "firebase/firestore";
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
  const [selectedDrinks, setSelectedDrinks] = useState(() => {
    const saved = localStorage.getItem(`selectedDrinks_${currentDate}`);
    return saved ? JSON.parse(saved) : [];
  });

  const DAILY_SUGAR_LIMIT = 50;

  useEffect(() => {
    if (user) {
      loadUserDrinks(user.uid);
    }
  }, [user, currentDate]);

  useEffect(() => {
    localStorage.setItem(
      `selectedDrinks_${currentDate}`,
      JSON.stringify(selectedDrinks)
    );
    if (user) {
      saveDailyData(selectedDrinks);
    }
  }, [selectedDrinks, user, currentDate]);

  const loadUserDrinks = async (userId) => {
    const userDayDocRef = doc(db, "userDailySugar", `${currentDate}_${userId}`);
    const userDayDoc = await getDoc(userDayDocRef);

    if (userDayDoc.exists()) {
      const data = userDayDoc.data();
      setSelectedDrinks(data.drinks || []);
    } else {
      setSelectedDrinks([]);
    }
  };

  const saveDailyData = async (drinks) => {
    if (user) {
      const totalSugar = drinks.reduce((sum, drink) => sum + drink.sugar, 0);
      const isSafe = totalSugar <= DAILY_SUGAR_LIMIT;

      try {
        await setDoc(doc(db, "userDailySugar", `${currentDate}_${user.uid}`), {
          userId: user.uid,
          date: currentDate,
          totalSugar: totalSugar,
          drinks: drinks,
          warning: isSafe,
        });
        console.log("Data saved successfully for date:", currentDate);
      } catch (error) {
        console.error("Error saving daily data to Firestore:", error);
      }
    }
  };

  const addDrink = (drink) => {
    setSelectedDrinks((prevDrinks) => [...prevDrinks, drink]);
  };

  const removeDrink = (index) => {
    setSelectedDrinks((prevDrinks) => prevDrinks.filter((_, i) => i !== index));
  };

  const totalSugar = selectedDrinks.reduce(
    (sum, drink) => sum + drink.sugar,
    0
  );
  const isSafe = totalSugar <= DAILY_SUGAR_LIMIT;

  return (
    <div className=" h-screen flex items-center justify-center m-auto">
      {NotUser()}
      <div className="flex flex-col items-center justify-center border border-gray-200 rounded p-6">
        <p>Current Date: {currentDate}</p>
        <DrinkSelector onSelect={addDrink} />
        <div>
          <h2>Today&#39;s Drinks:</h2>
          <ul>
            {selectedDrinks.map((drink, index) => (
              <li key={index}>
                {drink.name} - {drink.sugar}g sugar
                <div>
                  <button onClick={() => removeDrink(index)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p>Total Sugar: {totalSugar}g</p>
          <p>
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
