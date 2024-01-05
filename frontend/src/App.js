import './App.css';
import Navbar from './component/Navbar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from './component/SignUp';
import SignIn from './component/SignIn';
import Home from './screens/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Createpost from './screens/Createpost';
import React, { useState } from 'react';
import { LoginContext } from './context/LoginContext';
import Modal from './component/Modal';
import Profile from './screens/Profile';
import MyFollowingPost from './screens/myFollowingPost';
import { GoogleOAuthProvider } from '@react-oauth/google';
import UserProfile from './component/UserProfile';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [userLogin, setUserLogin] = useState(false);

  return (
    <BrowserRouter>
      <div className="App">
        <GoogleOAuthProvider clientId="713052737178-r2dinoavd3rkfk80fdm5kbn4o55b4tor.apps.googleusercontent.com">
          <LoginContext.Provider value={{ setUserLogin, setModalOpen }}>
            <Navbar login={userLogin} />
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/signup" element={<SignUp />}></Route>
              <Route path="/signin" element={<SignIn />} ></Route>
              <Route exact path="/profile" element={<Profile />}></Route>
              <Route path="/createPost" element={<Createpost />}></Route>
              <Route path='/profile/:userid' element={<UserProfile />}></Route>
              <Route path='/followingpost' element={<MyFollowingPost />}></Route>
            </Routes>
            <ToastContainer theme='dark' />
            {modalOpen && <Modal setModalOpen={setModalOpen}></Modal>}
          </LoginContext.Provider>
        </GoogleOAuthProvider>
      </div>
    </BrowserRouter>
  );
}
export default App;

