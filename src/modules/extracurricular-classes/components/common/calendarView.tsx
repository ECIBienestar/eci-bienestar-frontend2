import { useState } from "react";

const CalendarView = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
  //mock clases
  const classes = [
    {
      id: 1,
      name: "Pintura",
      day: "Martes",
      startTime: "11:30 am",
      endTime: "1:00 pm",
      location: "Salon De Arte",
      color: "bg-teal-400",
    },
    {
      id: 2,
      name: "Yoga",
      day: "Lunes",
      startTime: "2:30 pm",
      endTime: "4:00 pm",
      location: "Coliseo",
      color: "bg-purple-400",
    },
    {
      id: 3,
      name: "Yoga",
      day: "Miércoles",
      startTime: "2:30 pm",
      endTime: "4:00 pm",
      location: "Coliseo",
      color: "bg-purple-400",
    },
  ];

  const daysOfWeek = [
    "Hora",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = 8 + i;
    return `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 ? "am" : "pm"}`;
  });

  // Función para convertir hora a minutos desde medianoche
  const toMinutes = (timeStr: string) => {
    const [hourMin, meridian] = timeStr.toLowerCase().split(" ");
    const [hour, min] = hourMin.split(":").map(Number);
    const totalHour =
      meridian === "pm" && hour !== 12
        ? hour + 12
        : hour === 12 && meridian === "am"
        ? 0
        : hour;
    return totalHour * 60 + (min || 0);
  };

  const renderClassBlocks = (day: string) => {
    const filtered = classes.filter((c) => c.day === day);
    return filtered.map((c) => {
      const start = toMinutes(c.startTime);
      const end = toMinutes(c.endTime);
      const duration = end - start;

      const dayStart = 8 * 60;
      const blockHeight = (duration / 60) * 4;
      const offset = ((start - dayStart) / 60) * 4;

      return (
        <div
          key={c.id}
          className={`${c.color} absolute left-1 right-1 rounded-xl p-2 text-sm shadow-md`}
          style={{
            top: `${offset}rem`,
            height: `${blockHeight}rem`,
          }}
        >
          <div className="font-semibold">{c.name}</div>
          <div className="text-xs">
            {c.startTime} - {c.endTime}
          </div>
          <div className="text-xs">{c.location}</div>
        </div>
      );
    });
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Semana actual y navegación */}
      <div className="flex justify-between items-center p-4">
        <button
          onClick={() => setCurrentWeek((prev) => prev - 1)}
          className="text-sm px-3 py-1 bg-[#362550] text-white"
          style={{ borderRadius: "30px" }}
        >
          ← Semana anterior
        </button>
        <h2 className="text-xl font-semibold">Semana {currentWeek + 1}</h2>
        <button
          onClick={() => setCurrentWeek((prev) => prev + 1)}
          className="text-sm px-3 py-1 bg-[#362550] text-white"
          style={{ borderRadius: "30px" }}
        >
          Semana siguiente →
        </button>
      </div>

      {/* Tabla del horario */}
      <div className="flex-1 overflow-auto px-2 pb-4">
        <div
          className="overflow-hidden"
          style={{
            borderRadius: "30px",
            boxShadow: "0 0 0 1px #362550",
          }}
        >
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr className="text-white" style={{ backgroundColor: "#362550" }}>
                <th
                  className="p-3 text-left"
                  style={{ borderTopLeftRadius: "30px" }}
                >
                  Hora
                </th>
                {daysOfWeek.map((day, index) => (
                  <th
                    key={index}
                    className="p-3 text-left"
                    style={{
                      borderTopRightRadius:
                        index === daysOfWeek.length - 1 ? "30px" : "0",
                    }}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {/* Columna de las horas */}
                <td className="align-top w-20">
                  <div className="relative h-[30rem]">
                    {timeSlots.map((time, idx) => (
                      <div
                        key={idx}
                        className="h-16 text-xs text-black px-2 border-b border-gray-300"
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </td>

                {/* Columnas de días */}
                {daysOfWeek.map((day, i) => (
                  <td
                    key={i}
                    className="relative align-top border-l border-gray-300"
                  >
                    <div className="relative h-[40rem]">
                      {/* Líneas horarias */}
                      {timeSlots.map((_, idx) => (
                        <div
                          key={`line-${idx}`}
                          className="absolute w-full border-t border-gray-200"
                          style={{
                            top: `${idx * 4}rem`,
                            height: "1px",
                            zIndex: 1,
                          }}
                        />
                      ))}
                      {/* Bloques de clase */}
                      <div className="relative z-10">
                        {renderClassBlocks(day)}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
