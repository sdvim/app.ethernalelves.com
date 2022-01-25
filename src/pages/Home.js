import { Avatar } from "../components";

export default function Home() {
  return (
    <div className="Home">
      <h1>Home</h1>
      {
        Array(8).fill(1).map(() => <Avatar />)
      }
    </div>
  );
}
