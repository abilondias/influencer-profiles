import {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useCallback,
  useState,
} from "react"
import { Account, SocialMedia } from "."
import { useLoaderData, useNavigate } from "react-router"

const InfluencerForm = () => {
  const { socialMedias } = useLoaderData() as { socialMedias: SocialMedia[] }
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [accounts, setAccounts] = useState<Account[]>([
    { social_media_id: socialMedias[0].id, name: "" },
  ])
  const [error, setError] = useState<{
    message: string
    details: { message?: string; field?: string }[]
  }>()

  const updateFirstName = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    ev.preventDefault()
    setFirstName(ev.target.value)
  }, [])

  const updateLastName = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    ev.preventDefault()
    setLastName(ev.target.value)
  }, [])

  const addAccount = useCallback((ev: FormEvent) => {
    ev.preventDefault()

    setAccounts((prevAccounts) => [
      ...prevAccounts,
      { social_media_id: socialMedias[0].id, name: "" },
    ])
  }, [])

  const updateAccountField = useCallback(
    (index: number, field: keyof Account) =>
      (ev: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        ev.preventDefault()

        setAccounts((prevAccounts) =>
          prevAccounts.map((account, i) => {
            if (i !== index) {
              return account
            }

            if (field === "social_media_id") {
              return {
                ...account,
                social_media_id: Number.parseInt(ev.target.value),
              }
            }

            return { ...account, [field]: ev.target.value }
          }),
        )
      },
    [],
  )

  const removeAccount = useCallback(
    (index: number) => (ev: MouseEvent) => {
      ev.preventDefault()

      if (accounts.length === 1) {
        return
      }

      setAccounts((prevAccounts) => prevAccounts.filter((_, i) => i !== index))
    },
    [accounts],
  )

  const handleForm = useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault()

      try {
        const response = await fetch("/api/influencers", {
          method: "post",
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            accounts,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })

        const parsed = await response.json()
        if (!response.ok && response.status !== 500) {
          setError(parsed)
          return
        }

        navigate("/influencers", {
          state: {
            highlight: parsed.id,
          },
        })
      } catch (error) {
        setError({ message: "Unexpected request error", details: [] })
        console.log(error)
      }
    },
    [firstName, lastName, accounts],
  )

  return (
    <>
      <h2>New Influencer</h2>

      <form onSubmit={handleForm}>
        {error && error?.message !== "" && (
          <div className="alert alert-danger">
            <strong>{error?.message}</strong>
            <ul>
              {error?.details.map((detail, i) => (
                <li key={i}>{detail?.message}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="first_name">First Name</label>
            <input
              className="form-control"
              type="text"
              name="first_name"
              id="first_name"
              value={firstName}
              onChange={updateFirstName}
              placeholder="John"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="last_name">Last Name</label>
            <input
              className="form-control"
              type="text"
              name="last_name"
              id="last_name"
              value={lastName}
              onChange={updateLastName}
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="mt-2">
          <strong>Accounts</strong>

          {accounts.map((account, accountIndex) => (
            <div className="card mt-3" key={accountIndex}>
              <div className="card-body pt-2 pb-2">
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <label htmlFor="social_media_id">Social Media</label>
                      <select
                        className="form-select"
                        name="social_media_id"
                        value={account.social_media_id}
                        onChange={updateAccountField(
                          accountIndex,
                          "social_media_id",
                        )}
                      >
                        {socialMedias.map((sm, i) => (
                          <option value={sm.id} key={i}>
                            {sm.title}
                          </option>
                        ))}
                      </select>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <label>Account Name</label>
                    <div className="input-group">
                      <input
                        className="form-control"
                        type="text"
                        value={account.name}
                        onChange={updateAccountField(accountIndex, "name")}
                        placeholder="johndoe_tt"
                      />
                      {accounts.length > 1 && (
                        <button
                          className="btn btn-danger"
                          onClick={removeAccount(accountIndex)}
                        >
                          x
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <p className="mt-2">
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
