import Link from "next/link";
import { DotCube } from "@/components/DotCube";
import { Chrome } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen w-full">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex w-1/2 bg-black flex-col justify-center items-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800/30 via-black to-black opacity-50" />

                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                    <div className="scale-150 mb-4">
                        <DotCube />
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight text-white mb-2">
                        Marketecho
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-md">
                        Tracking how your brand echoes across the digital landscape
                    </p>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 lg:p-24">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            Login to your account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link href="/signup" className="font-medium text-black hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 space-y-6">
                        <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white text-gray-700 font-medium">
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Sign in with Google
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500">OR</span>
                            </div>
                        </div>

                        <form className="space-y-6" action="#" method="POST">
                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Email
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Password
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                                        />
                                    </div>
                                    <div className="flex items-center justify-end mt-1">
                                        <a
                                            href="#"
                                            className="text-sm font-medium text-gray-600 hover:text-black"
                                        >
                                            Forgot Password?
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-900"
                                >
                                    Remember me
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-lg bg-black px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-colors"
                            >
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
