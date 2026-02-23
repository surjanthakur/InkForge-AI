import './App.css';
import MainAppLayout from './layouts/MainLayout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  Homepage,
  Signup,
  Login,
  AboutUsPage,
  WritingPageEditor,
} from './pages/index';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainAppLayout />}>
            <Route path="/" element={<Homepage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/editor" element={<WritingPageEditor />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
