import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function NoShifts() {
  return (
    <div className="flex flex-col items-center m-auto gap-3">
      <FontAwesomeIcon
        icon={["fas", "calendar-xmark"]}
        size="2x"
        color="#c3c6d1"
      />
      <p>No se esta atendiendo ningun turno</p>
    </div>
  );
}

export default NoShifts;
