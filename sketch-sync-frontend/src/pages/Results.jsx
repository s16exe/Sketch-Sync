// Results.jsx
import { useParams } from "react-router-dom";
// import ChatClient from "./components/ChatClient";
import DrawClient from "../components/DrawClient";

export default function Results() {
  const { id } = useParams(); // read params from URL

  return <DrawClient drawId={id} />;
}
