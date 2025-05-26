type Props = {
  readonly title: string;
  readonly value: string;
};

function InfoItem({ title, value }: Props) {
  return (
    <div className="text-center">
      <p className="text-xl">{title}</p>
      <p className="text-base text-gray-600">{value}</p>
    </div>
  );
}

export default InfoItem;
