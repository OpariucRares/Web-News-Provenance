import { useState } from "react";
import { runSPARQLQuery } from "../api/sparqlApi";
import "../styles/SPARQLPage.css";

const SPARQLPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState("RDFa");

  const handleRunQuery = async () => {
    const endpoint = activeButton === "RDFa" ? "rdfa" : "jsonld";
    const cleanedQuery = query.replace(/[\t\n\r]+/g, " ").trim();
    const data = await runSPARQLQuery(cleanedQuery, endpoint);
    if (activeButton === "JSON-LD") {
      const jsonobj = JSON.parse(data);
      setResults(JSON.stringify(jsonobj, null, 2));
    } else {
      setResults(data);
    }
  };

  const handleButtonClick = (buttonText: string) => {
    setActiveButton(buttonText);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="container mt-4">
      <h2>SPARQL Query Form</h2>
      <div className="mb-2">
        <button
          className={`btn ${
            activeButton === "RDFa" ? "btn-primary" : "btn-outline-primary"
          } me-2`}
          onClick={() => handleButtonClick("RDFa")}
        >
          RDFa
        </button>
        <button
          className={`btn ${
            activeButton === "JSON-LD" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => handleButtonClick("JSON-LD")}
        >
          JSON-LD
        </button>
      </div>
      <textarea
        className="form-control"
        rows={5}
        placeholder="Enter your SPARQL query..."
        value={query}
        onChange={handleChange}
      ></textarea>
      <button className="btn btn-primary mt-2" onClick={handleRunQuery}>
        Run Query
      </button>
      <div className="result-container">
        {results &&
          (activeButton === "RDFa" ? (
            <pre dangerouslySetInnerHTML={{ __html: results }} />
          ) : (
            <pre dangerouslySetInnerHTML={{ __html: results }} />
          ))}
      </div>
    </div>
  );
};

export default SPARQLPage;
