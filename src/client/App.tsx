import { Link, Outlet } from "react-router"
import "./App.css"
import { Notifications } from "./components/Notifications"

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
            <Notifications duration={5000} />

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
