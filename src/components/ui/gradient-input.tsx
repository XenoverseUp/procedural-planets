type GradientInputProps = {
  label: string;
  description?: string;
};

const GradientInput = ({ label, description }: GradientInputProps) => {
  return (
    <div className="flex w-full flex-col">
      <div className="flex items-end justify-between">
        <h3 className="font-medium">{label}</h3>
      </div>
      {!!description && (
        <span className="mt-3 text-xs leading-relaxed opacity-50">
          {description}
        </span>
      )}
    </div>
  );
};

export default GradientInput;
