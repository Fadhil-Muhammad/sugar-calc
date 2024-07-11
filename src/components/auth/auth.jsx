import { useState, useContext } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { AuthContext } from "./authcontect";
import { auth } from "./firebase";
import { FaGoogle } from "react-icons/fa";
import { getFirestore, setDoc, doc } from "firebase/firestore";

function Auth() {
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const [error, setError] = useState("");

  const db = getFirestore();

  const handleEmailPasswordAuth = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await setDoc(doc(db, "users", userCredential.user.uid), {
          gender: gender,
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error(
        `Error ${isSignUp ? "signing up" : "signing in"} with email/password`,
        error
      );

      switch (error.code) {
        case "auth/weak-password":
          setError("Password should be at least 6 characters long.");
          break;
        case "auth/email-already-in-use":
          setError("This email is already in use.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          setError("Invalid email or password.");
          break;
        default:
          setError("An error occurred. Please try again.");
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("selectedDrinks_")) {
        localStorage.removeItem(key);
      }
    });
  };

  const topLabel = () => {
    if (!user)
      return (
        <h1 className="flex justify-center text-4xl mt-9">
          {isSignUp ? "Sign Up" : "Log In"}
        </h1>
      );
  };

  const GenderSugar = () => {
    const getMaxSugarDaily = () => {
      if (user.gender === "female") return 25;
      if (user.gender === "male") return 36;
      return "Not set";
    };

    return <p>Max daily sugar intake: {getMaxSugarDaily()} grams</p>;
  };

  return (
    <div className="min-h-[95.6vh] bg-gradient-to-br from-gray-100 to-green-100 flex items-center justify-center px-4 w-screen">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden transform transition duration-500 hover:shadow-2xl">
        {topLabel()}
        <div className="p-8">
          {user ? (
            <div className="text-center animate-fade-in">
              <div className="text-2xl font-semibold text-gray-800 mb-4">
                <span>Welcome, {user.email}!</span>
                <span className="block mt-2">
                  <span className="text-emerald-600 font-bold">
                    <GenderSugar />
                  </span>
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <form
                onSubmit={handleEmailPasswordAuth}
                className="space-y-4 mb-6"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                  required
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                  required
                />
                {isSignUp && (
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                )}
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  {isSignUp ? "Sign Up" : "Log In"}
                </button>
              </form>

              {error && (
                <p className="text-red-500 text-sm mt-2 animate-fade-in">
                  {error}
                </p>
              )}

              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full text-sm text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out mb-6"
              >
                {isSignUp
                  ? "Already have an account? Log In"
                  : "Don't have an account? Sign Up"}
              </button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
              <button
                onClick={signInWithGoogle}
                className="mt-6 w-full px-4 py-2 border flex justify-center items-center bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
              >
                <FaGoogle className="mr-2" />
                Sign in with Google
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
