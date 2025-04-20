import Link from 'next/link';
import Login from '../components/home/Login';

export default function Navbar() {
  const navbar = [
    {
      name: 'Home',
      href: '/',
    },
    {
      name: 'Gallery',
      href: '#',
    },
    {
      name: 'About',
      href: '#',
    },
    {
      name: 'Contact',
      href: '#',
    },
  ];
  return (
    <>
      <nav className='flex items-center justify-between border-b-2 border-gray-300 p-3 px-20'>
        <h1 className='text-2xl lg:text-5xl'>PhotoAI</h1>

        <div>
          <ul className='flex space-x-4'>
            {navbar.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className='text-lg hover:text-blue-500 lg:text-xl'
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Login />
        </div>
      </nav>
    </>
  );
}
