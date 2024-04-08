import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupScreen from "./screen/SignupScreen.js";
import SignInScreen from "./screen/SignInScreen.js";
import HomeScreen from "./screen/HomeScreen.js"
import MessageScreen  from "./screen/MessageScreen.js";
import ContactScreen from "./screen/ContactScreen.js";
import SettingScreen from "./screen/SettingScreen.js";
import ForgotPasswordForm from "./screen/ForgotPasswordForm.js";
import ModalAccountInfor from "./screen/ModalAccountInfor.js";
import ListFriend from "./component/listFriend.js";
function App() {
  return (

      <Router>
        <Routes>
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/" element={<SignInScreen />} />
          <Route path="/message" element={<MessageScreen />} />
          <Route path="/contact" element={<ContactScreen />} />
          <Route path="/setting" element={<SettingScreen />} />
          <Route                 element={<ModalAccountInfor />} />
          <Route element={<ListFriend />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        </Routes>
      </Router>

  );
}

export default App;