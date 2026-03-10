// Home.jsx
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main>
      <button type="button" onClick={() => navigate("/chat/1")}>
        Project 1
      </button>

      <button type="button" onClick={() => navigate("/chat/2")}>
        Project 2
      </button>
    </main>
  );
}
