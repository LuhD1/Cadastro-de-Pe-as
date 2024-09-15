import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Formulario } from "./pages/Formulario/Formulario";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Root />}> */}
        <Route path="/*" element={<Formulario />} />
        {/* </Route> */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
