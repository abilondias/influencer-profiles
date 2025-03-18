import { FC } from "react"

type Detail = {
  field?: string
  message: string
}

export type TFormError = {
  message: string
  details?: Detail[]
}

type FormErrorProps = {
  error?: TFormError | string
}

export const FormError: FC<FormErrorProps> = ({ error }) => {
  if (!error) {
    return
  }

  if (typeof error === "string") {
    return <SimpleError message={error} />
  }

  const { message, details } = error

  if (!details || details.length === 0) {
    return <SimpleError message={message} />
  }

  return (
    <div className="alert alert-danger">
      <strong>{message}</strong>

      <ErrorDetails details={details} />
    </div>
  )
}

const SimpleError = ({ message }: { message: string }) => {
  if (message === "") {
    return
  }

  return <div className="alert alert-danger">{message}</div>
}

const ErrorDetails: FC<{ details: Detail[] }> = ({ details }) => {
  return (
    <ul>
      {details.map((detail, i) => {
        if (!detail.message || detail.message === "") {
          return
        }

        return <li key={i}>{detail.message}</li>
      })}
    </ul>
  )
}
