import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import ArtistInfo from "../../components/Exhibition/ArtistInfo";
import ExhibitionDetail from "../../components/Exhibition/ExhibitionDetail";
import ExhibitionFeed from "../../components/Exhibition/ExhibitionFeed";
import Guestbook from "../../components/Exhibition/Guestbook";
import "./ExhibitionPage.css";

export const ExhibitionPage = () => {
  const { id } = useParams();
  const [exhibition, setExhibition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchExhibitionDetail = async () => {
      try {
        const response = await axios.get(`/api/exhibitions/${id}`);
        console.log("✅ exhibition 응답 데이터:", response.data); // ✅ 여기!
        setExhibition(response.data);
      } catch (err) {
        console.error("전시 정보를 불러오지 못했습니다.", err);
        setError("전시 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitionDetail();
  }, [id]);

  if (loading) return <p>전시 정보를 불러오는 중입니다...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <ExhibitionFeed exhibition={exhibition} userId={user.id}/>
      <ExhibitionDetail exhibition={exhibition} />
      <ArtistInfo exhibition={exhibition} />
      <Guestbook exhibitionId={exhibition.id} />
    </div>
  );
};

export default ExhibitionPage;
