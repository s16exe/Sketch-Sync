// Home.jsx
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main>
      <button type="button" onClick={() => navigate("/chat/1")}>
        Chat Group 1
      </button>

      <button type="button" onClick={() => navigate("/chat/2")}>
        Chat Group 2
      </button>
    </main>
  );
}
