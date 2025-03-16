import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import ScraperEngineDemo from "./components/ScraperEngineDemo";
import Home from "./components/home";
import LandingPage from "./components/LandingPage";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<Home />} />
          <Route path="/demo" element={<ScraperEngineDemo />} />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
