import React from 'react';
import StudentNavbar from './components/SportsNavbarUser.tsx';

const SportsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div>
            <StudentNavbar />
            <main className="p-6">{children}</main>
        </div>
    );
};

export default SportsLayout;