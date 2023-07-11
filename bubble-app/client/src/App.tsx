import React from 'react';
import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import FileUpload from './components/FileUpload';
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
    <div className="container" style={{width:"1500px"}}>
      <div className="my-3">
        <h3>Bubble File Upload</h3>
      </div>
      <FileUpload />
    </div>
  );
}

export default App;
