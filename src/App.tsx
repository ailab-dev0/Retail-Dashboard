import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import AppRoutes from "./routes/index";
import { Toast } from "./components/Toast";

export function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
        <Toast />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;