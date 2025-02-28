import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import authService from "./appwrite/auth";
import { login } from "./store/authSlice";
import {Header,Footer} from './Components/index.js'
// import { Outlet } from "react-router";
function App() {
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((data) => {
        if (data) {
          dispatch(login({ data }));
        } else {
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return loading ? 
  <div className="text-xl text-blue-800">
    <h1>Loading</h1>
  </div> 
  : 
  <div className="min-h-screen  flex flex-wrap content-between bg-gray-600">
    <div className="w-full block">
        <Header/>
        <div>
          {/* <Outlet/> */}
        </div>
        <Footer />
    </div>
  </div>;
}

export default App;
