import { Navigate, Route, Routes } from "react-router-dom";
import ReservationsPage from "./components/ReservationsPage";
import RoomsPage from "./components/rooms/components/RoomsPage";
import RoomActions from "./components/RoomActions";
import ItemsPage from "./components/ItemsPage";
import StudentRooms from "./components/studentRooms";
import StudentRooms2 from "./components/studentRooms2";
import MyReservations from "./components/myReservations";
import CreaRooms from "./components/creaRooms";
import { useEffect, useState } from "react";

const RecreationalRoomsRoutes = () => {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        fetchRole();
    }, [role]);

    const fetchRole = async () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setRole(user.role);
    };

    return (
        <div className="">
            <div className="">
                <div className="bg-white rounded-lg shadow p-6 h-full">
                    <Routes>
                        {/* Ruta principal del módulo */}
                        <Route index element={<RoomActions />} />

                        <Route path="reservations" element={<ReservationsPage />} />

                        {role === 'ADMINISTRATOR' && (
                            <>
                                <Route path="rooms" element={<RoomsPage />} />
                                <Route path="items" element={<ItemsPage />} />
                            </>
                        )}

                        {role === 'STUDENT' && (
                            <>
                                <Route path="student-rooms" element={<StudentRooms />} />
                                <Route path="student-rooms2" element={<StudentRooms2 />} />
                                <Route path="my-reservations" element={<MyReservations />} />
                                <Route path="crea-rooms" element={<CreaRooms />} />
                            </>
                        )}

                        {/* Redirecciones para compatibilidad */}
                        <Route path="bookings" element={<Navigate to="reservations" replace />} />

                        {/* Ruta de fallback */}
                        <Route path="*" element={<Navigate to="" replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default RecreationalRoomsRoutes;