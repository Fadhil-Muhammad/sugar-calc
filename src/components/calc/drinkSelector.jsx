import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../auth/firebase";

// eslint-disable-next-line react/prop-types
function DrinkSelector({ onSelect }) {
  const [drinks, setDrinks] = useState([]);
  const [filteredDrinks, setFilteredDrinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (searchTerm) {
      const results = drinks.filter((drink) =>
        drink.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDrinks(results);
    } else {
      setFilteredDrinks([]);
    }
  }, [searchTerm, drinks]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
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
          {!isLoading && !error && filteredDrinks.length === 0 && (
            <p className="p-2">No drinks found</p>
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
              {drink.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DrinkSelector;
