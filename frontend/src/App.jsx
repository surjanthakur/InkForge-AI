import "./App.css";
import MainAppLayout from "./layouts/MainLayout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
  Homepage,
  Signup,
  Login,
  AboutUsPage,
  WritingPageEditor,
  PageNotFound,
  Dashboard,
  PostPageView,
} from "./pages/index";

function App() {
  return (
    <BrowserRouter>
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
      <Routes>
        <Route element={<MainAppLayout />}>
          <Route path="/" element={<Homepage />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/editor" element={<WritingPageEditor />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/:post_id/view" element={<PostPageView />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
