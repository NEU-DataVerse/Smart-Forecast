import React from 'react';


const Header: React.FC = () => {
    return (
        <header className="bg-sidebar shadow-md z-20">
            <div className="flex items-center justify-between h-16 px-4 md:px-6">
                <button
                    className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
                >
                </button>
                <div className="flex items-center space-x-4">
                    <button className="relative text-gray-400 hover:text-white">

                        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                    </button>
                    <div className="flex items-center space-x-2">

                        <div className="hidden md:block">
                            <p className="text-sm font-medium text-text-primary">Admin Manager</p>
                            <p className="text-xs text-text-secondary">Ha Noi City</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
