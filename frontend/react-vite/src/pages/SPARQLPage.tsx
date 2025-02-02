import { useState } from "react";
import { runSPARQLQuery } from "../api/sparqlApi";

const SPARQLPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [tableHeaders, setTableHeaders] = useState<string[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [rdfaContent, setRdfaContent] = useState<string>("");
  const [jsonldContent, setJsonldContent] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState("Table");
  const [previousQuery, setPreviousQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleRunQuery = async () => {
    if (query.trim() === "") {
      alert("Please enter a SPARQL query.");
      return;
    }

    if (query !== previousQuery) {
      setIsLoading(true);
      setPreviousQuery(query);
      setTableHeaders([]);
      setTableData([]);
      setRdfaContent("");
      setJsonldContent(null);
      setError(null);

      const cleanedQuery = query.replace(/[\t\n\r]+/g, " ").trim();

      try {
        const [rdfaResponse, jsonldResponse] = await Promise.all([
          runSPARQLQuery(cleanedQuery, "rdfa"),
          runSPARQLQuery(cleanedQuery, "jsonld"),
        ]);

        setRdfaContent(rdfaResponse);

        parseRdfaContent(rdfaResponse);

        const jsonObj = JSON.parse(jsonldResponse);
        setJsonldContent(jsonObj);
      } catch (error) {
        console.error("Error:", error);
        setError("An error occurred while fetching data.");
      }

      setIsLoading(false);
    }
  };

  const parseRdfaContent = (htmlContent: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    const dataDivs = doc.querySelectorAll(
      "div[typeof] > div, div[vocab] > div"
    );

    const headersSet = new Set<string>();
    const dataArray: any[] = [];

    dataDivs.forEach((div) => {
      const dataObject: any = {};
      div.childNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          let property = element.getAttribute("property");
          if (property) {
            const value =
              element.getAttribute("href") ||
              element.getAttribute("content") ||
              element.textContent ||
              "";
            headersSet.add(property);
            dataObject[property] = value;
          }
        }
      });
      dataArray.push(dataObject);
    });

    const headers = Array.from(headersSet);
    setTableHeaders(headers);
    setTableData(dataArray);
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  };

  const handleDownload = () => {
    let content = "";
    let fileName = "";
    let fileType = "";

    if (activeView === "Table") {
      // Convert table data to CSV
      const csvRows = [];
      csvRows.push(tableHeaders.join(","));
      tableData.forEach((row) => {
        const values = tableHeaders.map(
          (header) => `"${row[header] ? row[header] : ""}"`
        );
        csvRows.push(values.join(","));
      });
      content = csvRows.join("\n");
      fileName = "results.csv";
      fileType = "text/csv";
    } else if (activeView === "RDFa") {
      content = rdfaContent;
      fileName = "results.html";
      fileType = "text/html";
    } else if (activeView === "JSON-LD") {
      content = JSON.stringify(jsonldContent, null, 2);
      fileName = "results.json";
      fileType = "application/json";
    }

    const blob = new Blob([content], { type: fileType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
  };

  const isValidURL = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="container mt-4">
      <h2>SPARQL Query Form</h2>

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

      {isLoading && (
        <div className="mt-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-2">Fetching data...</span>
        </div>
      )}

      {!isLoading && (tableData.length > 0 || rdfaContent || jsonldContent) && (
        <div className="mt-4">
          <div className="d-flex flex-wrap align-items-center mb-3">
            <div className="btn-group mb-2">
              <button
                className={`btn ${
                  activeView === "Table" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => handleViewChange("Table")}
              >
                Table
              </button>
              <button
                className={`btn ${
                  activeView === "RDFa" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => handleViewChange("RDFa")}
              >
                RDFa
              </button>
              <button
                className={`btn ${
                  activeView === "JSON-LD"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => handleViewChange("JSON-LD")}
              >
                JSON-LD
              </button>
            </div>
          </div>

          <div className="mb-3">
            <button className="btn btn-primary" onClick={handleDownload}>
              Download {activeView === "Table" ? "CSV" : activeView}
            </button>
          </div>

          <div className="result-container">
            {activeView === "Table" && tableData.length > 0 && (
              <div className="table-responsive">
                <table className="table table-striped table-bordered">
                  <thead className="table-primary">
                    <tr>
                      {tableHeaders.map((header, index) => (
                        <th key={index}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {tableHeaders.map((header, colIndex) => {
                          const cellValue = row[header];
                          return (
                            <td key={colIndex}>
                              {isValidURL(cellValue) ? (
                                <a
                                  href={cellValue}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {cellValue}
                                </a>
                              ) : (
                                cellValue
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeView === "RDFa" && rdfaContent && (
              <pre className="code-block">{rdfaContent}</pre>
            )}
            {activeView === "JSON-LD" && jsonldContent && (
              <pre>{JSON.stringify(jsonldContent, null, 2)}</pre>
            )}
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <style>{`
        .result-container {
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          padding: 10px;
          margin-top: 20px;
          overflow-x: auto;
        }

        .code-block {
          background-color: #ffffff;
          color: #000000;
          padding: 15px;
          border-radius: 5px;
          overflow: auto;
          white-space: pre-wrap;
          font-family: monospace;
        }

        /* Adjust button group margins */
        .btn-group .btn {
          margin-right: 5px;
        }

        @media (max-width: 576px) {
          .btn-group {
            flex-direction: column;
          }

          .btn-group .btn {
            margin-bottom: 5px;
            margin-right: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default SPARQLPage;
