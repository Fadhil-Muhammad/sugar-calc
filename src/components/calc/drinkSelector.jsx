import { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../auth/firebase";

// eslint-disable-next-line react/prop-types
function DrinkSelector({ onSelect, temporaryDrinks = [], addTemporaryDrink }) {
  const [drinks, setDrinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingNewDrink, setIsAddingNewDrink] = useState(false);
  const [newDrinkName, setNewDrinkName] = useState("");
  const [newDrinkSugar, setNewDrinkSugar] = useState("");

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        setIsLoading(true);
        const drinksCollection = collection(db, "drinks");
        const drinksSnapshot = await getDocs(drinksCollection);
        const drinksList = drinksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDrinks(drinksList);
      } catch (err) {
        console.error("Error fetching drinks:", err);
        setError("Failed to load drinks. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrinks();
  }, []);

  const filteredDrinks = useMemo(() => {
    if (!searchTerm) return [];
    const allDrinks = [...drinks, ...temporaryDrinks];
    return allDrinks.filter((drink) =>
      drink.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, drinks, temporaryDrinks]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setIsAddingNewDrink(false);
  };

  const handleAddNewDrink = () => {
    if (newDrinkName.trim() === "" || newDrinkSugar.trim() === "") return;

    const newDrink = {
      id: `temp-${Date.now()}`,
      name: newDrinkName.trim(),
      sugar: parseFloat(newDrinkSugar),
      isTemporary: true,
    };

    addTemporaryDrink(newDrink);
    onSelect(newDrink);
    setSearchTerm("");
    setNewDrinkName("");
    setNewDrinkSugar("");
    setIsAddingNewDrink(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search drinks..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {searchTerm && (
        <div className="absolute w-full mt-2 max-h-60 overflow-y-auto bg-white border rounded-lg shadow-lg">
          {isLoading && <p className="p-2">Loading drinks...</p>}
          {error && <p className="p-2 text-red-500">{error}</p>}
          {!isLoading &&
            !error &&
            filteredDrinks.length === 0 &&
            !isAddingNewDrink && (
              <button
                onClick={() => setIsAddingNewDrink(true)}
                className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100"
              >
                Add &quot;{searchTerm}&quot; as a new drink
              </button>
            )}
          {isAddingNewDrink && (
            <div className="p-2">
              <input
                type="text"
                value={newDrinkName}
                onChange={(e) => setNewDrinkName(e.target.value)}
                placeholder="Enter new drink name"
                className="w-full px-2 py-1 border rounded mb-2"
              />
              <input
                type="number"
                value={newDrinkSugar}
                onChange={(e) => setNewDrinkSugar(e.target.value)}
                placeholder="Enter sugar content (g)"
                className="w-full px-2 py-1 border rounded mb-2"
              />
              <button
                onClick={handleAddNewDrink}
                className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Temporary Drink
              </button>
            </div>
          )}
          {filteredDrinks.map((drink) => (
            <button
              key={drink.id}
              onClick={() => {
                onSelect(drink);
                setSearchTerm("");
              }}
              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              {drink.name} - {drink.sugar}g sugar
              {drink.isTemporary && " (Temporary)"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DrinkSelector;
