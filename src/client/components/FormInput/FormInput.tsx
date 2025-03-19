import { FC, InputHTMLAttributes } from "react"

interface FieldError {
  message?: string
}

type FormFieldErrorProps = {
  error: FieldError | undefined
}

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error: FieldError | undefined
}

export const FormInput: FC<FormInputProps> = (props) => {
  const { label, error, className, ...remaining } = props

  return (
    <div>
      <label className="form-label">{label}</label>
      <input
        className={`form-control ${error ? "is-invalid" : ""} ${
          className ? className : ""
        }`}
        type="text"
        placeholder="John"
        {...remaining}
      />
      <FormFieldError error={error} />
    </div>
  )
}

export const FormFieldError: FC<FormFieldErrorProps> = ({ error }) => {
  if (!error) {
    return
  }

  return <span className="invalid-feedback">{error.message}</span>
}
