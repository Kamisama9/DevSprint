import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/User/Login";
import Home from "./Pages/Home"
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};
export default App;
