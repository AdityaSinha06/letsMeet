import './App.css';
import Authentication from './pages/Authentication.jsx';
import Landing from './pages/Landing.jsx';
import { BrowserRouter , Routes , Route } from 'react-router-dom';
import VideoMeetComponent from './pages/VideoMeetComponent.jsx';
import HomeComponent from './pages/HomeComponent.jsx';
import History from "./pages/History.jsx";

function App() {  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing/>} />
        <Route path='/home' element={<HomeComponent />}></Route>
        <Route path='/auth' element={<Authentication />}></Route>
        <Route path='/getHistory' element={<History/>}></Route>
        <Route path='/:url' element={<VideoMeetComponent />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App