import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Sidebar from './components/common/Sidebar'

function App() {


  return (
    <BrowserRouter>
    <Sidebar role={"agent"}></Sidebar>
    </BrowserRouter>
  )
}

export default App
