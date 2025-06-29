import { useLocation } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

const LandingLayout = ({ children }) => {
  const location = useLocation();

  const hideFooter = location.pathname === '/member/chatbot';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default LandingLayout;
