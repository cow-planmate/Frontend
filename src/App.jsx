import React from 'react';
import Router from "./shared/Router.jsx";
import "tailwindcss/tailwind.css";
import './App.css'
import ServerDownPage from "./pages/ServerDownPage";
import useServerStatusStore from "./store/ServerStatus";

function App() {
  const { isServerDown } = useServerStatusStore();

  return (
    <>
      <Router />
      {isServerDown && <ServerDownPage />}
    </>
  )
}

export default App;