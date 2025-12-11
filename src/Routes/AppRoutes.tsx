import { lazy, Suspense } from "react";
import { useRoutes } from "react-router-dom";
import Layout from "@/Components/Layout";
import ProtectedRoute from "@/Components/ProtectedRoute";

import Login from "./Login";
import Signup from "./Signup";
import { HomeRedirect } from "./HomeRedirect";
import PageSkeleton from "@/Components/skeletons/PageSkeleton";

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
        {
          path: "/about", element: (
            <Suspense fallback={<PageSkeleton />}>
              <About />
            </Suspense>
          ),
        },
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute>
              <Suspense>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "/lessons",
          element: (
            <Suspense>
              <LessonList />
            </Suspense>
          ),
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <Suspense>
                <Profile />
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "/update-profile",
          element: (
            <ProtectedRoute>
              <Suspense>
                <UpdateProfile />
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "/flashcards/:lessonId",
          element: (
            <Suspense>
              <FlashcardLesson />
            </Suspense>
          ),
        },
        {
          path: "/practice/:lessonId",
          element: (
            <Suspense>
              <PracticeLesson />
            </Suspense>
          ),
        },
        {
          path: "/grammar/:lessonId",
          element: (
            <Suspense>
              <GrammarLesson />
            </Suspense>
          ),
        },
        {
          path: "/translate",
          element: (
            <Suspense fallback={<PageSkeleton />}>
              <Translate />
            </Suspense>
          ),
        },
        {
          path: "/admin-users",
          element: (
            <ProtectedRoute isAdminPage={true}>
              <Suspense>
                <AdminUserTable />
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin-cards",
          element: (
            <ProtectedRoute isAdminPage={true}>
              <Suspense>
                <AdminCardTable />
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin-lessons",
          element: (
            <ProtectedRoute isAdminPage={true}>
              <Suspense>
                <AdminLessonTable />
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin-sections",
          element: (
            <ProtectedRoute isAdminPage={true}>
              <Suspense>
                <AdminSectionTable />
              </Suspense>
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
