import { Outlet } from "react-router-dom";
import { Formulario } from "../Formulario/Formulario";

// Layout principal do App com Navbar Fixa
// As páginas com Navbar fixa: home, livros, empréstimos, etc
export function Root() {
  return (
    <>
      <header>
        <Formulario />
      </header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </>
  );
}
