import React from 'react';
import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import FileUpload from './components/FileUpload';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Custom_Algorithm from './pages/Custom_Algorithm';
import YOLO2 from './pages/YOLOv8_2';
import YOLO3 from './pages/YOLOv8_3';
import Navbar from './components/Navbar';
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

const App: React.FC = () => {
  return(
    <Router>
      <Navbar/>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path="/custom" element={<Custom_Algorithm />}/>
          <Route path="/yolo2" element={<YOLO2/>}/>
          <Route path="/yolo3" element={<YOLO3/>}/>
        </Routes>
    </Router>
  );
}

export default App;
