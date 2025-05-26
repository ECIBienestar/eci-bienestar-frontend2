import {
  CalendarDaysIcon,
  CubeIcon,
  ChartBarIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import type React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../../assets/images/recreational-rooms.jpg";
import { useState } from "react";
import { useEffect } from "react";
import { Role } from "@common/types";

const navigationOptions = [
	{
		label: "Salas",
		description: "Administra las salas recreativas disponibles en el campus",
		to: "/modules/recreation/rooms",
		icon: CubeIcon,
		roles: [Role.ADMINISTRATOR]
	},
	{
		label: "Reservas",
		description: "Gestiona las reservas de salas y elementos recreativos",
		to: "/modules/recreation/reservations",
		icon: CalendarDaysIcon,
		roles: [Role.ADMINISTRATOR]
	},
	{
		label: "Reservar",
		description: "Crea tus reservas de salas y elementos recreativos",
		to: "/modules/recreation/crea-rooms",
		icon: CalendarDaysIcon,
		roles: [Role.STUDENT]
	},
	{
		label: "Mis Reservas",
		description: "Consulta tus reservas de salas y elementos recreativos",
		to: "/modules/recreation/my-reservations",
		icon: CalendarDaysIcon,
		roles: [Role.STUDENT]
	},

	{
		label: "Elementos",
		description: "Administra los elementos recreativos disponibles para préstamo",
		to: "/modules/recreation/items",
		icon: FireIcon,
		roles: [Role.ADMINISTRATOR]
	},
	{
		label: "Reportes",
		description: "Genera reportes de reservas y elementos",
		to: "/modules/recreation/reports",
		icon: ChartBarIcon,
		roles: [Role.ADMINISTRATOR]
	},
];

const TurnActions: React.FC = () => {
	const navigate = useNavigate();
	const [role, setRole] = useState<string | null>(null);

	useEffect(() => {
		fetchRole();
	}, []);

	const fetchRole = async () => {
		const user = JSON.parse(localStorage.getItem('user') || '{}');
		setRole(user.role);
	}

	const filteredOptions = navigationOptions.filter(option => 
		option.roles.includes(role as Role)
	);

	return (
		<div className="p-4">
			<div className="h-[45vh] mb-6">
				<div className="relative w-full h-full rounded-2xl overflow-hidden">
					<img
						src={backgroundImage}
						alt="Recreational rooms background"
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-black/40" />
					<div className="absolute bottom-0 w-full p-4 bg-black/40 border-t border-gray-600">
						<p className="text-white text-2xl max-md:text-xl">
							<strong>Bienvenido al servicio de gestión de Reservas de Salas de Recreación</strong>
						</p>
					</div>
				</div>
			</div>

			<div className="flex flex-col items-center">
				<h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
					¿Qué deseas hacer?
				</h2>
				<div className="flex w-full justify-center gap-4 flex-wrap">
					{filteredOptions.map(({ label, description, to, icon: Icon }) => (
						<button
							key={label}
							type="button"
							className="h-full w-72 bg-white rounded-2xl shadow-md transition-all hover:-translate-y-1 cursor-pointer text-left"
							onClick={() => navigate(to)}
						>
							<div className="flex flex-col items-center justify-center p-4 text-center">
								<div className="bg-green-100 text-green-600 rounded-full p-3 flex items-center justify-center mb-3">
									<Icon className="h-6 w-6" />
								</div>
								<h3 className="text-xl font-medium mb-2 text-green-700">{label}</h3>
								<p className="text-sm text-gray-600">
									{description}
								</p>
							</div>
						</button>
					))}
				</div>
			</div>
		</div>
	);

};

export default TurnActions;
