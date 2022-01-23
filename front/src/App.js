import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from './pages/Login';
import Main from './pages/Main';
import Detail from './pages/Detail';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/Main" element={<Main />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/Detail" element={<Detail />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
