type FilterSelectProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const FilterSelect = ({ label, options, value, onChange, placeholder }: FilterSelectProps) => {
  return (
    <div className="flex-1 min-w-0"> {/* min-w-0 para evitar overflow */}
      <h3 className="font-semibold">{label}</h3>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-200 text-gray-500 border rounded-[7px] px-2 py-1 w-full"
      >
        <option value="">{placeholder || `Seleccione ${label.toLowerCase()}`}</option>
        {options.map((opt, index) => (
          <option key={index} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterSelect;
