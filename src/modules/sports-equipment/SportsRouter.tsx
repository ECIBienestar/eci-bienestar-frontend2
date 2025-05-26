import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Available from './pages/Available';
import Loaned from './pages/Loaned';
import Expired from './pages/Expired';
import SportsLayout from './SportsLayout.tsx';
import ItemList from "./pages/itemList.tsx";
import LoanedList from "./pages/LoanedList.tsx";
import HomeAdmin from "./pages/HomeAdmin.tsx";
import AvailableAdmin from "./pages/AvailableAdmin.tsx";
import ExpiredListAdmin from "./pages/ExpiredListAdmin.tsx";
import LoanedListAdmin from "./pages/LoanedListAdmin.tsx";
import StatsAdmin from "./pages/StatsAdmin.tsx";
import { mockUserRole } from "./states/roleState";
import ItemListAdmin from "./pages/ItemListAdmin.tsx";


const SportsRouter = () => {
    const role = mockUserRole;
    return (
        <SportsLayout>
            <Routes>
                {/* Rutas para user */}
                {role === "user" && (
                    <>
                        <Route path="home" element={<Home />} />
                        <Route path="available" element={<Available />} />
                        <Route path="loaned" element={<Loaned />} />
                        <Route path="expired" element={<Expired />} />
                        <Route path="available/item/:id" element={<ItemList />} />
                        <Route path="LoanedList" element={<LoanedList />} />
                        <Route path="*" element={<Navigate to="/modules/sports/home" replace />} />
                        {/* Redirige si intenta ir a páginas de admin */}
                        <Route path="/modules/sports/homeAdmin" element={<Navigate to="/modules/sports/home" />} />
                        <Route path="/modules/sports/availableAdmin" element={<Navigate to="/modules/sports/home" />} />
                    </>
                )}
                {/* Rutas para admin */}
                {role === "admin" && (
                    <>
                        <Route path="homeAdmin" element={<HomeAdmin />} />
                        <Route path="availableAdmin" element={<AvailableAdmin />} />
                        <Route path="expiredListAdmin" element={<ExpiredListAdmin />} />
                        <Route path="availableAdmin/item/:id" element={<ItemListAdmin />} />
                        <Route path="loanedListAdmin" element={<LoanedListAdmin />} />
                        <Route path="statsAdmin" element={<StatsAdmin />} />
                        <Route path="*" element={<Navigate to="/modules/sports/homeAdmin" replace />} />
                    </>
                )}

            </Routes>

        </SportsLayout>
    );
};

export default SportsRouter;
