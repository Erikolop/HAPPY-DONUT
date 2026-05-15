import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/glazed" element={<Home initialCategory="Glazed" />} />
        <Route path="/sprinkle" element={<Home initialCategory="Sprinkle" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
