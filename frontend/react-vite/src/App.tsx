import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SPARQLPage from "./pages/SPARQLPage";
import AdvancedSearchPage from "./pages/AdvancedSearchPage";
import ArticleDetailsPage from "./pages/ArticleDetailsPage";
import StatisticsPage from "./pages/StatisticsPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sparql" element={<SPARQLPage />} />
        <Route path="/advanced-search" element={<AdvancedSearchPage />} />
        <Route path="/article/:articleId" element={<ArticleDetailsPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
