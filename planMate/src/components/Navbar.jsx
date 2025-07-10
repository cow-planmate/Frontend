import logo from '../assets/logo.svg';

export default function Navbar({isLogin}) {
  return (
    <div className='border-b border-gray-200'>
      <div className="mx-auto w-[1400px] flex justify-between py-8">
        <div>
          <img src={logo} />
        </div>
        {isLogin 
        ?<div>
          안녕하세용~^^
        </div>
        :<div>
          ㅇㅇ님
        </div>
        }
      </div>
    </div>
  )
}