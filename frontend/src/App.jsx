import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileSetup from "./pages/ProfileSetup";
import Interview from "./pages/Interview";
import Contest from "./pages/Contest";
import ContestResults from "./pages/ContestResults";
import AdminHub from "./pages/AdminHub";
import AdminProblems from "./pages/AdminProblems";
import AdminContests from "./pages/AdminContests";
import Contests from "./pages/Contests";
import Multiplayer from "./pages/Multiplayer";
import MultiplayerLobby from "./pages/MultiplayerLobby";
import BattleRoom from "./pages/BattleRoom";
import Problems from "./pages/Problems";
import ProblemSolver from "./pages/ProblemSolver";
import LandingPage from "./pages/LandingPage";
import InterviewPrep from "./pages/InterviewPrep";

import AnimatedBackground from "./components/AnimatedBackground";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <AnimatedBackground />

      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/setup"
            element={
              <ProtectedRoute requireAuth>
                <ProfileSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <Interview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview-prep"
            element={
              <ProtectedRoute>
                <InterviewPrep />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contest/:id"
            element={
              <ProtectedRoute>
                <Contest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contest-results/:id"
            element={
              <ProtectedRoute>
                <ContestResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminHub />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/problems"
            element={
              <ProtectedRoute>
                <AdminProblems />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/contests"
            element={
              <ProtectedRoute>
                <AdminContests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contests"
            element={
              <ProtectedRoute>
                <Contests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/problems"
            element={
              <ProtectedRoute>
                <Problems />
              </ProtectedRoute>
            }
          />
          <Route
            path="/problems/:id"
            element={
              <ProtectedRoute>
                <ProblemSolver />
              </ProtectedRoute>
            }
          />
          <Route
            path="/multiplayer"
            element={
              <ProtectedRoute>
                <MultiplayerLobby />
              </ProtectedRoute>
            }
          />
          <Route
            path="/multiplayer/create"
            element={
              <ProtectedRoute>
                <Multiplayer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/battle/:id"
            element={
              <ProtectedRoute>
                <BattleRoom />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
