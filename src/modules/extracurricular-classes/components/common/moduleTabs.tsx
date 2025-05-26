import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Tab {
  label: string;
  path: string;
  roles?: string[]; 
}

interface ModuleTabsProps {
  tabs: Tab[];
  userRole: string;
}

const ModuleTabs: React.FC<ModuleTabsProps> = ({ tabs, userRole }) => {
const location = useLocation();
  
// Filtrar pestañas visibles para el rol actual
const visibleTabs = tabs.filter(tab => 
  !tab.roles || tab.roles.includes(userRole)
);
  
return (
    <div className="flex border-b">
      {visibleTabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`px-6 py-3 text-lg font-medium transition-colors ${
              isActive
                ? 'bg-[#362550] text-white rounded-t-[30px]'
                : 'bg-white text-gray-700 hover:bg-gray-100 rounded-t-[30px]'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
);
};

export default ModuleTabs;