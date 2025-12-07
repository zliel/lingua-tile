import { lazy } from "react";
import { useRoutes } from "react-router-dom";
import Layout from "@/Components/Layout";
import ProtectedRoute from "@/Components/ProtectedRoute";

import Login from "./Login";
import Signup from "./Signup";
import { HomeRedirect } from "./HomeRedirect";

const Dashboard = lazy(() => import("./Dashboard"));
const LessonList = lazy(() => import("./LessonList"));
const Profile = lazy(() => import("./Profile"));
const UpdateProfile = lazy(() => import("./UpdateProfile"));
const FlashcardLesson = lazy(() => import("./FlashcardLesson"));
const GrammarLesson = lazy(() => import("./GrammarLesson"));
const PracticeLesson = lazy(() => import("./PracticeLesson"));
const Translate = lazy(() => import("./Translate"));
const About = lazy(() => import("./About"));
const AdminSectionTable = lazy(() => import("./AdminSectionTable"));
const AdminUserTable = lazy(() => import("./AdminUserTable"));
const AdminLessonTable = lazy(() => import("./AdminLessonTable"));
const AdminCardTable = lazy(() => import("./AdminCardTable"));

export const AppRoutes = () => {
  return useRoutes([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <HomeRedirect /> },
        { path: "/home", element: <HomeRedirect /> },
        { path: "/about", element: <About /> },
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "/lessons",
          element: <LessonList />,
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "/update-profile",
          element: (
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "/flashcards/:lessonId",
          element: <FlashcardLesson />,
        },
        {
          path: "/practice/:lessonId",
          element: <PracticeLesson />,
        },
        {
          path: "/grammar/:lessonId",
          element: <GrammarLesson />,
        },
        {
          path: "/translate",
          element: <Translate />,
        },
        {
          path: "/admin-users",
          element: (
            <ProtectedRoute isAdminPage={true}>
              <AdminUserTable />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin-cards",
          element: (
            <ProtectedRoute isAdminPage={true}>
              <AdminCardTable />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin-lessons",
          element: (
            <ProtectedRoute isAdminPage={true}>
              <AdminLessonTable />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin-sections",
          element: (
            <ProtectedRoute isAdminPage={true}>
              <AdminSectionTable />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      element: <Layout />,
      children: [
        { path: "/login", element: <Login /> },
        { path: "/signup", element: <Signup /> },
      ],
    },
  ]);
};
