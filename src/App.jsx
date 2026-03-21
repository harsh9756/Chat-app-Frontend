import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Loader from './components/Loader';
import Profile from './components/UI/Profile';
import ProtectedRoute from './components/ProtectedRoutes';
import useSocket from './Utils/socket';

const Login = lazy(() => import('./components/Login'));
const Signup = lazy(() => import('./components/Signup'));
const Welcome = lazy(() => import('./components/UI/Welcome'));
const ChatArea = lazy(() => import('./components/UI/ChatArea'));
const MainContainer = lazy(() => import('./components/UI/MainContainer'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Suspense fallback={<Loader />}><Login /></Suspense>,
  },
  {
    path: "/signup",
    element: <Suspense fallback={<Loader />}><Signup /></Suspense>,
  },
  {
    path: "/app",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <Suspense fallback={<Loader />}><MainContainer /></Suspense>,
        children: [
          { path: "", element: <Suspense fallback={<Loader />}><Welcome /></Suspense> },
          { path: "user/profile", element: <Suspense fallback={<Loader />}><Profile /></Suspense> },
          { path: "chat/:name/:id/:Rid", element: <Suspense fallback={<Loader />}><ChatArea /></Suspense> }
        ]
      }
    ]
  }
]);

export default function App() {
  useSocket();
  return <RouterProvider router={router} />;
}