import { useState } from 'react';
import Navbar from '../components/navbar.jsx';

function App() {
  return (
    <div>
      <Navbar 
        isLogin = {false}
      />
      <div className='mx-auto w-[1400px] pt-8'>
        안녕하세요
      </div>
    </div>
  )
}

export default App;