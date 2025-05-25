import "./App.css";
import { Route, Routes } from "react-router-dom";
import Owners from "./pages/Owners.page";
import Pets from "./pages/Pets.page";

function App() {
  return (
    <Routes>
      <Route path="/owners" element={<Owners />} />
      <Route path="/owners/:ownerId" element={<Pets />} />
    </Routes>
  );
}

export default App;
