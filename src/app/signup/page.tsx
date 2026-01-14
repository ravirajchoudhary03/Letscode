"use client";

import Link from "next/link";
import { DotCube } from "@/components/DotCube";

export default function SignupPage() {
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
                        Join thousands of brands tracking their digital echo today.
                    </p>
                </div>
            </div>

            {/* Right Panel - Signup Form */}
            <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 lg:p-24">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            Create your account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link href="/login" className="font-medium text-black hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 space-y-6">
                        <form className="space-y-6" action="#" method="POST">
                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="businessName"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Business Name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="businessName"
                                            name="businessName"
                                            type="text"
                                            required
                                            className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                                            placeholder="My Awesome Brand"
                                        />
                                    </div>
                                </div>

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
                                            placeholder="you@company.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="gstNo"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        GST No
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="gstNo"
                                            name="gstNo"
                                            type="text"
                                            required
                                            className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                                            placeholder="22AAAAA0000A1Z5"
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
                                            autoComplete="new-password"
                                            required
                                            className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    required
                                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                                />
                                <label
                                    htmlFor="terms"
                                    className="ml-2 block text-sm text-gray-900"
                                >
                                    I agree to the <a href="#" className="font-medium text-black hover:underline">Terms of Service</a> and <a href="#" className="font-medium text-black hover:underline">Privacy Policy</a>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-lg bg-black px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-colors"
                            >
                                Sign Up
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
