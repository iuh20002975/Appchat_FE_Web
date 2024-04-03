import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupScreen from "./screen/SignupScreen.js";
import SignInScreen from "./screen/SignInScreen.js";
import HomeScreen from "./screen/HomeScreen.js"
import MessageScreen  from "./screen/MessageScreen.js";
import ContactScreen from "./screen/ContactScreen.js";
import SettingScreen from "./screen/SettingScreen.js";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<SignupScreen />} />  
          <Route path="/signin" element={<SignInScreen />} />
          <Route path="/message" element={<MessageScreen />} />
          <Route path="/contact" element={<ContactScreen />} />
          <Route path="/setting" element={<SettingScreen />} />
          <Route path="/home" element={< HomeScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;