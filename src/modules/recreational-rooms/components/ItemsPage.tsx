import type React from "react";
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import {
	EyeIcon,
	PencilIcon,
	TrashIcon,
	XMarkIcon,
	MapPinIcon,
	ClipboardDocumentIcon,
	SparklesIcon,
	WrenchScrewdriverIcon,
	CalendarIcon,
} from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";
import {
  type HallEntity,
  type ItemEntity,
  type ItemEntityRequest,
  itemsApi,
} from "../services/api";
import { hallsApi } from "@modules/recreational-rooms/components/rooms/services/RoomService.ts";

interface RecreationalItem {
  id: string;
  name: string;
  category: string;
  totalQuantity: number;
  availableQuantity: number;
  condition: "Nuevo" | "Buen estado" | "Regular" | "Requiere mantenimiento";
  location: string;
  description?: string;
  lastMaintenance?: string;
  image?: string;
  hallId?: number;
  lastReservation?: {
    userName: string;
    userIdentification: string;
    userRole: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
  };
}

const ItemsPage: React.FC = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState<RecreationalItem[]>([]);
  const [halls, setHalls] = useState<HallEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [itemToView, setItemToView] = useState<RecreationalItem | null>(null);

  const [newItem, setNewItem] = useState<Partial<RecreationalItem>>({
    name: "",
    category: "",
    totalQuantity: 1,
    availableQuantity: 1,
    condition: "Nuevo",
    location: "",
    description: "",
  });
	const [searchQuery, setSearchQuery] = useState("");
	const [filterCategory] = useState("");
	const [filterStatus, setFilterStatus] = useState<string>("");
	const [sortField, setSortField] = useState<string>("name");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const hallsResponse = await hallsApi.getAllHalls();
        setHalls(hallsResponse);

        const itemsResponse = await itemsApi.getAllItems();

        const transformedItems: RecreationalItem[] = itemsResponse.map(
          (item: ItemEntity) => ({
            id: item.id?.toString() || "",
            name: item.name,
            category: item.category,
            totalQuantity: item.quantity,
            availableQuantity: item.quantityAvailable || 0,
            condition: mapConditionFromStatus(item.status),
            location:
              typeof item.hall === "object" ? item.hall.name : "Desconocido",
            description: item.description,
            hallId:
              typeof item.hall === "object"
                ? item.hall.id
                : typeof item.hall === "number"
                ? item.hall
                : undefined,
          })
        );

        setItems(transformedItems);
        setError(null);
      } catch (err) {
        console.error("Error al cargar los datos:", err);
        setError(
          "Hubo un problema al cargar los datos. Por favor, intenta de nuevo más tarde."
        );
        toast.error("Error al cargar los elementos", {
          icon: "❌",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const mapConditionFromStatus = (
    status: string
  ): "Nuevo" | "Buen estado" | "Regular" | "Requiere mantenimiento" => {
    switch (status) {
      case "N":
        return "Nuevo";
      case "B":
        return "Buen estado";
      case "R":
        return "Regular";
      case "M":
        return "Requiere mantenimiento";
      default:
        return "Buen estado";
    }
  };

  const mapConditionToStatus = (condition: string): string => {
    switch (condition) {
      case "Nuevo":
        return "N";
      case "Buen estado":
        return "B";
      case "Regular":
        return "R";
      case "Requiere mantenimiento":
        return "M";
      default:
        return "B";
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filteredResults = items.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase()) ||
        item.location.toLowerCase().includes(query.toLowerCase())
    );

    if (query && filteredResults.length > 0) {
      toast.success(`${filteredResults.length} elementos encontrados`, {
        icon: "��",
        duration: 1500,
        style: {
          background: "#3B82F6",
          color: "white",
        },
      });
    } else if (query && filteredResults.length === 0) {
      toast.error("No se encontraron elementos con esos criterios", {
        icon: "🔍",
        duration: 1500,
      });
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory
      ? item.category === filterCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedAndFilteredItems = filteredItems
    .filter((item) => {
      if (!filterStatus) return true;
      return item.condition === filterStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof RecreationalItem];
      const bValue = b[sortField as keyof RecreationalItem];
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });

  const handleAddItem = async () => {
    if (
      newItem.name &&
      newItem.category &&
      newItem.location &&
      newItem.hallId
    ) {
      try {
        setLoading(true);

        const itemToAdd: ItemEntityRequest = {
          name: newItem.name,
          description: newItem.description || "",
          status: mapConditionToStatus(newItem.condition || "Buen estado"),
          category: newItem.category,
          quantity: newItem.totalQuantity || 1,
          available: true,
          hall: newItem.hallId,
        };

        const response = await itemsApi.addItem(itemToAdd);

        const hall = halls.find((h) => h.id === newItem.hallId);

        const newItemWithId: RecreationalItem = {
          ...(newItem as RecreationalItem),
          id: response.id?.toString() || Math.random().toString(),
          location: hall?.name || newItem.location,
          availableQuantity: newItem.totalQuantity || 1,
        };

        setItems([...items, newItemWithId]);
        setIsFormModalOpen(false);
        setNewItem({
          name: "",
          category: "",
          totalQuantity: 1,
          availableQuantity: 1,
          condition: "Nuevo",
          location: "",
          description: "",
        });
        setError(null);
        toast.success("Elemento añadido con éxito");
      } catch (err) {
        console.error("Error al añadir el elemento:", err);
        setError(
          "Hubo un problema al añadir el elemento. Por favor, intenta de nuevo."
        );
        toast.error("Error al añadir el elemento");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Por favor, completa todos los campos obligatorios.");
      toast.error("Por favor, completa todos los campos obligatorios");
    }
  };

  const handleEditItem = (itemId: string) => {
    const itemToEdit = items.find((item) => item.id === itemId);
    if (itemToEdit) {
      setNewItem(itemToEdit);
      setSelectedItem(itemId);
      setIsFormModalOpen(true);
    }
  };

  const handleSaveEdit = async () => {
    if (
      selectedItem &&
      newItem.name &&
      newItem.category &&
      newItem.location &&
      newItem.hallId
    ) {
      try {
        setLoading(true);

        const itemToUpdate: ItemEntity = {
          id: Number.parseInt(selectedItem),
          name: newItem.name,
          description: newItem.description || "",
          status: mapConditionToStatus(newItem.condition || "Buen estado"),
          category: newItem.category,
          quantity: newItem.totalQuantity || 1,
          quantityAvailable: newItem.availableQuantity,
          available: (newItem.availableQuantity || 0) > 0,
          hall: newItem.hallId,
        };

        await itemsApi.updateItem(Number.parseInt(selectedItem), itemToUpdate);

        const hall = halls.find((h) => h.id === newItem.hallId);

        setItems(
          items.map((item) =>
            item.id === selectedItem
              ? {
                  ...item,
                  name: newItem.name || item.name,
                  category: newItem.category || item.category,
                  totalQuantity: newItem.totalQuantity || item.totalQuantity,
                  availableQuantity:
                    newItem.availableQuantity !== undefined
                      ? newItem.availableQuantity
                      : item.availableQuantity,
                  condition: newItem.condition || item.condition,
                  location: hall?.name || newItem.location || item.location,
                  description: newItem.description || item.description,
                  hallId: newItem.hallId,
                }
              : item
          )
        );

        setIsFormModalOpen(false);
        setSelectedItem(null);
        setNewItem({
          name: "",
          category: "",
          totalQuantity: 1,
          availableQuantity: 1,
          condition: "Nuevo",
          location: "",
          description: "",
        });
        setError(null);
        toast.success("Elemento actualizado con éxito");
      } catch (err) {
        console.error("Error al actualizar el elemento:", err);
        setError(
          "Hubo un problema al actualizar el elemento. Por favor, intenta de nuevo."
        );
        toast.error("Error al actualizar el elemento");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Por favor, completa todos los campos obligatorios.");
      toast.error("Por favor, completa todos los campos obligatorios");
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      setLoading(true);
      await itemsApi.deleteItem(Number.parseInt(itemId));
      setItems(items.filter((item) => item.id !== itemId));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      toast.success("Elemento eliminado con éxito");
    } catch (err) {
      console.error("Error al eliminar el elemento:", err);
      setError(
        "Hubo un problema al eliminar el elemento. Por favor, intenta de nuevo."
      );
      toast.error("Error al eliminar el elemento");
    } finally {
      setLoading(false);
    }
  };

  const handleViewItem = (item: RecreationalItem) => {
    setItemToView(item);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (itemId: string) => {
    setItemToDelete(itemId);
    setIsDeleteModalOpen(true);
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
            type="button"
            onClick={() => navigate("/modules/recreation")}
            className="mr-4 text-green-700 hover:text-green-900 flex items-center"
            aria-label="Volver a opciones de salas recreativas"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              role="img"
              aria-label="Icono de volver"
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
            Gestión de Elementos
          </h1>
        </div>
        <div className="flex space-x-4">
          <div className="flex space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar elementos..."
                className="border rounded-lg px-4 py-2 w-64"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                aria-label="Buscar elementos"
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
              aria-label="Filtrar por estado"
            >
              <option value="">Todos los estados</option>
              <option value="Nuevo">Nuevo</option>
              <option value="Buen estado">Buen estado</option>
              <option value="Regular">Regular</option>
              <option value="Requiere mantenimiento">
                Requiere mantenimiento
              </option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => setIsFormModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
            aria-label="Añadir nuevo elemento"
          >
            <SparklesIcon className="h-5 w-5" />
            Añadir Elemento
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
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center gap-2">
                  ID
                  {sortField === "id" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-2">
                  Nombre
                  {sortField === "name" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center gap-2">
                  Categoría
                  {sortField === "category" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("availableQuantity")}
              >
                <div className="flex items-center gap-2">
                  Disponibilidad
                  {sortField === "availableQuantity" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("condition")}
              >
                <div className="flex items-center gap-2">
                  Estado
                  {sortField === "condition" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("location")}
              >
                <div className="flex items-center gap-2">
                  Ubicación
                  {sortField === "location" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedAndFilteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span>{item.name}</span>
                    {item.lastReservation && (
                      <span
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        title={`Última reserva: ${item.lastReservation.userName}`}
                      >
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        Reservado
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item.availableQuantity > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.availableQuantity}/{item.totalQuantity}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.condition === "Nuevo"
                        ? "bg-green-100 text-green-800"
                        : item.condition === "Buen estado"
                        ? "bg-blue-100 text-blue-800"
                        : item.condition === "Regular"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.condition}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-gray-400" />
                    {item.location}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex justify-center space-x-3">
                    <button
                      type="button"
                      onClick={() => handleViewItem(item)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      aria-label={`Ver detalles del elemento ${item.name}`}
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditItem(item.id)}
                      className="text-yellow-600 hover:text-yellow-800 transition-colors"
                      aria-label={`Editar elemento ${item.name}`}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteModal(item.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      aria-label={`Eliminar elemento ${item.name}`}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {sortedAndFilteredItems.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No se encontraron elementos con los criterios de búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
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
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all border border-gray-200">
                  <div className="flex items-center justify-between bg-green-700 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center gap-2">
                      <SparklesIcon className="h-6 w-6 text-white" />
                      <h3 className="text-white text-xl font-bold tracking-wide">
                        {selectedItem
                          ? "Editar Elemento"
                          : "Añadir Nuevo Elemento"}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsFormModalOpen(false)}
                      className="rounded-full p-1 hover:bg-green-800 transition"
                      aria-label="Cerrar formulario"
                    >
                      <XMarkIcon className="h-5 w-5 text-white" />
                    </button>
                  </div>

                  <div className="px-6 py-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600">
                      {selectedItem
                        ? "Modifica los detalles del elemento según sea necesario"
                        : "Complete el formulario para añadir un nuevo elemento al sistema"}
                    </p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="itemName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Nombre
                        </label>
                        <input
                          type="text"
                          id="itemName"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          value={newItem.name}
                          onChange={(e) =>
                            setNewItem({ ...newItem, name: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="itemCategory"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Categoría
                        </label>
                        <select
                          id="itemCategory"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          value={newItem.category}
                          onChange={(e) =>
                            setNewItem({ ...newItem, category: e.target.value })
                          }
                          required
                        >
                          <option value="">Seleccione una categoría</option>
                          <option value="Juegos">Juegos</option>
                          <option value="Mesa">Mesa</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="itemLocation"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Ubicación
                        </label>
                        <select
                          id="itemLocation"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          value={newItem.hallId?.toString() || ""}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              hallId: Number.parseInt(e.target.value),
                              location:
                                halls.find(
                                  (h) =>
                                    h.id === Number.parseInt(e.target.value)
                                )?.name || "",
                            })
                          }
                          required
                        >
                          <option value="">Seleccione una ubicación</option>
                          {halls.map((hall) => (
                            <option key={hall.id} value={hall.id}>
                              {hall.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="itemCondition"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Estado
                        </label>
                        <select
                          id="itemCondition"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          value={newItem.condition}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              condition: e.target
                                .value as RecreationalItem["condition"],
                            })
                          }
                          required
                        >
                          <option value="Nuevo">Nuevo</option>
                          <option value="Buen estado">Buen estado</option>
                          <option value="Regular">Regular</option>
                          <option value="Requiere mantenimiento">
                            Requiere mantenimiento
                          </option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="itemTotalQuantity"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Cantidad Total
                        </label>
                        <input
                          type="number"
                          id="itemTotalQuantity"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          value={newItem.totalQuantity}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              totalQuantity:
                                Number.parseInt(e.target.value) || 0,
                              availableQuantity:
                                Number.parseInt(e.target.value) || 0,
                            })
                          }
                          min="1"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="itemDescription"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Descripción
                        </label>
                        <textarea
                          id="itemDescription"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          value={newItem.description}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              description: e.target.value,
                            })
                          }
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsFormModalOpen(false);
                        setSelectedItem(null);
                        setNewItem({
                          name: "",
                          category: "",
                          totalQuantity: 1,
                          availableQuantity: 1,
                          condition: "Nuevo",
                          location: "",
                          description: "",
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
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={selectedItem ? handleSaveEdit : handleAddItem}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                    >
                      {selectedItem ? "Guardar Cambios" : "Añadir Elemento"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Modal */}
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
                    Confirmar Eliminación
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      ¿Estás seguro de que deseas eliminar este elemento? Esta
                      acción no se puede deshacer.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() =>
                        itemToDelete && handleDeleteItem(itemToDelete)
                      }
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

      {/* View Modal */}
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
            <div className="fixed inset-0 bg-black bg-opacity-30" />
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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all border-gray-200">
                  {itemToView && (
                    <>
                      <div className="flex items-center justify-between bg-green-700 px-6 py-4 rounded-t-2xl">
                        <h3 className="text-white text-xl font-bold tracking-wide">
                          {itemToView.name}
                        </h3>
                        <button
                          onClick={() => setIsViewModalOpen(false)}
                          className="rounded-full p-1 hover:bg-green-800 transition"
                        >
                          <XMarkIcon className="h-5 w-5 text-white" />
                        </button>
                      </div>

                      <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <SparklesIcon className="h-5 w-5 text-green-600" />
                          <h4 className="text-lg font-semibold text-gray-800">
                            Detalles del Elemento
                          </h4>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          Información completa sobre el elemento y sus
                          características
                        </p>
                      </div>

                      <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <InfoItem
                            icon={ClipboardDocumentIcon}
                            label="ID"
                            value={itemToView.id}
                          />
                          <InfoItem
                            icon={MapPinIcon}
                            label="Ubicación"
                            value={itemToView.location}
                          />
                          <InfoItem
                            icon={SparklesIcon}
                            label="Categoría"
                            value={itemToView.category}
                          />
                          <InfoItem
                            icon={WrenchScrewdriverIcon}
                            label="Estado"
                            value={
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                  itemToView.condition === "Nuevo"
                                    ? "bg-green-100 text-green-800"
                                    : itemToView.condition === "Buen estado"
                                    ? "bg-blue-100 text-blue-800"
                                    : itemToView.condition === "Regular"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {itemToView.condition}
                              </span>
                            }
                          />
                          <InfoItem
                            icon={ClipboardDocumentIcon}
                            label="Cantidad"
                            value={`${itemToView.availableQuantity}/${itemToView.totalQuantity}`}
                          />
                        </div>

                        <div className="mt-8 space-y-6">
                          <div className="bg-gray-50 rounded-xl p-4">
                            <h4 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                              <ClipboardDocumentIcon className="h-4 w-4" />
                              Descripción
                            </h4>
                            <p className="text-gray-700 leading-relaxed">
                              {itemToView.description || "Sin descripción"}
                            </p>
                          </div>
                        </div>
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

export default ItemsPage;
