import { Link } from "react-router-dom";
import logo from "../assets/logor.png";

const Navbar = () => (
  <nav
    className="navbar navbar-expand-lg navbar-dark"
    vocab="http://schema.org/"
    typeof="SiteNavigationElement"
  >
    <div className="container-fluid">
      <Link className="navbar-brand" to="/" property="url">
        <img src={logo} alt="Logo" />
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item" property="name">
            <Link className="nav-link" to="/" property="url">
              Home
            </Link>
          </li>
          <li className="nav-item" property="name">
            <Link className="nav-link" to="/sparql" property="url">
              SPARQL
            </Link>
          </li>
          <li className="nav-item" property="name">
            <Link className="nav-link" to="/advanced-search" property="url">
              Advanced Search
            </Link>
          </li>
          <li className="nav-item" property="name">
            <Link className="nav-link" to="/statistics" property="url">
              Statistics
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
