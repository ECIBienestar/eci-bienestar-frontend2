import { useState } from "react";
import { CarroselItem } from "@/modules/appointment-management/types/carroselType";

const hookGestionMultimediaPanel = (
  initial: CarroselItem[] = [],
  onUpdateList?: (newList: CarroselItem[]) => void
) => {
  const [selectedDuration, setSelectedDuration] = useState("8");
  const [list, setList] = useState<CarroselItem[]>(initial);
  const [pendingDelete, setPendingDelete] = useState<Set<number>>(new Set());

  const handleDelete = (id: number): void => {
    setPendingDelete((prev) => new Set(prev).add(id));
  };

  const handleSaveChanges = () => {
    const updatedList = list.filter((item) => !pendingDelete.has(item.id));
    setList(updatedList);
    setPendingDelete(new Set());

    if (onUpdateList) {
      onUpdateList(updatedList);
    }

    return updatedList;
  };

  const resetPendingDelete = () => {
    setPendingDelete(new Set());
  };

  return {
    selectedDuration,
    setSelectedDuration,
    list,
    pendingDelete,
    handleDelete,
    handleSaveChanges,
    resetPendingDelete,
  };
};

export default hookGestionMultimediaPanel;
