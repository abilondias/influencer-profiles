import { useLoaderData } from "react-router"
import { Influencer } from "."
import { useCallback, useState } from "react"
import { SocialMediaIcon } from "../../components/SocialMediaIcon"

export const Influencers = () => {
  const { influencers } = useLoaderData() as { influencers: Influencer[] }

  return (
    <>
      <h2>Influencers</h2>

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
