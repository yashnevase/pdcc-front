import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from '../components/layout/Layout';
import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Lazy load pages
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const UserList = React.lazy(() => import('../pages/users/UserList'));
const UserAdd = React.lazy(() => import('../pages/users/UserAdd'));
const UserEdit = React.lazy(() => import('../pages/users/UserEdit'));
const UserView = React.lazy(() => import('../pages/users/UserView'));
const RoleList = React.lazy(() => import('../pages/roles/RoleList'));
const RoleAdd = React.lazy(() => import('../pages/roles/RoleAdd'));
const RoleEdit = React.lazy(() => import('../pages/roles/RoleEdit'));
const ChangePassword = React.lazy(() => import('../pages/auth/ChangePassword'));
const DistrictList = React.lazy(() => import('../pages/masters/districts/DistrictList'));
const DistrictAdd = React.lazy(() => import('../pages/masters/districts/DistrictAdd'));
const DistrictEdit = React.lazy(() => import('../pages/masters/districts/DistrictEdit'));
const DistrictView = React.lazy(() => import('../pages/masters/districts/DistrictView'));
const DepartmentList = React.lazy(() => import('../pages/masters/departments/DepartmentList'));
const DepartmentAdd = React.lazy(() => import('../pages/masters/departments/DepartmentAdd'));
const DepartmentEdit = React.lazy(() => import('../pages/masters/departments/DepartmentEdit'));
const DepartmentView = React.lazy(() => import('../pages/masters/departments/DepartmentView'));
const WorkList = React.lazy(() => import('../pages/work/WorkList'));
const WorkAdd = React.lazy(() => import('../pages/work/WorkAdd'));
const WorkEdit = React.lazy(() => import('../pages/work/WorkEdit'));
const WorkView = React.lazy(() => import('../pages/work/WorkView'));
const ContractorList = React.lazy(() => import('../pages/contractor/ContractorList'));
const ContractorAdd = React.lazy(() => import('../pages/contractor/ContractorAdd'));
const ContractorEdit = React.lazy(() => import('../pages/contractor/ContractorEdit'));
const ContractorView = React.lazy(() => import('../pages/contractor/ContractorView'));

// 404 Not Found page
const NotFound = React.lazy(() => import('../pages/NotFound'));

// Combined authentication guard
const AuthGuard = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const loading = useSelector((state) => state.auth.loading);
    
    // Production: Remove debug log
    
    // Show loading while authentication state is being determined
    if (loading || isAuthenticated === undefined) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }
    
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/forgot-password',
        element: <ForgotPassword />,
    },
    {
        path: '/reset-password',
        element: <ResetPassword />,
    },
    {
        path: '/',
        element: (
            <AuthGuard>
                <Layout />
            </AuthGuard>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard" replace />,
            },
            {
                path: 'dashboard',
                element: (
                    <Suspense fallback={<div className="p-6">Loading...</div>}>
                        <Dashboard />
                    </Suspense>
                ),
            },
            {
                path: 'users',
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<div className="p-6">Loading...</div>}>
                                <UserList />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'add',
                        element: (
                            <Suspense fallback={<div className="p-6">Loading...</div>}>
                                <UserAdd />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'edit/:id',
                        element: (
                            <Suspense fallback={<div className="p-6">Loading...</div>}>
                                <UserEdit />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'view/:id',
                        element: (
                            <Suspense fallback={<div className="p-6">Loading...</div>}>
                                <UserView />
                            </Suspense>
                        ),
                    },
                ],
            },
            {
                path: 'roles',
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<div className="p-6">Loading...</div>}>
                                <RoleList />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'add',
                        element: (
                            <Suspense fallback={<div className="p-6">Loading...</div>}>
                                <RoleAdd />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'edit/:id',
                        element: (
                            <Suspense fallback={<div className="p-6">Loading...</div>}>
                                <RoleEdit />
                            </Suspense>
                        ),
                    },
                ],
            },
            {
                path: 'change-password',
                element: (
                    <Suspense fallback={<div className="p-6">Loading...</div>}>
                        <ChangePassword />
                    </Suspense>
                ),
            },
            {
                path: 'masters',
                children: [
                    {
                        index: true,
                        element: <Navigate to="/masters/districts" replace />,
                    },
                    {
                        path: 'districts',
                        children: [
                            {
                                index: true,
                                element: (
                                    <Suspense fallback={<div className="p-6">Loading...</div>}>
                                        <DistrictList />
                                    </Suspense>
                                ),
                            },
                            {
                                path: 'add',
                                element: (
                                    <Suspense fallback={<div className="p-6">Loading...</div>}>
                                        <DistrictAdd />
                                    </Suspense>
                                ),
                            },
                            {
                                path: 'edit/:id',
                                element: (
                                    <Suspense fallback={<div className="p-6">Loading...</div>}>
                                        <DistrictEdit />
                                    </Suspense>
                                ),
                            },
                            {
                                path: 'view/:id',
                                element: (
                                    <Suspense fallback={<div className="p-6">Loading...</div>}>
                                        <DistrictView />
                                    </Suspense>
                                ),
                            },
                        ],
                    },
                    {
                        path: 'departments',
                        children: [
                            {
                                index: true,
                                element: (
                                    <Suspense fallback={<div className="p-6">Loading...</div>}>
                                        <DepartmentList />
                                    </Suspense>
                                ),
                            },
                            {
                                path: 'add',
                                element: (
                                    <Suspense fallback={<div className="p-6">Loading...</div>}>
                                        <DepartmentAdd />
                                    </Suspense>
                                ),
                            },
                            {
                                path: 'edit/:id',
                                element: (
                                    <Suspense fallback={<div className="p-6">Loading...</div>}>
                                        <DepartmentEdit />
                                    </Suspense>
                                ),
                            },
                            {
                                path: 'view/:id',
                                element: (
                                    <Suspense fallback={<div className="p-6">Loading...</div>}>
                                        <DepartmentView />
                                    </Suspense>
                                ),
                            },
                        ],
                    },
                ],
            },
            {
                path: 'work',
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<div className="p-6">Loading...</div>}>
                                <WorkList />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'add',
                        element: (
                            <Suspense fallback={<div className="p-6">Loading...</div>}>
                                <WorkAdd />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'edit/:id',
                        element: (
                            <Suspense fallback={<div className="p-6">Loading...</div>}>
                                <WorkEdit />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'view/:id',
                        element: (
                            <Suspense fallback={<div className="p-6">Loading...</div>}>
                                <WorkView />
                            </Suspense>
                        ),
                    },
                ],
            },
            {
                path: 'contractor',
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<div className="p-6">Loading...</div>}>
                                <ContractorList />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'add',
                        element: (
                            <Suspense fallback={<div className="p-6">Loading...</div>}>
                                <ContractorAdd />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'edit/:id',
                        element: (
                            <Suspense fallback={<div className="p-6">Loading...</div>}>
                                <ContractorEdit />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'view/:id',
                        element: (
                            <Suspense fallback={<div className="p-6">Loading...</div>}>
                                <ContractorView />
                            </Suspense>
                        ),
                    },
                ],
            },
            {
                path: '*',
                element: (
                    <Suspense fallback={<div className="p-6">Loading...</div>}>
                        <NotFound />
                    </Suspense>
                ),
            },
        ],
    },
]);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};

export default router;
