import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@modules/appointment-management/styles/InfoItem.module.css";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

type Props = {
  readonly title: string;
  readonly info: string;
  readonly icon: IconProp;
  readonly color: string;
};

function InfoItem({ title, info, icon, color }: Props) {
  return (
    <div className="flex gap-3">
      <FontAwesomeIcon icon={icon} className={`${styles[color]}`} />
      <div>
        <p className="font-medium text-sm text-gray-600">{title}</p>
        <p className="font-medium text-lg">{info}</p>
      </div>
    </div>
  );
}

export default InfoItem;
