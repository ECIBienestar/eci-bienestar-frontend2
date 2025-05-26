type Props = {
  readonly className?: string;
  readonly message: string;
};

function ShowErrorMessage({ className, message }: Props) {
  return (
    <p className={`text-red-500 flex justify-center m-auto ${className}`}>
      {message}
    </p>
  );
}

export default ShowErrorMessage;
