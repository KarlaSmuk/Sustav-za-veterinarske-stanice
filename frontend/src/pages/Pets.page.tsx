import { useParams } from "react-router-dom";

export default function Pets() {
  const params = useParams();
  console.log(params.ownerId);
  return <div>Ljubimci</div>;
}
