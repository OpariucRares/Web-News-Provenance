import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SPARQLPage from "./pages/SPARQLPage";
import ArticleDetailsPage from "./pages/ArticleDetailsPage";
import AdvancedSearchPage from "./pages/AdvancedSearchPage";

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sparql" element={<SPARQLPage />} />
      <Route path="/article/:id" element={<ArticleDetailsPage />} />
      <Route path="/advanced-search" element={<AdvancedSearchPage />} />
    </Routes>
  </Router>
);

export default AppRouter;
