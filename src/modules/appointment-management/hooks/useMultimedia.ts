import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteMultimedia,
  getAllMultimedia,
  getMultimediaById,
  uploadMultimedia,
} from "../services";

export const useMultimedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadMultimedia,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-multimedia"],
      });
    },
    onError: (error) => {
      console.error("Error al subir el archivo multimedia:", error);
    },
  });
};

export const useMultimediaById = (id: number) => {
  return useQuery({
    queryKey: ["multimedia-by-id", id],
    queryFn: () => getMultimediaById(id),
    enabled: !!id,
  });
};

export const useAllMultimedia = () => {
  return useQuery({
    queryKey: ["all-multimedia"],
    queryFn: () => getAllMultimedia(),
  });
};

export const useDeleteMultimedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMultimedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-multimedia"],
      });
    },
    onError: (error) => {
      console.error("Error al eliminar el archivo multimedia:", error);
    },
  });
};
