import logo from '../assets/logo.svg';

export default function Navbar({isLogin}) {
  return (
    <div className='border-b border-gray-200'>
      <div className="mx-auto w-[1400px] flex justify-between py-6 items-center">
        <div>
          <img src={logo} />
        </div>
        {isLogin 
        ?<div>
          ㅇㅇ님
        </div>
        :<div>
          <button className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100'>로그인/회원가입</button>
        </div>
        }
      </div>
    </div>
  )
}