import { Avatar } from "../components";

export default function Home() {
  return (
    <div className="Home">
      <h1>Home</h1>
      <h2>Idle</h2>
      <div className="tmp-grid">
        { Array(8).fill(1).map((v, i) => <Avatar key={`i-${i}`} />) }
      </div>
      <h2>On Campaign</h2>
      <div className="tmp-grid">
        { Array(8).fill(1).map((v, i) => <Avatar key={`c-${i}`} />) }
      </div>
      <h2>On Passive</h2>
      <div className="tmp-grid">
        { Array(8).fill(1).map((v, i) => <Avatar key={`p-${i}`} />) }
      </div>
    </div>
  );
}
