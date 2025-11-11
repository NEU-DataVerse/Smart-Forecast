import React from 'react';


const Login: React.FC = () => {

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-full max-w-md px-4">
                <div className="shadow-2xl">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-center text-text-primary md:text-2xl">
                            EnviroSys Manager Login
                        </h1>
                        <form className="space-y-4 md:space-y-6">
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-text-secondary">Your email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="bg-gray-700 border border-border text-text-primary sm:text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-text-secondary">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-700 border border-border text-text-primary sm:text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                                    required

                                />
                            </div>
                            <div className="flex items-center justify-end">
                                <a href="#" className="text-sm font-medium text-primary hover:underline">Forgot password?</a>
                            </div>
                            <button
                                type="submit"
                                className="w-full text-white bg-primary hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Sign in
                            </button>
                        </form>
                    </div>
                </div>
                <p className="text-center text-sm text-text-secondary mt-4">
                    Use <code className="bg-gray-700 p-1 rounded-sm">admin@example.com</code> and <code className="bg-gray-700 p-1 rounded-sm">password</code> to sign in.
                </p>
            </div>
        </div>
    );
};

export default Login;
