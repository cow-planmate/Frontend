import React from 'react';
import Router from "./shared/Router.jsx";
import "tailwindcss/tailwind.css";
import './App.css'
import ServerDownPage from "./pages/ServerDownPage";
import useServerStatusStore from "./store/ServerStatus";
import Maintenance from "./pages/Maintenance";
import ConfirmModal from "./components/common/ConfirmModal";

function App() {
  const { isServerDown } = useServerStatusStore();
  const isMaintenance = import.meta.env.VITE_MAINTENANCE === "true";

  if (isMaintenance) {
    return <Maintenance />;
  }

  return (
    <>
      <Router />
      <ConfirmModal />
      {isServerDown && <ServerDownPage />}
    </>
  )
}

export default App;