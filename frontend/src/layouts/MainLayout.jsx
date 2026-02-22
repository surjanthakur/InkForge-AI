import { Outlet } from 'react-router-dom';
import { Navbar, Footer } from '../components/index';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* header */}
      <Navbar />
      {/* main content */}
      <main className="grow">
        <Outlet />
      </main>
      {/* footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
