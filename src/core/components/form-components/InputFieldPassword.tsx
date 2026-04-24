import { useField } from 'formik';
import { EyeIcon } from '@heroicons/react/24/solid';

interface InputFieldProps {
  isSignIn: boolean;
  label: string;
  name: string;
  type: string;
  icon?: string;
  id?: string;
  placeholder?: string;
}

export function InputFieldPassword({ label, isSignIn, ...props }: InputFieldProps) {
  const [field, meta] = useField(props);

  const handleShowPassword = () => {
    const input = document.querySelector('.input-password') as HTMLInputElement;
    if (input && input.type === 'password') {
      input.type = 'text';
    } else {
      input.type = 'password';
    }
  };
  return (
    <div className="relative flex flex-col text-start">
      {isSignIn && <span className="text-placeholder absolute right-0 top-0 text-xs">¿Olvidaste tu contraseña?</span>}

      <label className="text-placeholder text-[14.5px] font-medium sm:text-[15px]" htmlFor={props.id || props.name}>
        {label}
      </label>
      {props.type === 'password' ? (
        <div className="relative">
          <EyeIcon className="z-100 absolute bottom-0 right-0 top-1/2 mx-4 mt-[1px] size-5 -translate-y-1/2 hover:cursor-pointer" onClick={handleShowPassword} />

          <input className={`input-password text-strong input-bg mt-1 w-full rounded-[5px] px-3 py-3 outline-none ${meta.error && meta.touched ? 'input-error' : ''}`} {...field} {...props} />
        </div>
      ) : (
        <input className={`input-password text-strong input-bg mt-2 w-full rounded-[5px] px-3 py-3 outline-none ${meta.error && meta.touched ? 'input-error' : ''}`} {...field} {...props} />
      )}

      {meta.touched && meta.error ? <span className="font-principal-light mt-1 text-xs text-red-500 lg:text-[13px]">{meta.error}</span> : null}
    </div>
  );
}
