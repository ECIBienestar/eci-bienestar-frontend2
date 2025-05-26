import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	type BookingRequestDTO,
	type HallEntity,
	type ItemEntity,
	type LoanRequestDTO,
	bookingsApi,
	itemsApi,
	localTimeToString,
	stringToLocalTime,
} from "../services/api"
import {hallsApi} from "@modules/recreational-rooms/components/rooms/services/RoomService.ts";


interface Reservation {
	id: string;
	userId: string;
	userName: string;
	userIdentification: string;
	userRole: "Estudiante" | "Docente" | "Administrativo" | "Servicios Generales";
	roomId: string;
	roomName: string;
	date: string;
	startTime: string;
	endTime: string;
	status: "Confirmada" | "Cancelada" | "Terminada" | "Pendiente";
	itemsReserved: ReservedItem[];
	returnStatus: "Pendiente" | "Completado" | "Incompleto";
	notes?: string;
}

interface ReservedItem {
	id: string;
	name: string;
	quantity: number;
	returned: boolean;
}

const ReservationsPage: React.FC = () => {
	const navigate = useNavigate();
	const [rooms, setRooms] = useState<HallEntity[]>([]);
	const [items, setItems] = useState<ItemEntity[]>([]);
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [showAddForm, setShowAddForm] = useState(false);
	const [showItemsModal, setShowItemsModal] = useState(false);
	const [showReturnModal, setShowReturnModal] = useState(false);
	const [currentReservation, setCurrentReservation] =
		useState<Reservation | null>(null);
	const [selectedItems, setSelectedItems] = useState<
		{ id: string; name: string; quantity: number }[]
	>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterStatus, setFilterStatus] = useState<string>("");
	const [selectedItemQuantity, setSelectedItemQuantity] = useState<number>(1);
	const [newReservation, setNewReservation] = useState<Partial<Reservation>>({
		userName: "",
		userIdentification: "",
		userRole: "Estudiante",
		roomId: "",
		date: "",
		startTime: "",
		endTime: "",
		itemsReserved: [],
		status: "Pendiente",
		returnStatus: "Pendiente",
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				const hallsResponse = await hallsApi.getAllHalls();
				setRooms(hallsResponse);

				const itemsResponse = await itemsApi.getAllItems();
				setItems(itemsResponse);

				const bookingsResponse = await bookingsApi.getAllBookings();

				const transformedReservations: Reservation[] = await Promise.all(
					bookingsResponse.map(async (booking: any) => {
						const loansResponse = await bookingsApi.getLoansByBookingId(booking.id);
						const loans = Array.isArray(loansResponse) ? loansResponse : [];

						const hall = await hallsApi.getHallById(booking.hallId.id);

						const reservedItems: ReservedItem[] = await Promise.all(
							loans.map(async (loan: any) => {
								const item = await itemsApi.getItemById(loan.itemId);
								return {
									id: loan.itemId.toString(),
									name: item.name,
									quantity: loan.quantity,
									returned: loan.returned || false,
								};
							}),
						);

						return {
							id: booking.id.toString(),
							userId: booking.idUser.toString(),
							userName: booking.nameUser,
							userIdentification: booking.idUser.toString(),
							userRole: mapUserRole(booking.rolUser),
							roomId: booking.hallId.toString(),
							roomName: hall.name,
							date: booking.date,
							startTime: localTimeToString(booking.startTime),
							endTime: localTimeToString(booking.endTime),
							status: mapBookingStatus(booking.status),
							itemsReserved: reservedItems,
							returnStatus: mapReturnStatus(loans),
						};
					}),
				);

				setReservations(transformedReservations);
				setError(null);
			} catch (err) {
				console.error("Error al cargar los datos:", err);
				setError(
					"Hubo un problema al cargar los datos. Por favor, intenta de nuevo más tarde.",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const mapUserRole = (
		role: string | undefined,
	): "Estudiante" | "Docente" | "Administrativo" | "Servicios Generales" => {
		if (!role) return "Estudiante";
		
		switch (role.toUpperCase()) {
			case "ESTUDIANTE":
				return "Estudiante";
			case "DOCENTE":
				return "Docente";
			case "ADMINISTRATIVO":
				return "Administrativo";
			case "SERVICIOS":
				return "Servicios Generales";
			default:
				return "Estudiante";
		}
	};

	const mapBookingStatus = (
		status: string,
	): "Confirmada" | "Cancelada" | "Terminada" | "Pendiente" => {
		switch (status.toUpperCase()) {
			case "CONFIRMED":
				return "Confirmada";
			case "CANCELLED":
				return "Cancelada";
			case "COMPLETED":
				return "Terminada";
			case "PENDING":
				return "Pendiente";
			default:
				return "Pendiente";
		}
	};

	const mapReturnStatus = (
		loans: any[],
	): "Pendiente" | "Completado" | "Incompleto" => {
		if (!loans.length) return "Pendiente";

		const allReturned = loans.every((loan) => loan.returned);
		const anyReturned = loans.some((loan) => loan.returned);

		if (allReturned) return "Completado";
		if (anyReturned) return "Incompleto";
		return "Pendiente";
	};

	const generateId = (prefix: string) => {
		return `${prefix}${Math.floor(Math.random() * 1000)
			.toString()
			.padStart(3, "0")}`;
	};

	const filteredReservations = reservations.filter((reservation) => {
		const matchesSearch =
			reservation.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			reservation.userIdentification.includes(searchQuery) ||
			reservation.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			reservation.id.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesStatus = filterStatus
			? reservation.status === filterStatus
			: true;

		return matchesSearch && matchesStatus;
	});

	const handleAddReservation = async () => {
		if (
			newReservation.userName &&
			newReservation.userIdentification &&
			newReservation.roomId &&
			newReservation.date &&
			newReservation.startTime &&
			newReservation.endTime
		) {
			try {
				setLoading(true);

				const itemsLoans: LoanRequestDTO[] = selectedItems.map((item) => ({
					idItem: Number.parseInt(item.id),
					quantity: item.quantity,
				}));

				const bookingToAdd: BookingRequestDTO = {
					nameUser: newReservation.userName,
					idUser: Number.parseInt(newReservation.userIdentification),
					rolUser: newReservation.userRole as string,
					date: newReservation.date,
					startTime: stringToLocalTime(newReservation.startTime),
					endTime: stringToLocalTime(newReservation.endTime),
					hallId: Number.parseInt(newReservation.roomId),
					itemsLoans: itemsLoans,
				};

				const response = await bookingsApi.createBooking(bookingToAdd);

				const selectedRoom = rooms.find(
					(room) => room.id?.toString() === newReservation.roomId,
				);

				const reservationToAdd: Reservation = {
					id: response.id?.toString() || generateId("RS"),
					userId: newReservation.userIdentification || "",
					userName: newReservation.userName,
					userIdentification: newReservation.userIdentification || "",
					userRole: newReservation.userRole as
						| "Estudiante"
						| "Docente"
						| "Administrativo"
						| "Servicios Generales",
					roomId: newReservation.roomId || "",
					roomName: selectedRoom ? selectedRoom.name : "",
					date: newReservation.date,
					startTime: newReservation.startTime,
					endTime: newReservation.endTime,
					status: "Confirmada",
					itemsReserved: selectedItems.map((item) => ({
						id: item.id,
						name: item.name,
						quantity: item.quantity,
						returned: false,
					})),
					returnStatus: "Pendiente",
					notes: newReservation.notes,
				};

				setReservations([...reservations, reservationToAdd]);
				resetForm();
				setError(null);
			} catch (err) {
				console.error("Error al crear la reserva:", err);
				setError(
					"Hubo un problema al crear la reserva. Por favor, intenta de nuevo.",
				);
			} finally {
				setLoading(false);
			}
		} else {
			setError("Por favor, completa todos los campos obligatorios.");
		}
	};

	const resetForm = () => {
		setNewReservation({
			userName: "",
			userIdentification: "",
			userRole: "Estudiante",
			roomId: "",
			date: "",
			startTime: "",
			endTime: "",
			itemsReserved: [],
			status: "Pendiente",
			returnStatus: "Pendiente",
		});
		setSelectedItems([]);
		setShowAddForm(false);
	};

	const handleSelectItem = (item: ItemEntity) => {
		const existingItem = selectedItems.find(
			(i) => i.id === item.id?.toString(),
		);

		if (existingItem) {
			setSelectedItems(
				selectedItems.map((i) =>
					i.id === item.id?.toString()
						? { ...i, quantity: i.quantity + selectedItemQuantity }
						: i,
				),
			);
		} else {
			setSelectedItems([
				...selectedItems,
				{
					id: item.id?.toString() || "",
					name: item.name,
					quantity: selectedItemQuantity,
				},
			]);
		}

		setSelectedItemQuantity(1);
	};

	const handleRemoveItem = (itemId: string) => {
		setSelectedItems(selectedItems.filter((item) => item.id !== itemId));
	};

	const handleChangeStatus = async (
		reservationId: string,
		newStatus: "Confirmada" | "Cancelada" | "Terminada" | "Pendiente",
	) => {
		try {
			setLoading(true);

			if (newStatus === "Cancelada") {
				await bookingsApi.cancelBooking(Number.parseInt(reservationId));
			}

			setReservations(
				reservations.map((reservation) =>
					reservation.id === reservationId
						? { ...reservation, status: newStatus }
						: reservation,
				),
			);

			setError(null);
		} catch (err) {
			console.error("Error al cambiar el estado de la reserva:", err);
			setError(
				"Hubo un problema al cambiar el estado de la reserva. Por favor, intenta de nuevo.",
			);
		} finally {
			setLoading(false);
		}
	};

	const handleReturnItems = async () => {
		if (!currentReservation) return;

		try {
			setLoading(true);

			await bookingsApi.returnBooking(Number.parseInt(currentReservation.id));

			const allReturned = currentReservation.itemsReserved.every(
				(item) => item.returned,
			);

			setReservations(
				reservations.map((reservation) =>
					reservation.id === currentReservation.id
						? {
								...reservation,
								itemsReserved: currentReservation.itemsReserved,
								returnStatus: allReturned ? "Completado" : "Incompleto",
								status: allReturned ? "Terminada" : reservation.status,
							}
						: reservation,
				),
			);

			setShowReturnModal(false);
			setCurrentReservation(null);
			setError(null);
		} catch (err) {
			console.error("Error al procesar la devolución:", err);
			setError(
				"Hubo un problema al procesar la devolución. Por favor, intenta de nuevo.",
			);
		} finally {
			setLoading(false);
		}
	};

	const handleItemReturnChange = (itemId: string, returned: boolean) => {
		if (!currentReservation) return;

		const updatedItems = currentReservation.itemsReserved.map((item) =>
			item.id === itemId ? { ...item, returned } : item,
		);

		setCurrentReservation({
			...currentReservation,
			itemsReserved: updatedItems,
		});
	};
	return (
		<div className="container mx-auto px-4 py-6">
			<div className="flex justify-between items-center mb-6">
				<div className="flex items-center">
					<button
						onClick={() => navigate("/modules/recreation")}
						className="mr-4 text-green-700 hover:text-green-900 flex items-center"
						aria-label="Volver a opciones de salas recreativas"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 mr-1"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
								clipRule="evenodd"
							/>
						</svg>
						Volver
					</button>
					<h1 className="text-2xl font-bold text-gray-800">
						Gestión de Reservas
					</h1>
				</div>
				<div className="flex space-x-4">
					<div className="relative">
						<input
							type="text"
							placeholder="Buscar reservas..."
							className="border rounded-lg px-4 py-2 w-64"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						<svg
							className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
					<select
						className="border rounded-lg px-4 py-2"
						value={filterStatus}
						onChange={(e) => setFilterStatus(e.target.value)}
					>
						<option value="">Todos los estados</option>
						<option value="Confirmada">Confirmada</option>
						<option value="Cancelada">Cancelada</option>
						<option value="Terminada">Terminada</option>
						<option value="Pendiente">Pendiente</option>
					</select>
					<button
						onClick={() => setShowAddForm(!showAddForm)}
						className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
					>
						{showAddForm ? "Cancelar" : "Nueva Reserva"}
					</button>
				</div>
			</div>

			{error && (
				<div
					className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
					role="alert"
				>
					<p>{error}</p>
				</div>
			)}

			{loading && (
				<div className="flex justify-center my-8">
					<div
						className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-green-600 border-r-transparent"
						role="status"
					>
						<span className="sr-only">Cargando...</span>
					</div>
					<span className="ml-2">Cargando...</span>
				</div>
			)}

			{showAddForm && (
				<div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
					<h2 className="text-xl font-semibold mb-4">Nueva Reserva</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Nombre Completo
							</label>
							<input
								type="text"
								className="w-full px-3 py-2 border border-gray-300 rounded-md"
								value={newReservation.userName}
								onChange={(e) =>
									setNewReservation({
										...newReservation,
										userName: e.target.value,
									})
								}
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Número de Identificación
							</label>
							<input
								type="text"
								className="w-full px-3 py-2 border border-gray-300 rounded-md"
								value={newReservation.userIdentification}
								onChange={(e) =>
									setNewReservation({
										...newReservation,
										userIdentification: e.target.value,
									})
								}
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Rol
							</label>
							<select
								className="w-full px-3 py-2 border border-gray-300 rounded-md"
								value={newReservation.userRole}
								onChange={(e) =>
									setNewReservation({
										...newReservation,
										userRole: e.target.value as any,
									})
								}
								required
							>
								<option value="Estudiante">Estudiante</option>
								<option value="Docente">Docente</option>
								<option value="Administrativo">Administrativo</option>
								<option value="Servicios Generales">Servicios Generales</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Sala
							</label>
							<select
								className="w-full px-3 py-2 border border-gray-300 rounded-md"
								value={newReservation.roomId}
								onChange={(e) =>
									setNewReservation({
										...newReservation,
										roomId: e.target.value,
									})
								}
								required
							>
								<option value="">Selecciona una sala</option>
								{rooms.map((room) => (
									<option key={room.id} value={room.id}>
										{room.name}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Fecha
							</label>
							<input
								type="date"
								className="w-full px-3 py-2 border border-gray-300 rounded-md"
								value={newReservation.date}
								onChange={(e) =>
									setNewReservation({ ...newReservation, date: e.target.value })
								}
								min={new Date().toISOString().split("T")[0]}
								required
							/>
						</div>
						<div className="flex space-x-4">
							<div className="flex-1">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Hora de Inicio
								</label>
								<input
									type="time"
									className="w-full px-3 py-2 border border-gray-300 rounded-md"
									value={newReservation.startTime}
									onChange={(e) =>
										setNewReservation({
											...newReservation,
											startTime: e.target.value,
										})
									}
									required
								/>
							</div>
							<div className="flex-1">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Hora de Fin
								</label>
								<input
									type="time"
									className="w-full px-3 py-2 border border-gray-300 rounded-md"
									value={newReservation.endTime}
									onChange={(e) =>
										setNewReservation({
											...newReservation,
											endTime: e.target.value,
										})
									}
									required
								/>
							</div>
						</div>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Elementos a Reservar
						</label>
						<div className="flex items-center">
							<button
								onClick={() => setShowItemsModal(true)}
								className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
							>
								Seleccionar Elementos
							</button>
							<span className="ml-2 text-gray-600">
								{selectedItems.length} elementos seleccionados
							</span>
						</div>
						{selectedItems.length > 0 && (
							<div className="mt-3 flex flex-wrap gap-2">
								{selectedItems.map((item) => (
									<div
										key={item.id}
										className="bg-gray-100 px-3 py-1 rounded-full flex items-center"
									>
										<span>
											{item.name} ({item.quantity})
										</span>
										<button
											onClick={() => handleRemoveItem(item.id)}
											className="ml-2 text-red-500 hover:text-red-700"
										>
											&times;
										</button>
									</div>
								))}
							</div>
						)}
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Notas Adicionales
						</label>
						<textarea
							className="w-full px-3 py-2 border border-gray-300 rounded-md"
							value={newReservation.notes || ""}
							onChange={(e) =>
								setNewReservation({ ...newReservation, notes: e.target.value })
							}
							rows={3}
						/>
					</div>

					<div className="flex justify-end space-x-3">
						<button
							onClick={resetForm}
							className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
						>
							Cancelar
						</button>
						<button
							onClick={handleAddReservation}
							className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
						>
							Crear Reserva
						</button>
					</div>
				</div>
			)}

			{/* Modal para seleccionar elementos */}
			{showItemsModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold">Seleccionar Elementos</h3>
							<button
								onClick={() => setShowItemsModal(false)}
								className="text-gray-500 hover:text-gray-700"
							>
								&times;
							</button>
						</div>

						<div className="max-h-96 overflow-y-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Elemento
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Disponibles
										</th>
										<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
											Cantidad
										</th>
										<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
											Acción
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{items.map((item) => {
										const itemId = item.id?.toString() || "";
										const reservedQuantity =
											selectedItems.find((i) => i.id === itemId)?.quantity || 0;
										const availableQty =
											(item.quantityAvailable || 0) - reservedQuantity;

										return (
											<tr key={itemId} className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
													{item.name}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{availableQty} de{" "}
													{item.quantityAvailable || item.quantity || 0}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-center">
													<input
														type="number"
														min="1"
														max={availableQty}
														value={selectedItemQuantity}
														onChange={(e) =>
															setSelectedItemQuantity(
																Number.parseInt(e.target.value) || 1,
															)
														}
														className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
														disabled={availableQty <= 0}
													/>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
													<button
														onClick={() => handleSelectItem(item)}
														className="text-blue-600 hover:text-blue-900"
														disabled={availableQty <= 0}
													>
														{selectedItems.some((i) => i.id === itemId)
															? "Actualizar"
															: "Añadir"}
													</button>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>

						<div className="mt-4 flex justify-end">
							<button
								onClick={() => setShowItemsModal(false)}
								className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
							>
								Confirmar
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Modal para devolver elementos */}
			{showReturnModal && currentReservation && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold">
								Registrar Devolución de Elementos
							</h3>
							<button
								onClick={() => {
									setShowReturnModal(false);
									setCurrentReservation(null);
								}}
								className="text-gray-500 hover:text-gray-700"
							>
								&times;
							</button>
						</div>

						<div className="mb-4">
							<p className="text-gray-700">
								<span className="font-medium">Reserva:</span>{" "}
								{currentReservation.id}
							</p>
							<p className="text-gray-700">
								<span className="font-medium">Usuario:</span>{" "}
								{currentReservation.userName}
							</p>
							<p className="text-gray-700">
								<span className="font-medium">Sala:</span>{" "}
								{currentReservation.roomName}
							</p>
						</div>

						<div className="mb-4">
							<h4 className="font-medium mb-2">Elementos prestados:</h4>
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Elemento
										</th>
										<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
											Cantidad
										</th>
										<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
											Estado
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{currentReservation.itemsReserved.map((item) => (
										<tr key={item.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
												{item.name}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
												{item.quantity}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-center">
												<select
													className={`px-3 py-1 rounded-full text-sm font-medium ${
														item.returned
															? "bg-green-100 text-green-800"
															: "bg-red-100 text-red-800"
													}`}
													value={item.returned ? "returned" : "not-returned"}
													onChange={(e) =>
														handleItemReturnChange(
															item.id,
															e.target.value === "returned",
														)
													}
												>
													<option value="returned">Devuelto</option>
													<option value="not-returned">No Devuelto</option>
												</select>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<div className="mt-4 flex justify-end">
							<button
								onClick={handleReturnItems}
								className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
							>
								Confirmar Devolución
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Tabla de reservas */}
			<div className="bg-white rounded-lg shadow overflow-hidden">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								ID
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Usuario
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Sala
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Fecha y Hora
							</th>
							<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
								Estado
							</th>
							<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
								Devolución
							</th>
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
								Acciones
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{filteredReservations.map((reservation) => (
							<tr key={reservation.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{reservation.id}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									<div>
										<p className="font-medium">{reservation.userName}</p>
										<p className="text-xs text-gray-400">
											{reservation.userIdentification} ({reservation.userRole})
										</p>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{reservation.roomName}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									<div>
										<p>{new Date(reservation.date).toLocaleDateString()}</p>
										<p className="text-xs text-gray-400">
											{reservation.startTime} - {reservation.endTime}
										</p>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-center">
									<span
										className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
											reservation.status === "Confirmada"
												? "bg-green-100 text-green-800"
												: reservation.status === "Cancelada"
													? "bg-red-100 text-red-800"
													: reservation.status === "Terminada"
														? "bg-blue-100 text-blue-800"
														: "bg-yellow-100 text-yellow-800"
										}`}
									>
										{reservation.status}
									</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-center">
									<span
										className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
											reservation.returnStatus === "Completado"
												? "bg-green-100 text-green-800"
												: reservation.returnStatus === "Incompleto"
													? "bg-orange-100 text-orange-800"
													: "bg-yellow-100 text-yellow-800"
										}`}
									>
										{reservation.returnStatus}
									</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<div className="flex justify-end space-x-2">
										<button
											onClick={() => {
												setCurrentReservation(reservation);
												setShowReturnModal(true);
											}}
											className="text-blue-600 hover:text-blue-900"
											disabled={reservation.status !== "Confirmada"}
										>
											Devolución
										</button>
										<div className="relative group">
											<button className="text-gray-600 hover:text-gray-900">
												Estado ▼
											</button>
											<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
												<div className="py-1">
													<button
														onClick={() =>
															handleChangeStatus(reservation.id, "Confirmada")
														}
														className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
													>
														Confirmada
													</button>
													<button
														onClick={() =>
															handleChangeStatus(reservation.id, "Cancelada")
														}
														className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
													>
														Cancelada
													</button>
													<button
														onClick={() =>
															handleChangeStatus(reservation.id, "Terminada")
														}
														className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
													>
														Terminada
													</button>
												</div>
											</div>
										</div>
									</div>
								</td>
							</tr>
						))}
						{filteredReservations.length === 0 && (
							<tr>
								<td
									colSpan={7}
									className="px-6 py-4 text-center text-sm text-gray-500"
								>
									No se encontraron reservas con los criterios de búsqueda.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ReservationsPage;
