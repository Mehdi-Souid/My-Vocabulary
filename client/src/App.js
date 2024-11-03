import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Vocabulary from './pages/Vocabulary';
import EditProfile from './pages/EditProfile';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3001'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} /> 
        <Route path="/vocabulary" element={<Vocabulary />} /> 
        <Route path="/edit-profile/" element={<EditProfile />} /> 
      </Routes>
    </Router>
  );
}

export default App;
