import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PollProvider } from "./context/PollContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreatePoll from "./pages/CreatePoll";
import VotePage from "./pages/VotePage";
import ResultsDashboard from "./pages/ResultsDashboard";
import "./App.css";


export default function App() {
 return (
   <AuthProvider>
     <PollProvider>
       <Router>
         <div className="min-h-screen bg-gray-50">
           <Routes>
             {/* Public Routes */}
             <Route path="/" element={<LandingPage />} />
             <Route path="/login" element={<Login />} />
             <Route path="/register" element={<Register />} />
             <Route path="/vote/:pollId" element={<VotePage />} />
             <Route path="/results/:pollId" element={<ResultsDashboard />} />


             {/* Protected Routes */}
             <Route
               path="/dashboard"
               element={
                 <ProtectedRoute>
                   <Dashboard />
                 </ProtectedRoute>
               }
             />
             <Route
               path="/create"
               element={
                 <ProtectedRoute>
                   <CreatePoll />
                 </ProtectedRoute>
               }
             />
           </Routes>
         </div>
       </Router>{" "}
     </PollProvider>{" "}
   </AuthProvider>
 );
}
