// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideBar from "./components/home/sidebar";
import Home from "./components/home/Home";
import Calc from "./components/calc/calc";
import Auth from "./components/auth/auth";
import UserList from "./components/user/userList";
import { AuthProvider } from "./components/auth/authcontect";

function App() {
  return (
    <AuthProvider>
      <h1 className="text-center bg-gray-600 text-white font-bold h-10 flex justify-center p-2 text-3xl items-center">
        Sugarculate
      </h1>
      <Router>
        <div className="flex">
          <SideBar />
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Home />} />
            <Route path="/calc" element={<Calc />} />
            <Route path="/user" element={<UserList />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
