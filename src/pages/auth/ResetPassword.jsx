import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ArrowLeft, Eye, EyeOff, KeyRound, Lock } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { authService } from '../../services';
import pdcc from '../../assets/pdcc.png';

const resetPasswordSchema = z.object({
    newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[a-z]/, 'Password must contain one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain one uppercase letter')
        .regex(/\d/, 'Password must contain one number')
        .regex(/[@$!%*?&]/, 'Password must contain one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async ({ newPassword }) => {
        if (!token) {
            toast.error('Reset token is missing');
            return;
        }

        setIsSubmitting(true);
        try {
            await authService.resetPassword(token, newPassword);
            toast.success('Password updated successfully');
            navigate('/login', { replace: true });
        } catch (error) {
            const message = error.response?.data?.error || error.response?.data?.message || 'Failed to update password';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative isolate min-h-screen overflow-y-auto bg-[#f7f8fa] text-slate-900">
            <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-6 sm:py-10">
                <div className="mb-6 sm:mb-8 flex flex-col items-center gap-3 sm:gap-4 text-center">
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
                        <img src={pdcc} alt="PDCC" className="h-8 w-8 sm:h-10 sm:w-10 object-contain rounded-full" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-slate-600">PDCC</p>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">IWMS</h1>
                        <p className="text-xs sm:text-sm text-slate-600">Integrated Web Management System</p>
                    </div>
                </div>

                <Card className="relative w-full max-w-md overflow-hidden border border-slate-200 bg-white shadow-2xl">
                    <div className="relative p-5 sm:p-8 space-y-6">
                        <div className="text-center space-y-2">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 text-white">
                                <KeyRound className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">Set new password</h2>
                                <p className="text-sm text-slate-600">
                                    Choose a strong password for your account.
                                </p>
                            </div>
                        </div>

                        {!token && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                Reset token is missing. Request a new password reset link.
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <Input
                                label="New password"
                                type={showNewPassword ? 'text' : 'password'}
                                icon={<Lock className="h-4 w-4" />}
                                endIcon={showNewPassword ? <EyeOff /> : <Eye />}
                                onEndIconClick={() => setShowNewPassword(!showNewPassword)}
                                placeholder="Enter new password"
                                error={errors.newPassword?.message}
                                disabled={!token}
                                {...register('newPassword')}
                            />

                            <Input
                                label="Confirm password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                icon={<Lock className="h-4 w-4" />}
                                endIcon={showConfirmPassword ? <EyeOff /> : <Eye />}
                                onEndIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                placeholder="Confirm new password"
                                error={errors.confirmPassword?.message}
                                disabled={!token}
                                {...register('confirmPassword')}
                            />

                            <Button type="submit" className="w-full h-11" isLoading={isSubmitting} disabled={!token}>
                                Update password
                            </Button>

                            <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800">
                                <ArrowLeft className="h-4 w-4" />
                                Back to login
                            </Link>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;
