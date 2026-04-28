import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { authService } from '../../services';
import pdcc from '../../assets/pdcc.png';

const forgotPasswordSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
});

const RESET_COOLDOWN_MS = 60 * 1000;
const RESET_COOLDOWN_STORAGE_KEY = 'pdcc_password_reset_cooldown_until';

const formatCooldown = (milliseconds) => {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
};

const ForgotPassword = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [cooldownUntil, setCooldownUntil] = useState(() => Number(localStorage.getItem(RESET_COOLDOWN_STORAGE_KEY)) || 0);
    const [now, setNow] = useState(Date.now());

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const cooldownRemaining = Math.max(0, cooldownUntil - now);
    const isCoolingDown = cooldownRemaining > 0;
    const cooldownLabel = useMemo(() => formatCooldown(cooldownRemaining), [cooldownRemaining]);

    useEffect(() => {
        if (!isCoolingDown) {
            localStorage.removeItem(RESET_COOLDOWN_STORAGE_KEY);
            return undefined;
        }

        const intervalId = window.setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, [isCoolingDown]);

    const onSubmit = async ({ email }) => {
        if (isCoolingDown) {
            toast.error(`Please wait ${cooldownLabel} before requesting another link`);
            return;
        }

        setIsSubmitting(true);
        try {
            await authService.forgotPassword(email);
            const nextCooldownUntil = Date.now() + RESET_COOLDOWN_MS;
            localStorage.setItem(RESET_COOLDOWN_STORAGE_KEY, String(nextCooldownUntil));
            setCooldownUntil(nextCooldownUntil);
            setNow(Date.now());
            setIsSubmitted(true);
            toast.success('Password reset link sent');
        } catch (error) {
            const message = error.response?.data?.error || error.response?.data?.message || 'Failed to send reset link';
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
                                <h2 className="text-xl font-semibold">Create new password</h2>
                                <p className="text-sm text-slate-600">
                                    Enter your email and we will send a password reset link.
                                </p>
                            </div>
                        </div>

                        {isSubmitted ? (
                            <div className="space-y-5">
                                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                    If an account exists for this email, a reset link has been sent. The link expires in 1 hour.
                                    {isCoolingDown && (
                                        <span className="mt-2 block font-medium">
                                            You can request another link in {cooldownLabel}.
                                        </span>
                                    )}
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-11"
                                    onClick={() => setIsSubmitted(false)}
                                    disabled={isCoolingDown}
                                >
                                    {isCoolingDown ? `Wait ${cooldownLabel}` : 'Send another link'}
                                </Button>
                                <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to login
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <Input
                                    label="Email"
                                    icon={<Mail className="h-4 w-4" />}
                                    placeholder="Enter your email"
                                    error={errors.email?.message}
                                    {...register('email')}
                                />

                                {isCoolingDown && (
                                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                        A reset link was already requested. Try again in {cooldownLabel}.
                                    </div>
                                )}

                                <Button type="submit" className="w-full h-11" isLoading={isSubmitting} disabled={isCoolingDown}>
                                    {isCoolingDown ? `Wait ${cooldownLabel}` : 'Send reset link'}
                                </Button>

                                <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to login
                                </Link>
                            </form>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;
