import { useParams } from "react-router-dom";

const ExhibitionDetailPage = () => {
  const { id } = useParams();

  return (
    <div style={{ paddingTop: "100px", textAlign: "center" }}>
      <h1>전시회 상세 페이지</h1>
      <p>전시회 ID: {id}</p>
    </div>
  );
};

export default ExhibitionDetailPage;
