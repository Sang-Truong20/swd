import ChatWidget from '../ChatWidget';
import Footer from './Footer';
import Navbar from './Navbar';

const LandingLayout = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      {isAuthenticated && <ChatWidget />}
    </div>
  );
};

export default LandingLayout;
