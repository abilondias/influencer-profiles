import { MouseEvent, useState } from "react"
import { Influencer, SocialMedia } from "."
import { useLoaderData, useNavigate } from "react-router"
import { useNotify } from "../../contexts/NotificationContext"
import { FormError, TFormError } from "../../components/FormError"
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form"
import { FormInput } from "../../components/FormInput"
import { FormFieldError } from "../../components/FormInput/FormInput"

const InfluencerForm = () => {
  const { socialMedias } = useLoaderData() as { socialMedias: SocialMedia[] }

  const navigate = useNavigate()
  const notify = useNotify()
  const [formError, setFormError] = useState<TFormError>()

  const {
    control,
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<Influencer>({
    defaultValues: {
      accounts: [{ name: "", social_media_id: socialMedias[0].id }],
    },
  })
  const accounts = useFieldArray({
    name: "accounts",
    control,
  })

  const addAccount = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault()
    clearErrors("accounts")
    accounts.append({ social_media_id: 1, name: "" })
  }

  const removeAccount =
    (index: number) => (ev: MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault()
      accounts.remove(index)
    }

  const submit: SubmitHandler<Influencer> = async (data) => {
    try {
      const response = await fetch("/api/influencers", {
        method: "post",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        notify({
          message: "Influencer created.",
          level: "success",
        })
        navigate("/influencers")
        return
      }

      const parsed: TFormError = await response.json()
      if (!parsed.message) {
        setFormError({ message: "Unexpected API Error" })
        return
      }
      if (!parsed.details || parsed.details.length === 0) {
        setFormError({ message: parsed.message })
        return
      }

      parsed.details.forEach(({ message, field }) =>
        setError(field, { message }),
      )
    } catch (error) {
      setFormError({ message: "Unexpected request error" })
      console.log(error)
    }
  }

  return (
    <>
      <h2>New Influencer</h2>

      <form onSubmit={handleSubmit(submit)}>
        <FormError error={formError} />

        <div className="row">
          <div className="col-md-6">
            <FormInput
              label="First Name"
              error={errors.first_name}
              type="text"
              placeholder="John"
              {...register("first_name", {})}
            />
          </div>
          <div className="col-md-6">
            <FormInput
              label="Last Name"
              error={errors.last_name}
              type="text"
              placeholder="Doe"
              {...register("last_name", {})}
            />
          </div>
        </div>

        <div className="mt-2">
          <strong>Accounts</strong>

          {accounts.fields.map((field, index) => {
            let socialMediaIdError
            let accountNameError
            if (errors.accounts) {
              socialMediaIdError = errors.accounts[index]?.social_media_id
              accountNameError = errors.accounts[index]?.name
            }

            return (
              <div className="row" key={field.id}>
                <div className="col">
                  <label className="form-label">Social Media</label>
                  <select
                    className={`form-select ${
                      socialMediaIdError ? "is-invalid" : ""
                    }`}
                    {...register(`accounts.${index}.social_media_id`, {
                      valueAsNumber: true,
                    })}
                  >
                    {socialMedias.map((sm, i) => (
                      <option value={sm.id} key={i}>
                        {sm.title}
                      </option>
                    ))}
                  </select>
                  <FormFieldError error={socialMediaIdError} />
                </div>
                <div className="col-md-6">
                  <FormInput
                    label="Account Name"
                    error={accountNameError}
                    type="text"
                    placeholder="johndoe_tt"
                    {...register(`accounts.${index}.name`)}
                  />
                </div>
                {accounts.fields.length > 1 && (
                  <div className="col pt-4">
                    <button
                      className="btn btn-danger mt-2"
                      onClick={removeAccount(index)}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            )
          })}

          <FormFieldError error={errors.accounts} />

          <p className="mt-3">
            <button className="btn btn-primary" onClick={addAccount}>
              Add Account
            </button>
          </p>
        </div>

        <p>
          <button className="btn btn-success">Create Influencer</button>
        </p>
      </form>
    </>
  )
}

export { InfluencerForm }
