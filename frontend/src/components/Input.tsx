const Input = ({ ref, placeholder }: { ref?: any; placeholder: string }) => {
  return (
    <div>
      <input
        type="text"
        ref={ref}
        placeholder={placeholder}
        className="px-4 py-2 bordered rounded m-2"
      />
    </div>
  );
};

export default Input;
