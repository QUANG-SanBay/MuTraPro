import AppRouter from "./routers/AppRouter";
import GlobalStyles from "./assets/css/globalstyles/GlobalStyles";

function App() {
  return (
    <GlobalStyles>
      <Router>
        <div className="p-6 font-sans">
          <h1 className="text-2xl font-bold text-blue-600 mb-2">
            MuTraPro Frontend
          </h1>
          <p className="mb-4 text-gray-700">Backend says: {message}</p>
          <AppRouter />
        </div>
      </Router>
    </GlobalStyles>
  );
}

export default App;