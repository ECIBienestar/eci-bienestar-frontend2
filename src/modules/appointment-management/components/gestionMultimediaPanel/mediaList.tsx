import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { InfoCardItem } from "../../../appointment-management/components/InfoCardItem";
import { useAllMultimedia, useDeleteMultimedia } from "../../hooks";
import { MultimediaResponse } from "../../types/dto/response/MultimediaResponse";
import { ShowErrorMessage, ShowLoading } from "../common";
import { useState } from "react";

const MediaList = () => {
  const { data, isLoading, isError } = useAllMultimedia();
  const { mutate: deleteMultimedia } = useDeleteMultimedia();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const multimediaList: MultimediaResponse[] = data?.data ?? [];
  const handleDelete = (id: number) => {
    setDeletingId(id);
    deleteMultimedia(id, {
      onSettled: () => {
        setDeletingId(null);
      },
    });
  };

  return (
    <>
      {isLoading && <ShowLoading />}

      {!isLoading && isError && (
        <ShowErrorMessage message="Error al cargar los contenidos multimedia" />
      )}

      {!isLoading &&
        !isError &&
        multimediaList.map((item) => (
          <InfoCardItem
            key={item.id}
            id={item.id}
            title={item.name}
            subtitle={`${item.type} • ${item.duration}s`}
            titleClassName="text-black"
            subtitleClassName="text-zinc-500"
          >
            <button
              onClick={() => handleDelete(item.id)}
              disabled={deletingId === item.id}
            >
              {deletingId === item.id ? (
                <p className="text-sm text-pink-600">eliminando...</p>
              ) : (
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-pink-600 hover:text-pink-800"
                />
              )}
            </button>
          </InfoCardItem>
        ))}
    </>
  );
};

export default MediaList;
