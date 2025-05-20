import { Dialog, Transition } from "@headlessui/react";
import {
	EyeIcon,
	PencilIcon,
	TrashIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import type React from "react";
import { Fragment, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { HallEntity } from "../types/RoomTypes";
import { Room } from "../types/RoomTypes.ts";
import { hallsApi } from "../services/RoomService";

const RoomsPage: React.FC = () => {
	const navigate = useNavigate();
	const [rooms, setRooms] = useState<Room[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [isFormModalOpen, setIsFormModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
	const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
	const [roomToView, setRoomToView] = useState<Room | null>(null);

	const [newRoom, setNewRoom] = useState<Partial<Room>>({
		name: "",
		location: "",
		capacity: 0,
		description: "",
		isAvailable: true,
		openingHours: "08:00",
		closingHours: "20:00",
		features: [],
	});
	const [newFeature, setNewFeature] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		const fetchRooms = async () => {
			try {
				setLoading(true);
				const response = await hallsApi.getAllHalls();

				const transformedRooms: Room[] = response.map((hall: HallEntity) => ({
					id: hall.id?.toString() || "",
					name: hall.name,
					location: hall.location,
					capacity: hall.capacity,
					description: hall.description,
					isAvailable: hall.status === "A",
					openingHours: "08:00",
					closingHours: "20:00",
					features: hall.description.includes(",")
						? hall.description.split(",").map((f) => f.trim())
						: [],
				}));
				setRooms(transformedRooms);
				setError(null);
			} catch (err) {
				console.error("Error al cargar las salas:", err);
				setError(
					"Hubo un problema al cargar las salas. Por favor, intenta de nuevo más tarde.",
				);
				toast.error("Error al cargar las salas", {
					icon: "❌",
					duration: 3000,
				});
			} finally {
				setLoading(false);
			}
		};

		fetchRooms();
	}, []);
	const handleSearch = (query: string) => {
		setSearchQuery(query);
		const filteredResults = rooms.filter(
			(room) =>
				room.name.toLowerCase().includes(query.toLowerCase()) ||
				room.location.toLowerCase().includes(query.toLowerCase()) ||
				room.description.toLowerCase().includes(query.toLowerCase()),
		);

		if (query && filteredResults.length > 0) {
			toast.success(`${filteredResults.length} salas encontradas`, {
				icon: "🔍",
				duration: 1500,
				style: {
					background: "#3B82F6",
					color: "white",
				},
			});
		} else if (query && filteredResults.length === 0) {
			toast.error("No se encontraron salas con esos criterios", {
				icon: "🔍",
				duration: 1500,
			});
		}
	};

	const filteredRooms = rooms.filter(
		(room) =>
			room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			room.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
			room.description.toLowerCase().includes(searchQuery.toLowerCase()),
	);
	const handleAddRoom = async () => {
		if (newRoom.name && newRoom.location) {
			try {
				setLoading(true);

				const hallToAdd: HallEntity = {
					name: newRoom.name,
					location: newRoom.location,
					capacity: newRoom.capacity || 0,
					status: newRoom.isAvailable ? "A" : "I",
					description: newRoom.features?.length
						? newRoom.features.join(", ") +
							(newRoom.description ? `. ${newRoom.description}` : "")
						: newRoom.description || "",
				};

				await hallsApi.addHall(hallToAdd);

				setIsFormModalOpen(false);
				setSelectedRoom(null);
				setNewRoom({
					name: "",
					location: "",
					capacity: 0,
					description: "",
					isAvailable: true,
					openingHours: "08:00",
					closingHours: "20:00",
					features: [],
				});
				setError(null);

				const response = await hallsApi.getAllHalls();
				const transformedRooms: Room[] = response.map((hall: HallEntity) => ({
					id: hall.id?.toString() || "",
					name: hall.name,
					location: hall.location,
					capacity: hall.capacity,
					description: hall.description,
					isAvailable: hall.status === "A",
					openingHours: "08:00",
					closingHours: "20:00",
					features: hall.description.includes(",")
						? hall.description.split(",").map((f) => f.trim())
						: [],
				}));
				setRooms(transformedRooms);

				toast.success("Sala añadida con éxito");
			} catch (err) {
				console.error("Error al añadir la sala:", err);
				setError(
					"Hubo un problema al añadir la sala. Por favor, intenta de nuevo.",
				);
				toast.error("Error al añadir la sala. Inténtalo de nuevo.");
			} finally {
				setLoading(false);
			}
		} else {
			toast.error("El nombre y la ubicación son campos obligatorios", {
				style: {
					borderRadius: "10px",
					background: "#f44336",
					color: "#fff",
				},
				iconTheme: {
					primary: "#fff",
					secondary: "#f44336",
				},
			});
		}
	};

	const handleEditRoom = (roomId: string) => {
		const roomToEdit = rooms.find((room) => room.id === roomId);
		if (roomToEdit) {
			setNewRoom(roomToEdit);
			setSelectedRoom(roomId);
			setIsFormModalOpen(true);
		}
	};
	const handleSaveEdit = async () => {
		if (selectedRoom && newRoom.name && newRoom.location) {
			try {
				setLoading(true);

				const hallToUpdate: HallEntity = {
					id: Number.parseInt(selectedRoom),
					name: newRoom.name,
					location: newRoom.location,
					capacity: newRoom.capacity || 0,
					status: newRoom.isAvailable ? "A" : "I",
					description: newRoom.features?.length
						? newRoom.features.join(", ") +
							(newRoom.description ? `. ${newRoom.description}` : "")
						: newRoom.description || "",
				};
				await hallsApi.addHall(hallToUpdate);

				setRooms(
					rooms.map((room) =>
						room.id === selectedRoom
							? {
									...room,
									name: newRoom.name || room.name,
									location: newRoom.location || room.location,
									capacity: newRoom.capacity || room.capacity,
									description: newRoom.description || room.description,
									isAvailable:
										newRoom.isAvailable !== undefined
											? newRoom.isAvailable
											: room.isAvailable,
									openingHours: newRoom.openingHours || room.openingHours,
									closingHours: newRoom.closingHours || room.closingHours,
									features: newRoom.features || room.features,
								}
							: room,
					),
				);

				setNewRoom({
					name: "",
					location: "",
					capacity: 0,
					description: "",
					isAvailable: true,
					openingHours: "08:00",
					closingHours: "20:00",
					features: [],
				});
				setSelectedRoom(null);
				setIsFormModalOpen(false);
				setError(null);
				toast.success(`Sala "${newRoom.name}" actualizada con éxito`);
			} catch (err) {
				console.error("Error al actualizar la sala:", err);
				setError(
					"Hubo un problema al actualizar la sala. Por favor, intenta de nuevo.",
				);
				toast.error("Error al actualizar la sala. Inténtalo de nuevo.");
			} finally {
				setLoading(false);
			}
		} else {
			toast.error("El nombre y la ubicación son campos obligatorios");
		}
	};

	const openDeleteModal = (roomId: string) => {
		setRoomToDelete(roomId);
		setIsDeleteModalOpen(true);
	};
	const handleDeleteRoom = async () => {
		if (!roomToDelete) return;

		try {
			setLoading(true);
			const roomName =
				rooms.find((room) => room.id === roomToDelete)?.name || "Sala";
			await hallsApi.deleteHall(Number.parseInt(roomToDelete));
			setRooms(rooms.filter((room) => room.id !== roomToDelete));
			setError(null);
			setIsDeleteModalOpen(false);
			setRoomToDelete(null);
			toast.success(`Sala "${roomName}" eliminada con éxito`);
		} catch (err) {
			console.error("Error al eliminar la sala:", err);
			setError(
				"Hubo un problema al eliminar la sala. Por favor, intenta de nuevo.",
			);
			toast.error("Error al eliminar la sala. Inténtalo de nuevo.");
		} finally {
			setLoading(false);
		}
	};
	const handleViewRoom = (room: Room) => {
		setRoomToView(room);
		setIsViewModalOpen(true);
	};

	const openAddRoomModal = () => {
		setNewRoom({
			name: "",
			location: "",
			capacity: 0,
			description: "",
			isAvailable: true,
			openingHours: "08:00",
			closingHours: "20:00",
			features: [],
		});
		setSelectedRoom(null);
		setIsFormModalOpen(true);
	};
	const addFeature = () => {
		if (newFeature.trim()) {
			setNewRoom({
				...newRoom,
				features: [...(newRoom.features || []), newFeature.trim()],
			});
			setNewFeature("");
		}
	};

	const removeFeature = (index: number) => {
		const updatedFeatures = [...(newRoom.features || [])];
		updatedFeatures.splice(index, 1);
		setNewRoom({
			...newRoom,
			features: updatedFeatures,
		});
	};
	return (
		<div className="container mx-auto px-4 py-6">
			<Toaster
				position="top-right"
				reverseOrder={false}
				gutter={8}
				toastOptions={{
					duration: 3000,
					success: {
						style: {
							background: "#10B981",
							color: "white",
							padding: "16px",
							borderRadius: "8px",
						},
						iconTheme: {
							primary: "white",
							secondary: "#10B981",
						},
					},
					error: {
						style: {
							background: "#EF4444",
							color: "white",
							padding: "16px",
							borderRadius: "8px",
						},
						iconTheme: {
							primary: "white",
							secondary: "#EF4444",
						},
					},
				}}
			/>

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
					<h1 className="text-2xl font-bold text-gray-800">Gestión de Salas</h1>
				</div>
				<div className="flex space-x-4">
					<div className="relative">
						{" "}
						<input
							type="text"
							placeholder="Buscar salas..."
							className="border rounded-lg px-4 py-2 w-64"
							value={searchQuery}
							onChange={(e) => handleSearch(e.target.value)}
							aria-label="Buscar salas"
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
					<button
						onClick={openAddRoomModal}
						className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
					>
						Añadir Sala
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

			<div className="bg-white rounded-lg shadow overflow-hidden">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								ID
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Nombre
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Ubicación
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Capacidad
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Estado
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Horario
							</th>
							<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
								Acciones
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{filteredRooms.map((room) => (
							<tr key={room.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{room.id}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{room.name}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{room.location}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{room.capacity} personas
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span
										className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
											room.isAvailable
												? "bg-green-100 text-green-800"
												: "bg-red-100 text-red-800"
										}`}
									>
										{room.isAvailable ? "Disponible" : "No Disponible"}
									</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{room.openingHours} - {room.closingHours}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
									<div className="flex justify-center space-x-3">
										<button
											onClick={() => handleViewRoom(room)}
											className="text-blue-600 hover:text-blue-900"
											title="Ver detalles"
										>
											<EyeIcon className="h-5 w-5" />
										</button>
										<button
											onClick={() => handleEditRoom(room.id)}
											className="text-indigo-600 hover:text-indigo-900"
											title="Editar sala"
										>
											<PencilIcon className="h-5 w-5" />
										</button>
										<button
											onClick={() => openDeleteModal(room.id)}
											className="text-red-600 hover:text-red-900"
											title="Eliminar sala"
										>
											<TrashIcon className="h-5 w-5" />
										</button>
									</div>
								</td>
							</tr>
						))}
						{filteredRooms.length === 0 && (
							<tr>
								<td
									colSpan={7}
									className="px-6 py-4 text-center text-sm text-gray-500"
								>
									No se encontraron salas con los criterios de búsqueda.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<Transition appear show={isFormModalOpen} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-10"
					onClose={() => setIsFormModalOpen(false)}
				>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
									<Dialog.Title
										as="h3"
										className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
									>
										{selectedRoom ? "Editar Sala" : "Añadir Nueva Sala"}
										<button
											onClick={() => setIsFormModalOpen(false)}
											className="rounded-full p-1 hover:bg-gray-200"
										>
											<XMarkIcon className="h-5 w-5" />
										</button>
									</Dialog.Title>

									<div className="mt-4">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Nombre de la Sala
												</label>
												<input
													type="text"
													className="w-full px-3 py-2 border border-gray-300 rounded-md"
													value={newRoom.name}
													onChange={(e) =>
														setNewRoom({ ...newRoom, name: e.target.value })
													}
													required
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Ubicación
												</label>
												<input
													type="text"
													className="w-full px-3 py-2 border border-gray-300 rounded-md"
													value={newRoom.location}
													onChange={(e) =>
														setNewRoom({ ...newRoom, location: e.target.value })
													}
													required
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Capacidad
												</label>
												<input
													type="number"
													className="w-full px-3 py-2 border border-gray-300 rounded-md"
													value={newRoom.capacity}
													onChange={(e) =>
														setNewRoom({
															...newRoom,
															capacity: Number.parseInt(e.target.value) || 0,
														})
													}
													min="1"
													required
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Estado
												</label>
												<select
													className="w-full px-3 py-2 border border-gray-300 rounded-md"
													value={newRoom.isAvailable ? "true" : "false"}
													onChange={(e) =>
														setNewRoom({
															...newRoom,
															isAvailable: e.target.value === "true",
														})
													}
												>
													<option value="true">Disponible</option>
													<option value="false">No Disponible</option>
												</select>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Hora de Apertura
												</label>
												<input
													type="time"
													className="w-full px-3 py-2 border border-gray-300 rounded-md"
													value={newRoom.openingHours}
													onChange={(e) =>
														setNewRoom({
															...newRoom,
															openingHours: e.target.value,
														})
													}
													required
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Hora de Cierre
												</label>
												<input
													type="time"
													className="w-full px-3 py-2 border border-gray-300 rounded-md"
													value={newRoom.closingHours}
													onChange={(e) =>
														setNewRoom({
															...newRoom,
															closingHours: e.target.value,
														})
													}
													required
												/>
											</div>
										</div>

										<div className="mb-4">
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Descripción
											</label>
											<textarea
												className="w-full px-3 py-2 border border-gray-300 rounded-md"
												value={newRoom.description}
												onChange={(e) =>
													setNewRoom({
														...newRoom,
														description: e.target.value,
													})
												}
												rows={3}
											/>
										</div>

										<div className="mb-4">
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Características
											</label>
											<div className="flex items-center space-x-2 mb-2">
												<input
													type="text"
													className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
													value={newFeature}
													onChange={(e) => setNewFeature(e.target.value)}
													placeholder="Añadir característica"
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															e.preventDefault();
															addFeature();
														}
													}}
												/>
												<button
													type="button"
													onClick={addFeature}
													className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
												>
													Añadir
												</button>
											</div>
											<div className="flex flex-wrap gap-2 mt-2">
												{newRoom.features?.map((feature, index) => (
													<div
														key={index}
														className="bg-gray-100 px-3 py-1 rounded-full flex items-center"
													>
														<span>{feature}</span>
														<button
															onClick={() => removeFeature(index)}
															className="ml-2 text-red-500 hover:text-red-700"
														>
															&times;
														</button>
													</div>
												))}
											</div>
										</div>

										<div className="flex justify-end space-x-3 mt-6">
											{" "}
											<button
												onClick={() => {
													setIsFormModalOpen(false);
													setSelectedRoom(null);
													setNewRoom({
														name: "",
														location: "",
														capacity: 0,
														description: "",
														isAvailable: true,
														openingHours: "08:00",
														closingHours: "20:00",
														features: [],
													});
													toast("Operación cancelada", {
														icon: "❌",
														style: {
															background: "#6B7280",
															color: "white",
														},
														duration: 1500,
													});
												}}
												className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
											>
												Cancelar
											</button>
											<button
												onClick={selectedRoom ? handleSaveEdit : handleAddRoom}
												className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
											>
												{selectedRoom ? "Guardar Cambios" : "Añadir Sala"}
											</button>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>

			<Transition appear show={isDeleteModalOpen} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-10"
					onClose={() => setIsDeleteModalOpen(false)}
				>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
									<Dialog.Title
										as="h3"
										className="text-lg font-medium leading-6 text-gray-900"
									>
										Confirmar eliminación
									</Dialog.Title>
									<div className="mt-2">
										<p className="text-sm text-gray-500">
											¿Estás seguro de que deseas eliminar esta sala? Esta
											acción no se puede deshacer.
										</p>
									</div>

									<div className="mt-4 flex justify-end space-x-3">
										{" "}
										<button
											type="button"
											className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
											onClick={() => {
												setIsDeleteModalOpen(false);
												toast("Eliminación cancelada", {
													icon: "✋",
													style: {
														background: "#6B7280",
														color: "white",
													},
													duration: 1500,
												});
											}}
										>
											Cancelar
										</button>
										<button
											type="button"
											className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
											onClick={handleDeleteRoom}
										>
											Eliminar
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>

			<Transition appear show={isViewModalOpen} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-10"
					onClose={() => setIsViewModalOpen(false)}
				>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
									{roomToView && (
										<>
											<Dialog.Title
												as="h3"
												className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
											>
												{roomToView.name}
												<button
													onClick={() => setIsViewModalOpen(false)}
													className="rounded-full p-1 hover:bg-gray-200"
												>
													<XMarkIcon className="h-5 w-5" />
												</button>
											</Dialog.Title>
											<div className="mt-4 space-y-3">
												<div>
													<h4 className="text-sm font-medium text-gray-500">
														ID
													</h4>
													<p>{roomToView.id}</p>
												</div>
												<div>
													<h4 className="text-sm font-medium text-gray-500">
														Ubicación
													</h4>
													<p>{roomToView.location}</p>
												</div>
												<div>
													<h4 className="text-sm font-medium text-gray-500">
														Capacidad
													</h4>
													<p>{roomToView.capacity} personas</p>
												</div>
												<div>
													<h4 className="text-sm font-medium text-gray-500">
														Estado
													</h4>
													<span
														className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
															roomToView.isAvailable
																? "bg-green-100 text-green-800"
																: "bg-red-100 text-red-800"
														}`}
													>
														{roomToView.isAvailable
															? "Disponible"
															: "No Disponible"}
													</span>
												</div>
												<div>
													<h4 className="text-sm font-medium text-gray-500">
														Horario
													</h4>
													<p>
														{roomToView.openingHours} -{" "}
														{roomToView.closingHours}
													</p>
												</div>
												<div>
													<h4 className="text-sm font-medium text-gray-500">
														Descripción
													</h4>
													<p>{roomToView.description || "Sin descripción"}</p>
												</div>
												{roomToView.features &&
													roomToView.features.length > 0 && (
														<div>
															<h4 className="text-sm font-medium text-gray-500">
																Características
															</h4>
															<div className="flex flex-wrap gap-2 mt-1">
																{roomToView.features.map((feature, index) => (
																	<span
																		key={index}
																		className="bg-gray-100 px-3 py-1 rounded-full text-sm"
																	>
																		{feature}
																	</span>
																))}
															</div>
														</div>
													)}
											</div>
											<div className="mt-6 flex justify-end">
												{" "}
												<button
													type="button"
													className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200"
													onClick={() => {
														setIsViewModalOpen(false);
													}}
												>
													Cerrar
												</button>
											</div>
										</>
									)}
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</div>
	);
};

export default RoomsPage;
