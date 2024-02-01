import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInScreen from "./screen/SignInScreen.js";
import HomeScreen from "./screen/HomeScreen.js"
import MessageScreen  from "./screen/MessageScreen.js";
import ContactScreen from "./screen/ContactScreen.js";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<SignInScreen />} />
          <Route path="/message" element={<MessageScreen />} />
          <Route path="/contact" element={<ContactScreen />} />
          <Route path="/home" element={<HomeScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


