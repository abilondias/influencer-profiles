import { Link, Outlet } from "react-router"

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand bg-body-secondary">
        <div className="container-sm">
          <Link className="navbar-brand" to={{ pathname: "/" }}>
            Influencer Profiles
          </Link>
          <div className="navbar-collapse">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to={{ pathname: "/influencers" }}>
                  Influencers
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to={{ pathname: "/influencers/new" }}
                >
                  New Influencer
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container-sm content">
        <div className="row">
          <div className="col">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
