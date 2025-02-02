import { Link } from "react-router-dom";
import logo from "../assets/logor.png";

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
    <div className="container-fluid">
      <Link className="navbar-brand" to="/">
        <img src={logo} alt="Logo" height="50" />
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
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/sparql">
              SPARQL
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/advanced-search">
              Advanced Search
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/statistics">
              Statistics
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
