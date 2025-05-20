import bankLogo from '../assets/bankLogo.svg'

const Navbar = () => {
  return (
    <nav className="bg-blue-300 fixed p-4 h-screen w-40 flex flex-col items-center">
      <img src={bankLogo}/>
      <h1 className="text-white">Bank</h1>
      
    </nav>
  );
};

export default Navbar;