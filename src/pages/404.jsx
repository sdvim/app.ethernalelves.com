import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="NotFound page">
      <p>It looks like you have lost your path.</p>
      <p>
        Try finding some
        {" "}
        <Link to="/help">Help</Link>, otherwise you should probably return to your
        {" "}
        <Link to="/">Elves</Link>.
        </p>
    </div>
  );
}