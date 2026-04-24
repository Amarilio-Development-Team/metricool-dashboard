import { useField } from 'formik';

interface InputFieldProps {
  label?: string;
  name: string;
  type: string;
  icon?: string;
  id?: string;
  maxLength?: number;
  disabled?: boolean;
  placeholder?: string;
}

export function InputField({ label, ...props }: InputFieldProps) {
  const [field, meta] = useField(props);

  return (
    <div className="flex flex-col text-start">
      <label className="text-placeholder text-[14.5px] font-medium sm:text-[15px]" htmlFor={props.id || props.name}>
        {label}
      </label>
      <input
        className={`text-strong input-bg mt-2 w-full rounded-[5px] px-3 py-3 outline-none disabled:cursor-not-allowed disabled:bg-base-200 sm:py-4 ${meta.error && meta.touched ? 'input-error' : ''}`}
        {...field}
        {...props}
      />

      {meta.touched && meta.error ? <span className="font-principal-light mt-1 pl-3 text-xs text-red-500 lg:text-[13px]">{meta.error}</span> : null}
    </div>
  );
}
