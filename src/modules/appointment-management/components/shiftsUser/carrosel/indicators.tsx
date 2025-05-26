type Props = {
  total: number;
  currentIndex: number;
};

export const Indicators = ({ total, currentIndex }: Props) => (
  <div className="flex justify-center mt-2">
    {Array.from({ length: total }).map((_, idx) => (
      <div
        key={idx}
        className={`w-3 h-3 mx-1 rounded-full transition-opacity duration-300 ${
          idx === currentIndex ? "opacity-100 bg-white" : "opacity-40 bg-white"
        }`}
      />
    ))}
  </div>
);
