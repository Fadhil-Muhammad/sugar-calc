import { Link } from "react-router-dom";
import { MdCalculate } from "react-icons/md";
import { useState, useEffect } from "react";
import { TbHandClick } from "react-icons/tb";
import SugarEmote from "../user/sugarEmote";

const Reason = () => {
  return (
    <div>
      <p className="mt-4 text-gray-700 justify-normal">
        We calculate your sugar intake based on the guidelines from the American
        Heart Association. Men should consume no more than 9 teaspoons (36 grams
        or 150 calories) of added sugar per day, while women should consume no
        more than 6 teaspoons (25 grams or 100 calories) per day.
      </p>
      <p className="text-sm text-gray-600 bg-gray-200 p-4 rounded-xl mt-2 flex align-middle">
        This website only calculates your sugar intake based on what you drink.
        You can still consume sugar from other sources, but we won&apos;t
        calculate those. So, consume anything else wisely.
      </p>
    </div>
  );
};

function Home() {
  const [showReason, setShowReason] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const fadeInClass = "transition-all duration-700 ease-out";
  const loadedClass = isLoaded
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-4";

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[95.6vh] bg-gradient-to-br from-gray-100 to-green-100 w-screen ${fadeInClass} ${loadedClass}`}
    >
      <div className="grid gap-8 mx-4 md:grid-cols-12 max-w-6xl w-full">
        <div
          className={`md:col-span-12 bg-indigo-500 rounded-xl shadow-md m-auto p-8 transition-all duration-300 hover:scale-105 ${fadeInClass} ${loadedClass}`}
        >
          <h1 className="text-7xl md:text-7xl font-bold mb-6 text-center text-white">
            Calculate your sugar for a better future!
          </h1>
        </div>
        <div
          className={`md:col-span-4 bg-white rounded-xl shadow-md p-8 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 ${fadeInClass} ${loadedClass}`}
        >
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Click here to start the calculation
          </h2>
          <Link
            to="/calc"
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 flex items-center animate-pulse"
          >
            <MdCalculate size={24} className="mr-2" />
            <span>Start Now</span>
          </Link>
        </div>
        <div
          className={`md:col-span-8 bg-white rounded-xl shadow-md p-8 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 ${fadeInClass} ${loadedClass}`}
        >
          <SugarEmote />
        </div>
      </div>
      <div className="grid mx-4 md:grid-cols-12 max-w-6xl w-full mt-8">
        <div
          className={`md:col-span-10 bg-white rounded-xl shadow-md m-auto p-8 transition-all duration-300 hover:scale-105 flex-col ${fadeInClass} ${loadedClass}`}
        >
          <p className="text-xl flex justify-center items-center">
            How do we calculate your sugar?
          </p>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              showReason ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <Reason />
          </div>
        </div>
        <div
          className={`md:col-span-2 rounded-xl m-auto transition-all duration-300 hover:scale-110 ${fadeInClass} ${loadedClass}`}
        >
          <button
            onClick={() => setShowReason(!showReason)}
            className="bg-indigo-500 hover:bg-indigo-600 shadow-md text-white font-bold py-3 px-6 rounded-full transition-all duration-300 flex items-center"
          >
            <TbHandClick
              size={50}
              className={`transition-transform duration-300 ${
                showReason ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
