import Logo from '../assets/imgs/logo.svg?react';
import { Link } from 'react-router-dom';

export default function Navbar({isLogin}) {
  return (
    <div className='border-b border-gray-200'>
      <div className="mx-auto w-[1400px] flex justify-between py-6 items-center">
        <div>
          <Link to="/"><Logo /></Link>
        </div>
        {isLogin 
        ?
        <Link to="/mypage">
          <div className='flex items-center h-[42px]'>
            <div className="w-8 h-8 bg-no-repeat bg-contain bg-[url('./assets/imgs/default.png')] rounded-full mr-3"></div>
            닉네임 님
          </div>
        </Link>
        :<div>
          <button className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100'>로그인/회원가입</button>
        </div>
        }
      </div>
    </div>
  )
}