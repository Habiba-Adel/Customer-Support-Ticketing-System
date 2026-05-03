import './App.css'
import Sidebar from './components/common/Sidebar'
import { Routes, Route } from 'react-router-dom';

function App() {
    

     const userRole = "customer";

  return (
    <div className="d-flex">
      <Sidebar role={userRole} />

      <main className="flex-grow-1 p-4 bg-white">
        <Routes>
          <Route path="/customer/tickets" element={<div>My Tickets Page</div>} />
          <Route path="/customer/notifications" element={<div>Notifications Page</div>} />
        </Routes>
      </main>
    </div>
      
  );
}

export default App;
