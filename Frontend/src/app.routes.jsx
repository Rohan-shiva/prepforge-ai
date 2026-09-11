import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import Login from "./features/auth/pages/Login.jsx";
import Register from "./features/auth/pages/Register.jsx";
import Protected from "./features/auth/components/Protected.jsx";
import Home from "./features/interview/pages/Home.jsx";
import Interview from "./features/interview/pages/Interview.jsx";
import InterviewVoice from "./features/interview/pages/InterviewVoice.jsx";
import History from "./features/interview/pages/History.jsx";
import Progress from "./features/interview/pages/Progress.jsx";
import LandingPage from "./features/interview/pages/LandingPage.jsx";
import Navbar from "./features/interview/components/Navbar.jsx";
import { useAuth } from "./features/auth/hooks/useAuth.js";

const AppLayout = () => {
  return (
    <div className="app-main-layout">
      <Navbar />
      <Outlet />
    </div>
  );
};

const RootRouteHandler = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#0d0f14",
          color: "#e8e8ed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <h2>Checking authentication...</h2>
      </main>
    );
  }

  if (user) {
    return <Home />;
  }

  return <LandingPage />;
};

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <RootRouteHandler />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    element: (
      <Protected>
        <AppLayout />
      </Protected>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Home />
      },
      {
        path: "/interview/:interviewId",
        element: <Interview />
      },
      {
        path: "/interview-voice",
        element: <InterviewVoice />
      },
      {
        path: "/interview-voice/:sessionId",
        element: <InterviewVoice />
      },
      {
        path: "/history",
        element: <History />
      },
      {
        path: "/progress",
        element: <Progress />
      }
    ]
  }
]);