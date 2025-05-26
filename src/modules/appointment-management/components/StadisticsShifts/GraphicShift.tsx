import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

export type PieData = {
  name: string;
  value: number;
}[];

type Props = {
  data: PieData;
  title: string;
};

const GraphicShift = ({ data, title }: Props) => {
  return (
    <div className="drop-shadow-xl bg-white w-full border-2 rounded-[12px] p-3 h-80 sm:h-[55vh] flex flex-col">
      <h1 className="text-xl font-semibold mb-4">{title}</h1>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#0088FE" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphicShift;
