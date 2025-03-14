
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Index from '@/pages/Index';
import Roasters from '@/pages/Roasters';
import RoasterDetails from '@/pages/RoasterDetails';
import Cafes from '@/pages/Cafes';
import Recipes from '@/pages/Recipes';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import ComingSoon from '@/pages/ComingSoon';
import Profile from '@/pages/Profile';
import { AuthProvider } from '@/context/auth';
import { Toaster } from '@/components/ui/toaster';
import CoffeeDetails from './pages/CoffeeDetails';
import RoasterPopulator from './pages/RoasterPopulator';
import ProtectedRoute from './components/ProtectedRoute';
import { initializeRoasterDatabase } from './utils/roasterInitializer';

function App() {
  useEffect(() => {
    // Initialize the roaster database with international roasters when the app starts
    initializeRoasterDatabase()
      .then(() => console.log("Roaster database initialization complete"))
      .catch(err => console.error("Error initializing roaster database:", err));
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/roasters" element={<Roasters />} />
            <Route path="/roasters/:id" element={<RoasterDetails />} />
            <Route path="/coffee/:id" element={<CoffeeDetails />} />
            <Route path="/cafes" element={<ComingSoon title="Cafes" />} />
            <Route path="/recipes" element={<ComingSoon title="Recipes" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route path="/admin/populate-roasters" element={<RoasterPopulator />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
