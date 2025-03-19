import { useLoaderData, useNavigate, useSearchParams } from "react-router"
import { Influencer } from "."
import { MouseEvent, useCallback, useState } from "react"
import { SocialMediaIcon } from "../../components/SocialMediaIcon"
import { useForm } from "react-hook-form"

type InfluencerSearch = {
  name: string
}

export const Influencers = () => {
  const { influencers } = useLoaderData() as { influencers: Influencer[] }
  const [qs] = useSearchParams()
  const { register, handleSubmit, reset } = useForm<InfluencerSearch>({
    defaultValues: {
      name: qs.get("name") || "",
    },
  })

  const navigate = useNavigate()

  const filter = (data: InfluencerSearch) => {
    const params = new URLSearchParams()
    params.append("name", data.name)

    navigate({
      pathname: "/influencers",
      search: params.toString(),
    })
  }

  const clearFilter = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault()
    reset()
    navigate({
      pathname: "/influencers",
    })
  }

  return (
    <>
      <h2>Influencers</h2>

      <div className="row mt-3 mb-3">
        <div className="col">
          <form onSubmit={handleSubmit(filter)} key={qs.get("name")}>
            <div className="row row-cols-lg-auto g-1 align-items-center">
              <div className="col-12">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Search by name"
                  {...register("name", { required: true, min: 2 })}
                />
              </div>

              {qs.get("name") && (
                <div className="col-12">
                  <button className="btn btn-danger" onClick={clearFilter}>
                    Clear
                  </button>
                </div>
              )}

              <div className="col-12">
                <button className="btn btn-success">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <InfluencerData influencers={influencers} />
    </>
  )
}

const InfluencerData = ({ influencers }: { influencers: Influencer[] }) => {
  if (!influencers) {
    return <>Failed to load influencers</>
  }

  if (influencers.length === 0) {
    return <>No influencers to display</>
  }

  return (
    <table className="table table-sm">
      <thead>
        <tr>
          <th>Id</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {influencers.map((influencer) => (
          <InfluencerRow influencer={influencer} key={influencer.id} />
        ))}
      </tbody>
    </table>
  )
}

const InfluencerRow = ({ influencer }: { influencer: Influencer }) => {
  const [showAccounts, setShowAccounts] = useState(false)

  const toggleAccounts = useCallback((ev: React.MouseEvent) => {
    ev.preventDefault()
    setShowAccounts((prev) => !prev)
  }, [])

  return (
    <>
      <tr>
        <td>{influencer.id}</td>
        <td>{influencer.first_name}</td>
        <td>{influencer.last_name}</td>
        <td>
          <a
            href="#"
            onClick={toggleAccounts}
            style={{ textDecoration: "none" }}
          >
            {showAccounts ? "▲" : "▼"}
          </a>
        </td>
      </tr>
      <tr style={{ display: showAccounts ? "table-row" : "none" }}>
        <td colSpan={4}>
          <strong>Accounts</strong>

          <ul className="account-list">
            {influencer.accounts.map((account) => (
              <li key={account.social_media_id + account.name}>
                {/* resolve slug by id */}
                <SocialMediaIcon slug="instagram" /> {account.name}
              </li>
            ))}
          </ul>
        </td>
      </tr>
    </>
  )
}
