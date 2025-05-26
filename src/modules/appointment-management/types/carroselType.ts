type CarroselItem = {
  id: number;
  type: "image" | "video";
  title: string;
  duration: number;
  url: string;
};

type CarroselProps = {
  items: CarroselItem[];
};

export type { CarroselItem, CarroselProps };
