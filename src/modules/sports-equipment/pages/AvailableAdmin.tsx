import React from 'react';
import { Link } from 'react-router-dom';
import futbolImg from '../Images-sport-equipment/futbol.png';
import basketImg from '../Images-sport-equipment/basket.png';
import voleyImg from '../Images-sport-equipment/voley.png';
import raquetasImg from '../Images-sport-equipment/raquetas.png';
import pelotasImg from '../Images-sport-equipment/pelotas.png';
import equipamientoImg from '../Images-sport-equipment/equipamiento.png';

const items = [
    { id: 1, label: 'Balones de futbol', image: futbolImg, path: '/futbol' },
    { id: 2, label: 'Balones de Basket', image: basketImg, path: '/basket' },
    { id: 3, label: 'Balones de voleybol', image: voleyImg, path: '/voley' },
    { id: 4, label: 'Raquetas', image: raquetasImg, path: '/raquetas' },
    { id: 5, label: 'Pelotas', image: pelotasImg, path: '/pelotas' },
    { id: 6, label: 'Equipamiento deportivo', image: equipamientoImg, path: '/equipamiento' },
];

const AvailableAdmin: React.FC = () => {
    return (
        <div className="px-2 py-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Artículos disponibles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4 max-w-6xl mx-auto">
                {items.map(({ id, label, image, path }) => (
                    <Link to={`item${path}`} key={id}>
                        <div className="rounded-lg overflow-hidden shadow hover:shadow-md transition border-2 border-[#4B1E0D] cursor-pointer">
                            <div className="bg-white px-4 pt-4 pb-2 flex flex-col items-center justify-center">
                                <img src={image} alt={label} className="w-32 h-32 object-contain mb-2" />
                            </div>
                            <div className="text-center text-white bg-[#4B1E0D] mt-2 w-full py-2 rounded-b-md font-semibold text-sm">
                                {label}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AvailableAdmin;