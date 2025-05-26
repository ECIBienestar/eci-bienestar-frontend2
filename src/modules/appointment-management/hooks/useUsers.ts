import { useQuery } from "@tanstack/react-query";
import { checkUserExists } from "@modules/appointment-management/services";

export const useCheckUserExists = (id: string) => {
  return useQuery({
    queryKey: ["check-user-exists", id],
    queryFn: () => checkUserExists(id),
    enabled: !!id,
  });
};
