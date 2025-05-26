import { MultimediaResponse } from "@/modules/appointment-management/types/dto/response/MultimediaResponse";
import { TypeEnum } from "@/modules/appointment-management/types/enums";

type Props = {
  item: MultimediaResponse;
  visible: boolean;
  fadeDuration: number;
};

export const Slide = ({ item, visible, fadeDuration }: Props) => {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center transition-opacity`}
      style={{
        transitionDuration: `${fadeDuration}ms`,
        opacity: visible ? 1 : 0,
      }}
    >
      {item.type === TypeEnum.IMAGE ? (
        <img
          src={item.url}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <video
          src={item.url}
          autoPlay
          muted
          loop
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};
