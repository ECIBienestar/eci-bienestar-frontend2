import { NavLink } from 'react-router-dom';
import { mockUserRole } from "../states/roleState";

const SportsNavbarUser = () => {
    const role = mockUserRole;
    const linkClasses = ({ isActive }: { isActive: boolean }) =>
        `px-4 py-2 rounded-md transition ${
            isActive
                ? 'bg-[#5B1F00] text-white'
                : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
        }`;

    return (
        <nav className="flex justify-center space-x-4 bg-white px-4 py-4 text-sm font-medium border-b border-gray-200">
            {role === "admin" ? (
                <>
                    <NavLink to="/modules/sports/homeAdmin" className={linkClasses}>
                        Bienvenido Administrador
                    </NavLink>
                    <NavLink to="/modules/sports/availableAdmin" className={linkClasses}>
                        Gestion de Artículos
                    </NavLink>
                    <NavLink to="/modules/sports/expiredListAdmin" className={linkClasses}>
                        Reservas entregadas
                    </NavLink>
                    <NavLink to="/modules/sports/loanedListAdmin" className={linkClasses}>
                        Reservas Activas
                    </NavLink>
                    <NavLink to="/modules/sports/statsAdmin" className={linkClasses}>
                        Estadisticas
                    </NavLink>
                </>
            ) : (
                <>
                    <NavLink to="/modules/sports/home" className={linkClasses}>
                        Bienvenido
                    </NavLink>
                    <NavLink to="/modules/sports/available" className={linkClasses}>
                        Reservar artículo
                    </NavLink>
                    <NavLink to="/modules/sports/Loaned" className={linkClasses}>
                        Mi Calendario
                    </NavLink>
                    <NavLink to="/modules/sports/Expired" className={linkClasses}>
                        Reservas Entregadas
                    </NavLink>
                    <NavLink to="/modules/sports/LoanedList" className={linkClasses}>
                        Reservas Activas
                    </NavLink>
                </>
            )}
        </nav>
    );
};

export default SportsNavbarUser;
