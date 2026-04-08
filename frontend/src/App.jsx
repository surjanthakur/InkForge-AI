import MainAppLayout from "./layouts/MainLayout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import React, { Suspense } from "react";
import { Loader } from "./components/index";

import {
  Signup,
  Login,
  AboutUsPage,
  WritingPageEditor,
  PageNotFound,
} from "./pages/index";

const Homepage = React.lazy(() => import("./pages/HomePage"));
const DashboardPage = React.lazy(() => import("./pages/dashboard/Dashboard"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: "#111",
              color: "#fff",
              border: "1px solid #333",
            },
            success: {
              duration: 1000,
            },
            error: {
              duration: 1000,
            },
          }}
        />
        <Routes>
          <Route element={<MainAppLayout />}>
            <Route path="/" element={<Homepage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/editor" element={<WritingPageEditor />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
