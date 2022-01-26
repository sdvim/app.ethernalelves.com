import { Avatar } from "../components";

export default function Home() {
  return (
    <div className="Home page">
      <h1>Home</h1>
      <button>Mint 1 Elf</button>
      <h2>Idle</h2>
      <div className="tmp-grid">
        { Array(8).fill(1).map((v, i) => <Avatar key={`i-${i}`} />) }
      </div>
      <h2>Campaign</h2>
      <div className="tmp-grid">
        { Array(8).fill(1).map((v, i) => <Avatar key={`c-${i}`} />) }
      </div>
      <h2>Passive</h2>
      <div className="tmp-grid">
        { Array(8).fill(1).map((v, i) => <Avatar key={`p-${i}`} />) }
      </div>
    </div>
  );
}
