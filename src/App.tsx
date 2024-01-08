import PoolTable from "./components/PoolTable";
import useFrameWalletAddress from "./hooks/useFrameWalletAddress";
import "./App.css";

function App() {
  const walletAddress = useFrameWalletAddress();
  return (
    <div className="App">
      <div className="card">Wallet: {walletAddress || "(unconnected)"}</div>
      <div className="card">
        <PoolTable />
      </div>
      <p className="read-the-docs">
        Created from codesandbox.io template:{" "}
        <a href="https://codesandbox.io/p/github/codesandbox/codesandbox-template-vite-react/">
          <code>codesandbox-template-vite-react</code>
        </a>
      </p>
    </div>
  );
}

export default App;
