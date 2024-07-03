import "./App.css";
import VirtualList from "./components/VirtualList";

function App() {
  return (
    <div className="aaa">
      <div className="aaa1">aaa1</div>
      <div className="aaa2">
        <div className="aaa3">aaa3</div>
        <VirtualList />
      </div>
    </div>
  );
}

export default App;
