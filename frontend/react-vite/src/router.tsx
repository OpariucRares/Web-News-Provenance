import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SPARQLPage from "./pages/SPARQLPage";
import ArticleDetailsPage from "./pages/ArticleDetailsPage";
import AdvancedSearchPage from "./pages/AdvancedSearchPage";
import StatisticsPage from "./pages/StatisticsPage";

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sparql" element={<SPARQLPage />} />
      <Route path="/article/:id" element={<ArticleDetailsPage />} />
      <Route path="/advanced-search" element={<AdvancedSearchPage />} />
      <Route path="/statistics" element={<StatisticsPage />} />
    </Routes>
  </Router>
);

export default AppRouter;
