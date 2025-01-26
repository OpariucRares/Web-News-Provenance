import QueryInfoWidget from "../components/QueryInfoWidget";

const SPARQLPage = () => (
  <div className="container mt-4">
    <h2>SPARQL Query Form</h2>
    <form>
      <div className="mb-3">
        <label htmlFor="sparqlQuery" className="form-label">
          Query
        </label>
        <textarea
          className="form-control"
          id="sparqlQuery"
          rows={5}
          placeholder="Enter your SPARQL query..."
        ></textarea>
      </div>
      <button type="button" className="btn btn-primary">
        Run Query
      </button>
    </form>
    <div className="mt-4">
      <QueryInfoWidget />
    </div>
  </div>
);

export default SPARQLPage;
