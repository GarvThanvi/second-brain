const Input = ({
  onChange,
  placeholder,
}: {
  onChange: () => void;
  placeholder: string;
}) => {
  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        className="px-4 py-2 bordered rounded m-2"
        onChange={onChange}
      />
    </div>
  );
};

export default Input;