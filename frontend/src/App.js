
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routers/AppRouter";
import GlobalStyles from "./assets/css/globalstyles/GlobalStyles";
function App() {
  
  return (
    <GlobalStyles>
      <BrowserRouter>
        <AppRouter/>
      </BrowserRouter>
    </GlobalStyles>

  );
}

function App() {
  return (
    <Router>
      <nav style={{ marginBottom: "20px", padding: "10px", background: "#f2f2f2" }}>
        <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
        <Link to="/theodoidonhang" style={{ marginRight: "10px" }}>Theo dõi đơn hàng</Link>
        <Link to="/chitietcongviec">Chi tiết công việc</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/theodoidonhang" element={<MediaTracking />} />
        <Route path="/chitietcongviec" element={<TaskDetail />} /> 
      </Routes>
    </Router>
  );
}

export default App;