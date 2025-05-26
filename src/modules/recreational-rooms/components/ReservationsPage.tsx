import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPlus,
  faFilter,
  faCalendarAlt,
  faClock,
  faUser,
  faBuilding,
  faBoxes,
  faEye,
  faEdit,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import {
  Card,
  CardBody,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Select,
  SelectItem,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Badge,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tooltip,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { hallsApi } from "./rooms/services/RoomService";
import { bookingsApi, HallEntity, ItemEntity, itemsApi } from "../services/api";
import { useNavigate } from "react-router-dom";

// Interfaces actualizadas según tu API
interface Reservation {
  id: number;
  nameUser: string;
  idUser: string;
  date: string;
  timeStartBooking: string;
  timeEndBooking: string;
  hallId: {
    id: number;
    name: string;
    location: string;
    status: string;
    description: string;
    capacity: number;
  };
  status: "Reservado" | "Cancelado" | "Completado" | "Pendiente";
  itemsLoans: ItemLoan[];
}

interface ItemLoan {
  id: number;
  itemId: {
    id: number;
    name: string;
    description: string;
    status: string;
    category: string;
    quantity: number;
    quantityAvailable: number;
    available: boolean;
    hall: any;
  };
  quantity: number;
  loanDate: string;
  returnDate: string;
  returnStatus: "Activo" | "Devuelto" | "Pendiente";
}

const ReservationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [rooms, setRooms] = useState<HallEntity[]>([]);
  const [items, setItems] = useState<ItemEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [newReservation, setNewReservation] = useState({
    nameUser: "",
    idUser: "",
    date: "",
    timeStartBooking: "",
    timeEndBooking: "",
    hallId: "",
    selectedItems: [] as { id: number; quantity: number }[],
  });

  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();
  const {
    isOpen: isDetailModalOpen,
    onOpen: onDetailModalOpen,
    onClose: onDetailModalClose,
  } = useDisclosure();
  const {
    isOpen: isItemsModalOpen,
    onOpen: onItemsModalOpen,
    onClose: onItemsModalClose,
  } = useDisclosure();
  const {
    isOpen: isReturnModalOpen,
    onOpen: onReturnModalOpen,
    onClose: onReturnModalClose,
  } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const mockReservations: Reservation[] =
          await bookingsApi.getAllBookings();

        const mockRooms: HallEntity[] = await hallsApi.getAllHalls();

        const mockItems: ItemEntity[] = await itemsApi.getAllItems();

        setReservations(mockReservations);
        setRooms(mockRooms);
        setItems(mockItems);
      } catch (error) {
        toast.error("Error al cargar los datos");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.nameUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.idUser.includes(searchQuery) ||
      reservation.hallId.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus
      ? reservation.status === filterStatus
      : true;
    const matchesDate = filterDate ? reservation.date === filterDate : true;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleCreateReservation = async () => {
    if (
      !newReservation.nameUser ||
      !newReservation.idUser ||
      !newReservation.hallId ||
      !newReservation.date
    ) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }
    try {
      setLoading(true);
      toast.success("Reserva creada exitosamente");
      onAddModalClose();
      resetForm();
    } catch (error) {
      toast.error("Error al crear la reserva");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewReservation({
      nameUser: "",
      idUser: "",
      date: "",
      timeStartBooking: "",
      timeEndBooking: "",
      hallId: "",
      selectedItems: [],
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Reservado":
        return "primary";
      case "Completado":
        return "success";
      case "Cancelado":
        return "danger";
      case "Pendiente":
        return "warning";
      default:
        return "default";
    }
  };

  const getReturnStatusColor = (status: string) => {
    switch (status) {
      case "Devuelto":
        return "success";
      case "Activo":
        return "warning";
      case "Pendiente":
        return "default";
      default:
        return "default";
    }
  };

  const formatTime = (time: string) => {
    return time.split(":").slice(0, 2).join(":");
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center">
            <Button
              variant="light"
              startContent={<FontAwesomeIcon icon={faArrowLeft} />}
              className="mr-4"
              onClick={() => navigate("/modules/recreation")}
            >
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
                Gestión de Reservas
              </h1>
              <p className="text-gray-600 mt-1">
                Administra las reservas de salas y elementos
              </p>
            </div>
          </div>
          <Button
            color="primary"
            size="lg"
            startContent={<FontAwesomeIcon icon={faPlus} />}
            onPress={onAddModalOpen}
            className="bg-gradient-to-r from-green-500 to-green-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Nueva Reserva
          </Button>
        </motion.div>

        {/* Filtros y búsqueda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6 shadow-lg border-0">
            <CardBody>
              <div className="flex flex-wrap gap-4 items-end">
                <Input
                  placeholder="Buscar por usuario, ID o sala..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  startContent={
                    <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                  }
                  className="flex-1 min-w-64"
                  variant="bordered"
                />
                <Select
                  placeholder="Filtrar por estado"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-48"
                  variant="bordered"
                  startContent={
                    <FontAwesomeIcon
                      icon={faFilter}
                      className="text-gray-400"
                    />
                  }
                >
                  <SelectItem key="" value="">
                    Todos
                  </SelectItem>
                  <SelectItem key="Reservado" value="Reservado">
                    Reservado
                  </SelectItem>
                  <SelectItem key="Completado" value="Completado">
                    Completado
                  </SelectItem>
                  <SelectItem key="Cancelado" value="Cancelado">
                    Cancelado
                  </SelectItem>
                  <SelectItem key="Pendiente" value="Pendiente">
                    Pendiente
                  </SelectItem>
                </Select>
                <Input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-48"
                  variant="bordered"
                  startContent={
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="text-gray-400"
                    />
                  }
                />
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Tabla de reservas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-xl border-0">
            <CardBody className="p-0">
              <Table
                aria-label="Tabla de reservas"
                classNames={{
                  wrapper: "min-h-[400px]",
                }}
              >
                <TableHeader>
                  <TableColumn>RESERVA</TableColumn>
                  <TableColumn>USUARIO</TableColumn>
                  <TableColumn>SALA</TableColumn>
                  <TableColumn>FECHA Y HORA</TableColumn>
                  <TableColumn>ELEMENTOS</TableColumn>
                  <TableColumn>ESTADO</TableColumn>
                  <TableColumn>ACCIONES</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No hay reservas disponibles">
                  {filteredReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-green-600">
                            #{reservation.id}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-800 rounded-full flex items-center justify-center text-white font-bold">
                            {reservation.nameUser.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold">
                              {reservation.nameUser}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold flex items-center">
                            <FontAwesomeIcon
                              icon={faBuilding}
                              className="mr-2 text-gray-400"
                              size="sm"
                            />
                            {reservation.hallId.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {reservation.hallId.location}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          <span className="flex items-center text-sm">
                            <FontAwesomeIcon
                              icon={faCalendarAlt}
                              className="mr-2 text-gray-400"
                              size="sm"
                            />
                            {formatDate(reservation.date)}
                          </span>
                          <span className="flex items-center text-xs text-gray-500">
                            <FontAwesomeIcon
                              icon={faClock}
                              className="mr-2"
                              size="sm"
                            />
                            {formatTime(reservation.timeStartBooking)} -{" "}
                            {formatTime(reservation.timeEndBooking)}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center">
                          <FontAwesomeIcon
                            icon={faBoxes}
                            className="mr-2 text-gray-400"
                            size="sm"
                          />
                          <Badge color="primary" variant="flat">
                            {reservation.itemsLoans.length} elementos
                          </Badge>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Chip
                          color={getStatusColor(reservation.status) as any}
                          variant="flat"
                          size="sm"
                        >
                          {reservation.status}
                        </Chip>
                      </TableCell>

                      <TableCell>
                        <div className="flex space-x-2">
                          <Tooltip content="Ver detalles">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              color="primary"
                              onPress={() => {
                                setSelectedReservation(reservation);
                                onDetailModalOpen();
                              }}
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </Button>
                          </Tooltip>

                          {reservation.itemsLoans.length > 0 && (
                            <Tooltip content="Gestionar devolución">
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                color="warning"
                                onPress={() => {
                                  setSelectedReservation(reservation);
                                  onReturnModalOpen();
                                }}
                              >
                                <FontAwesomeIcon icon={faUndo} />
                              </Button>
                            </Tooltip>
                          )}

                          <Dropdown>
                            <DropdownTrigger>
                              <Button isIconOnly size="sm" variant="light">
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                              <DropdownItem key="confirm">
                                Confirmar
                              </DropdownItem>
                              <DropdownItem
                                key="cancel"
                                className="text-danger"
                              >
                                Cancelar
                              </DropdownItem>
                              <DropdownItem key="complete">
                                Completar
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </motion.div>

        {/* Modal de nueva reserva */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={onAddModalClose}
          size="2xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-xl font-bold">Nueva Reserva</h3>
              <p className="text-sm text-gray-500">
                Completa la información para crear una nueva reserva
              </p>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                

                <Select
                  label="Sala"
                  placeholder="Selecciona una sala"
                  onChange={(e) =>
                    setNewReservation({
                      ...newReservation,
                      hallId: e.target.value,
                    })
                  }
                  variant="bordered"
                  startContent={
                    <FontAwesomeIcon
                      icon={faBuilding}
                      className="text-gray-400"
                    />
                  }
                >
                  {rooms.map((hall) => (
                    <SelectItem key={hall.id} value={hall.id}>
                      {hall.name}
                    </SelectItem>
                  ))}
                </Select>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    type="date"
                    label="Fecha"
                    value={newReservation.date}
                    onChange={(e) =>
                      setNewReservation({
                        ...newReservation,
                        date: e.target.value,
                      })
                    }
                    variant="bordered"
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <Input
                    type="time"
                    label="Hora de inicio"
                    value={newReservation.timeStartBooking}
                    onChange={(e) =>
                      setNewReservation({
                        ...newReservation,
                        timeStartBooking: e.target.value,
                      })
                    }
                    variant="bordered"
                  />
                  <Input
                    type="time"
                    label="Hora de fin"
                    value={newReservation.timeEndBooking}
                    onChange={(e) =>
                      setNewReservation({
                        ...newReservation,
                        timeEndBooking: e.target.value,
                      })
                    }
                    variant="bordered"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">
                      Elementos a reservar
                    </label>
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      onPress={onItemsModalOpen}
                      startContent={<FontAwesomeIcon icon={faPlus} />}
                    >
                      Seleccionar elementos
                    </Button>
                  </div>
                  {newReservation.selectedItems.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newReservation.selectedItems.map((item) => (
                        <Chip
                          key={item.id}
                          onClose={() => {
                            setNewReservation({
                              ...newReservation,
                              selectedItems:
                                newReservation.selectedItems.filter(
                                  (i) => i.id !== item.id
                                ),
                            });
                          }}
                          variant="flat"
                          color="primary"
                        >
                          Item {item.id} (x{item.quantity})
                        </Chip>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onAddModalClose}>
                Cancelar
              </Button>
              <Button
                color="primary"
                onPress={handleCreateReservation}
                isLoading={loading}
                className="bg-gradient-to-r from-green-500 to-green-800"
              >
                Crear Reserva
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal de detalles */}
        <Modal
          isOpen={isDetailModalOpen}
          onClose={onDetailModalClose}
          size="3xl"
        >
          <ModalContent>
            <ModalHeader>
              <h3 className="text-xl font-bold">
                Detalles de la Reserva #{selectedReservation?.id}
              </h3>
            </ModalHeader>
            <ModalBody>
              {selectedReservation && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardBody>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="mr-2 text-blue-500"
                          />
                          Información del Usuario
                        </h4>
                        <div className="space-y-2">
                          <p>
                            <span className="font-medium">Nombre:</span>{" "}
                            {selectedReservation.nameUser}
                          </p>
                          <p>
                            <span className="font-medium">ID:</span>{" "}
                            {selectedReservation.idUser}
                          </p>
                        </div>
                      </CardBody>
                    </Card>

                    <Card>
                      <CardBody>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <FontAwesomeIcon
                            icon={faBuilding}
                            className="mr-2 text-green-500"
                          />
                          Información de la Sala
                        </h4>
                        <div className="space-y-2">
                          <p>
                            <span className="font-medium">Sala:</span>{" "}
                            {selectedReservation.hallId.name}
                          </p>
                          <p>
                            <span className="font-medium">Ubicación:</span>{" "}
                            {selectedReservation.hallId.location}
                          </p>
                          <p>
                            <span className="font-medium">Capacidad:</span>{" "}
                            {selectedReservation.hallId.capacity} personas
                          </p>
                        </div>
                      </CardBody>
                    </Card>
                  </div>

                  <Card>
                    <CardBody>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="mr-2 text-purple-500"
                        />
                        Horario de la Reserva
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <p>
                          <span className="font-medium">Fecha:</span>{" "}
                          {formatDate(selectedReservation.date)}
                        </p>
                        <p>
                          <span className="font-medium">Inicio:</span>{" "}
                          {formatTime(selectedReservation.timeStartBooking)}
                        </p>
                        <p>
                          <span className="font-medium">Fin:</span>{" "}
                          {formatTime(selectedReservation.timeEndBooking)}
                        </p>
                      </div>
                    </CardBody>
                  </Card>

                  {selectedReservation.itemsLoans.length > 0 && (
                    <Card>
                      <CardBody>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <FontAwesomeIcon
                            icon={faBoxes}
                            className="mr-2 text-orange-500"
                          />
                          Elementos Prestados
                        </h4>
                        <div className="space-y-3">
                          {selectedReservation.itemsLoans.map((loan) => (
                            <div
                              key={loan.id}
                              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium">
                                  {loan.itemId.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {loan.itemId.description}
                                </p>
                                <p className="text-sm">
                                  Cantidad: {loan.quantity}
                                </p>
                              </div>
                              <Chip
                                color={
                                  getReturnStatusColor(loan.returnStatus) as any
                                }
                                variant="flat"
                                size="sm"
                              >
                                {loan.returnStatus}
                              </Chip>
                            </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>
                  )}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onDetailModalClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal de selección de elementos */}
        <Modal isOpen={isItemsModalOpen} onClose={onItemsModalClose} size="2xl">
          <ModalContent>
            <ModalHeader>
              <h3 className="text-xl font-bold">Seleccionar Elementos</h3>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-500">
                          {item.description}
                        </p>
                        <p className="text-sm">
                          Disponibles: {item.quantityAvailable}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          min="1"
                          max={item.quantityAvailable}
                          defaultValue="1"
                          className="w-20"
                          size="sm"
                        />
                        <Button
                          size="sm"
                          color="primary"
                          onPress={() => {
                            // Lógica para añadir elemento
                            toast.success(`${item.name} añadido`);
                          }}
                        >
                          Añadir
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onItemsModalClose}>
                Confirmar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal de devolución de elementos */}

        <Modal
          isOpen={isReturnModalOpen}
          onClose={onReturnModalClose}
          size="2xl"
        >
          <ModalContent>
            <ModalHeader>
              <h3 className="text-xl font-bold">Devolver Elementos</h3>
            </ModalHeader>
            <ModalBody>
              {selectedReservation &&
              selectedReservation.itemsLoans.length > 0 ? (
                <div className="space-y-4">
                  {selectedReservation.itemsLoans.map((loan) => (
                    <Card key={loan.id} className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{loan.itemId.name}</h4>
                          <p className="text-sm text-gray-500">
                            {loan.itemId.description}
                          </p>
                          <p className="text-sm">Cantidad: {loan.quantity}</p>
                        </div>
                        <Chip
                          color={getReturnStatusColor(loan.returnStatus) as any}
                          variant="flat"
                          size="sm"
                        >
                          {loan.returnStatus}
                        </Chip>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No hay elementos para devolver.</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onPress={() => {
                  // Lógica para procesar devolución
                  toast.success("Elementos devueltos exitosamente");
                  onReturnModalClose();
                }}
              >
                Confirmar Devolución
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default ReservationsPage;
