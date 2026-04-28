import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { KeyRound, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { loginUser } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import pdcc from '../../assets/pdcc.png'
import wcdLogo from "../../assets/wcd-logo.jpg";
import indianLogo from "../../assets/indian-logo.jpg";
import mhGovtLogo from "../../assets/mh-govt-logo.jpg";

const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const { handleError, clearError, getFieldError } = useErrorHandler();

    // Check if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        const result = await dispatch(loginUser(data));
        
        if (loginUser.fulfilled.match(result)) {
            toast.success('Login successful');
            navigate('/dashboard');
        }
    };

    return (
        <div className="relative isolate min-h-screen overflow-y-auto bg-[#f7f8fa] text-slate-900">
            <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-6 sm:py-10">
                
                {/* Header */}
                <div className="mb-6 sm:mb-8 flex flex-col items-center gap-3 sm:gap-4 text-center">
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
                            <img src={indianLogo} alt="India Emblem" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
                        </div> */}
                        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
                            <img src={pdcc} alt="PDCC" className="h-8 w-8 sm:h-10 sm:w-10 object-contain rounded-full" />
                        </div>
                        {/* <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
                            <img src={wcdLogo} alt="WCD Logo" className="h-9 w-9 sm:h-11 sm:w-11 object-contain" />
                        </div> */}
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-slate-600">
                            PDCC
                        </p>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                            IWMS
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-600">
                            Integrated Web Management System
                        </p>
                    </div>
                </div>

                {/* Login Card */}
                <Card className="relative w-full max-w-md overflow-hidden border border-slate-200 bg-white shadow-2xl">
                    <div className="relative p-5 sm:p-8 space-y-6">

                        <div className="text-center space-y-2">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 text-white">
                                <Lock className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold">Sign in</h2>
                                <p className="text-sm text-slate-600">
                                    Use your admin credentials to continue
                                </p>
                            </div>
                        </div>

                        {/* Error Display */}
                        <ErrorDisplay 
                            error={error} 
                            onClose={clearError}
                            showCorrelationId={true}
                        />

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                            <Input
                                label="Email"
                                icon={<User className="h-4 w-4" />}
                                placeholder="Enter your email"
                                error={errors.email?.message}
                                {...register('email')}
                            />

                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                icon={<Lock className="h-4 w-4" />}
                                endIcon={showPassword ? <EyeOff /> : <Eye />}
                                onEndIconClick={() => setShowPassword(!showPassword)}
                                placeholder="Enter your password"
                                error={errors.password?.message}
                                {...register('password')}
                            />

                            <Button type="submit" className="w-full h-11" isLoading={loading}>
                                Sign In
                            </Button>

                        </form>

                        <div className="flex justify-center">
                            <Link
                                to="/forgot-password"
                                className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800"
                            >
                                <KeyRound className="h-4 w-4" />
                                Create new password
                            </Link>
                        </div>

                        <p className="text-center text-xs text-slate-500">
                            &copy; {new Date().getFullYear()} Integrated Web Management System
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;
