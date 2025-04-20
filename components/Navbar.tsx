import Login from '../components/home/Login';

export default function Navbar() {
  return (
    <>
      <nav className='flex items-center justify-between p-4'>
        <h1 className='text-2xl lg:text-5xl'>PhotoAI</h1>

        <div>
          <ul className='flex space-x-4'>
            <li>
              <a href='/'>Home</a>
            </li>
            <li>
              <a href='/create'>Create</a>
            </li>
            <li>
              <a href='/gallery'>Gallery</a>
            </li>
          </ul>
        </div>

        <div>
          <Login />
        </div>
      </nav>
    </>
  );
}
