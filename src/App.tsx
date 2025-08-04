import { Outlet } from "react-router";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <div className="flex items-center justify-center">Home page</div>
      <Outlet />
    </>
  );
}

export default App;
