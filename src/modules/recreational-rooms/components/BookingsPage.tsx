import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
    CalendarIcon,
    ClockIcon,
    UserIcon,
    IdentificationIcon,
    MapPinIcon,
    ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";
import { bookingApi, type BookingResponse } from "../services/BookingService";
import { hallsApi } from "./rooms/services/RoomService";
import { itemsApi, type ItemEntity } from "../services/api";
import { HallEntity } from "./rooms/types";

interface BookingFormData {
  date: string;
  startTime: string;
  endTime: string;
  hallId: number;
  itemsLoans: {
    idItem: number;
    quantity: number;
  }[];
}

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [halls, setHalls] = useState<HallEntity[]>([]);
  const [items, setItems] = useState<ItemEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<BookingResponse | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    date: "",
    startTime: "",
    endTime: "",
    hallId: 0,
    itemsLoans: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsData, hallsData, itemsData] = await Promise.all([
        bookingApi.getAllBookings(),
        hallsApi.getAllHalls(),
        itemsApi.getAllItems(),
      ]);
      setBookings(bookingsData);
      setHalls(hallsData);
      setItems(itemsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error al cargar los datos. Por favor, intente nuevamente.");
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async () => {
    try {
      setLoading(true);
      const [startHour, startMinute] = formData.startTime
        .split(":")
        .map(Number);
      const [endHour, endMinute] = formData.endTime.split(":").map(Number);

      const bookingData = {
        date: formData.date,
        startTime: {
          hour: startHour,
          minute: startMinute,
          second: 0,
          nano: 0,
        },
        endTime: {
          hour: endHour,
          minute: endMinute,
          second: 0,
          nano: 0,
        },
        hallId: formData.hallId,
        itemsLoans: formData.itemsLoans,
      };

      await bookingApi.createBooking(bookingData);
      await fetchData();
      setIsFormModalOpen(false);
      setFormData({
        date: "",
        startTime: "",
        endTime: "",
        hallId: 0,
        itemsLoans: [],
      });
      toast.success("Reserva creada exitosamente");
    } catch (err) {
      console.error("Error creating booking:", err);
      setError("Error al crear la reserva. Por favor, intente nuevamente.");
      toast.error("Error al crear la reserva");
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBooking = async (bookingId: number) => {
    try {
      setLoading(true);
      await bookingApi.returnBooking(bookingId);
      await fetchData();
      toast.success("Elementos devueltos exitosamente");
    } catch (err) {
      console.error("Error returning booking:", err);
      setError(
        "Error al devolver los elementos. Por favor, intente nuevamente."
      );
      toast.error("Error al devolver los elementos");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    try {
      setLoading(true);
      await bookingApi.cancelBooking(bookingId);
      await fetchData();
      toast.success("Reserva cancelada exitosamente");
    } catch (err) {
      console.error("Error canceling booking:", err);
      setError("Error al cancelar la reserva. Por favor, intente nuevamente.");
      toast.error("Error al cancelar la reserva");
    } finally {
      setLoading(false);
    }
  };

  const handleViewBooking = (booking: BookingResponse) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };

  const InfoItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl shadow-inner">
      <div className="flex-shrink-0 text-green-600">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-sm text-gray-700">
        <h4 className="font-semibold text-gray-600">{label}</h4>
        <p className="mt-1">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Gestión de Reservas
        </h1>
        <button
          onClick={() => setIsFormModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Nueva Reserva
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
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
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sala
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.nameUser}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.idUser}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(booking.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.timeStartBooking} - {booking.timeEndBooking}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.hallId.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === "Reservado"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "Cancelado"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleViewBooking(booking)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Ver
                      </button>
                      {booking.status === "Reservado" && (
                        <>
                          <button
                            onClick={() => handleReturnBooking(booking.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Devolver
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      <Transition appear show={isFormModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsFormModalOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Título del Modal
                </Dialog.Title>
                <p className="mt-2 text-sm text-gray-500">
                  Aquí va el contenido del modal.
                </p>
              </Dialog.Panel>
            </Transition>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                        </Transition.Child>

                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>

                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    Nueva Reserva
                                </Dialog.Title>

                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Fecha
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) =>
                                                setFormData({ ...formData, date: e.target.value })
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                    </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Hora de Inicio
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          startTime: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Hora de Fin
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          endTime: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700">
                          Elementos
                      </label>
                      <div className="mt-2 space-y-2">
                          {items.map((item) => (
                              <div key={item.id} className="flex items-center">
                                  <input
                                      type="number"
                                      min="0"
                                      max={item.quantityAvailable}
                                      value={
                                          formData.itemsLoans.find(
                                              (loan) => loan.idItem === item.id,
                                          )?.quantity || 0
                                      }
                                      onChange={(e) => {
                                          const quantity = Number(e.target.value);
                                          const newItemsLoans = [
                                              ...formData.itemsLoans.filter(
                                                  (loan) => loan.idItem !== item.id,
                                              ),
                                          ];
                                          if (quantity > 0) {
                                              newItemsLoans.push({
                                                  idItem: item.id ?? 0,
                                                  quantity,
                                              });
                                          }
                                          setFormData({
                                              ...formData,
                                              itemsLoans: newItemsLoans,
                                          });
                                      }}
                                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                  />
                                  <span className="ml-2 text-sm text-gray-500">
                                      {item.name}
                                  </span>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Elementos
                    </label>
                    <div className="mt-2 space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center">
                          <input
                            type="number"
                            min="0"
                            max={item.quantityAvailable}
                            value={
                              formData.itemsLoans.find(
                                (loan) => loan.idItem === item.id
                              )?.quantity || 0
                            }
                            onChange={(e) => {
                              const quantity = Number(e.target.value);
                              const newItemsLoans = [
                                ...formData.itemsLoans.filter(
                                  (loan) => loan.idItem !== item.id
                                ),
                              ];
                              if (quantity > 0) {
                                newItemsLoans.push({
                                  idItem: item.id || 0,
                                  quantity,
                                });
                              }
                              setFormData({
                                ...formData,
                                itemsLoans: newItemsLoans,
                              });
                            }}
                            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          />
                          <span className="ml-2 text-sm text-gray-500">
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
            {/* View Modal */}
            <Transition appear show={isViewModalOpen} as={React.Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={() => setIsViewModalOpen(false)}
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                        </Transition.Child>

      {/* View Modal */}
      <Transition appear show={isViewModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsViewModalOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Título del Modal
                </Dialog.Title>
                <p className="mt-2 text-sm text-gray-500">
                  Aquí va el contenido del modal.
                </p>
              </Dialog.Panel>
            </Transition>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                {selectedBooking && (
                  <>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Detalles de la Reserva
                    </Dialog.Title>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoItem
                        icon={UserIcon}
                        label="Usuario"
                        value={selectedBooking.nameUser}
                      />
                      <InfoItem
                        icon={IdentificationIcon}
                        label="ID Usuario"
                        value={selectedBooking.idUser}
                      />
                      <InfoItem
                        icon={CalendarIcon}
                        label="Fecha"
                        value={new Date(
                          selectedBooking.date
                        ).toLocaleDateString()}
                      />
                      <InfoItem
                        icon={ClockIcon}
                        label="Horario"
                        value={`${selectedBooking.timeStartBooking} - ${selectedBooking.timeEndBooking}`}
                      />
                      <InfoItem
                        icon={MapPinIcon}
                        label="Sala"
                        value={selectedBooking.hallId.name}
                      />
                      <InfoItem
                        icon={ClipboardDocumentIcon}
                        label="Estado"
                        value={
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              selectedBooking.status === "Reservado"
                                ? "bg-green-100 text-green-800"
                                : selectedBooking.status === "Cancelado"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {selectedBooking.status}
                          </span>
                        }
                      />
                    </div>

                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900">
                        Elementos Prestados
                      </h4>
                      <div className="mt-2 space-y-2">
                        {selectedBooking.itemsLoans.map((loan) => (
                          <div
                            key={loan.id}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {loan.itemId.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Cantidad: {loan.quantity}
                              </p>
                            </div>
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                loan.returnStatus === "Activo"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {loan.returnStatus}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
                        onClick={() => setIsViewModalOpen(false)}
                      >
                        Cerrar
                      </button>
                    </div>
                  </>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default BookingsPage;
