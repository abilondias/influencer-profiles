import { useLoaderData, useNavigate, useSearchParams } from "react-router"
import { Influencer } from "."
import { MouseEvent, useCallback, useState } from "react"
import { SocialMediaIcon } from "../../components/SocialMediaIcon"
import { useForm } from "react-hook-form"
import { useSocialMedias } from "../../hooks/useSocialMedias"

type InfluencerSearch = {
  name: string
}

export const Influencers = () => {
  const { influencers } = useLoaderData() as { influencers: Influencer[] }
  const [qs] = useSearchParams()
  const name = qs.get("name")

  const { register, handleSubmit, reset } = useForm<InfluencerSearch>({
    defaultValues: {
      name: name || "",
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
          <form onSubmit={handleSubmit(filter)} key={name}>
            <div className="row row-cols-lg-auto g-1 align-items-center">
              <div className="col-12">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Search by name"
                  {...register("name", { required: true })}
                />
              </div>

              {name && (
                <div className="col-12">
                  <button className="btn btn-danger" onClick={clearFilter}>
                    Clear
                  </button>
                </div>
              )}

              <div className="col-12">
                <button className="btn btn-success" data-testid="search-button">
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
    return <p>Failed to load influencers</p>
  }

  if (influencers.length === 0) {
    return <p>No influencers to display</p>
  }

  return (
    <table className="table table-sm">
      <thead>
        <tr>
          <th>Id</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th style={{ width: "50px" }}></th>
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
  const { socialMediaById } = useSocialMedias()

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
          <button className="btn btn-sm" onClick={toggleAccounts}>
            {showAccounts ? "▲" : "▼"}
          </button>
        </td>
      </tr>
      <tr style={{ display: showAccounts ? "table-row" : "none" }}>
        <td colSpan={4}>
          <strong>Accounts</strong>

          <ul className="account-list">
            {influencer.accounts.map((account) => {
              const sm = socialMediaById(account.social_media_id)
              const slug = sm ? sm.slug : ""

              return (
                <li key={account.social_media_id + account.name}>
                  <SocialMediaIcon slug={slug} />
                  {account.name}
                </li>
              )
            })}
          </ul>
        </td>
      </tr>
    </>
  )
}
