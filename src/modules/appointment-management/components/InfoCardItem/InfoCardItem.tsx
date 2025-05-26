import { Card } from "@heroui/react";

type Props = {
  id: string | number;
  title: string;
  subtitle: string;
  elementHeader?: React.ReactNode;
  children?: React.ReactNode;
  titleClassName?: string;
  subtitleClassName?: string;
};

const InfoCardItem = ({
  title,
  subtitle,
  elementHeader,
  children,
  titleClassName,
  subtitleClassName,
}: Props) => {
  return (
    <Card className="p-4 my-2">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col">
          <p className={`text-base font-medium ${titleClassName ?? ""}`}>
            {title}
          </p>
          <p className={`text-sm ${subtitleClassName ?? ""}`}>{subtitle}</p>
          {elementHeader}
        </div>
        {children && <div>{children}</div>}
      </div>
    </Card>
  );
};

export default InfoCardItem;
