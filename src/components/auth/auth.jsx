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

function Auth() {
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const handleEmailPasswordAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error(
        `Error ${isSignUp ? "signing up" : "signing in"} with email/password`,
        error
      );
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
        <h1 className="flex justify-center text-4xl mb-4">
          {isSignUp ? "Sign Up" : "Log In"}
        </h1>
      );
  };

  return (
    <div className="h-screen flex items-center justify-center m-auto">
      <div className="p-32 flex-col justify-center items-center m-auto rounded-3xl bg-gray-700 text-white text-xl">
        {topLabel()}
        {user ? (
          <div>
            <p>Welcome, {user.email}!</p>
            <button
              onClick={handleSignOut}
              className="mt-2 px-4 py-2 bg-black rounded hover:bg-red-900"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <form onSubmit={handleEmailPasswordAuth} className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="mb-2 p-2 text-black m-2 flex rounded w-full"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="mb-2 p-2 text-black m-2 flex rounded w-full"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 ml-2 "
              >
                {isSignUp ? "Sign Up" : "Log In"}
              </button>
            </form>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="mb-2 text-sm underline flex hover:text-blue-300 justify-center mx-auto"
            >
              {isSignUp
                ? "Already have an account? Log In"
                : "Don't have an account? Sign Up"}
            </button>
            <button
              onClick={signInWithGoogle}
              className="p-4 bg-black rounded hover:bg-red-800 flex m-auto"
            >
              <FaGoogle />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Auth;
