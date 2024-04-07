import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupScreen from "./screen/SignupScreen.js";
import SignInScreen from "./screen/SignInScreen.js";
import HomeScreen from "./screen/HomeScreen.js"
import MessageScreen  from "./screen/MessageScreen.js";
import ContactScreen from "./screen/ContactScreen.js";
import SettingScreen from "./screen/SettingScreen.js";
import ForgotPasswordForm from "./screen/ForgotPasswordForm.js";
import { Provider } from "react-redux";
import store from "./redux/store.js";
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/" element={<SignInScreen />} />
          <Route path="/message" element={<MessageScreen />} />
          <Route path="/contact" element={<ContactScreen />} />
          <Route path="/setting" element={<SettingScreen />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;