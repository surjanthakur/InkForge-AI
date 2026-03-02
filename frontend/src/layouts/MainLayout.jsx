import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "../components/index";
import { Toaster } from "react-hot-toast";
const MainAppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Global Toast Container */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
          },
        }}
      />
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

export default MainAppLayout;
