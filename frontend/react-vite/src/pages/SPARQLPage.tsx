import { useState } from "react";
import QueryInfoWidget from "../components/QueryInfoWidget";

const SPARQLPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);

  const handleRunQuery = async () => {
    const data = await runSPARQLQuery(query);
    setResults(data);
  };

  return (
    <div className="container mt-4">
      <h2>SPARQL Query Form</h2>
      <textarea
        className="form-control"
        rows={5}
        placeholder="Enter your SPARQL query..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      ></textarea>
      <button className="btn btn-primary mt-2" onClick={handleRunQuery}>
        Run Query
      </button>
      <div className="mt-4">
        {results && <pre>{JSON.stringify(results, null, 2)}</pre>}
      </div>
      <QueryInfoWidget />
    </div>
  );
};

export default SPARQLPage;
