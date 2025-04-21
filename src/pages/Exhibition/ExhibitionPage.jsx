import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import ArtistInfo from "../../components/Exhibition/ArtistInfo";
import ExhibitionDetail from "../../components/Exhibition/ExhibitionDetail";
import ExhibitionFeed from "../../components/Exhibition/ExhibitionFeed";
import Guestbook from "../../components/Exhibition/Guestbook";
import "./ExhibitionPage.css";

// ✅ dummy 데이터 import
import { dummyExhibitions } from "../../data/dummyExhibitions";

export const ExhibitionPage = () => {
  const { id } = useParams();
  const [exhibition, setExhibition] = useState(null);

  useEffect(() => {
    const fetchExhibitionDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/exhibitions/${id}`
        );
        setExhibition(response.data);
      } catch (err) {
        console.error("임시 더미데이터 사용", err);

        // ✅ import한 dummyExhibitions에서 id 매칭
        const matchedExhibition = dummyExhibitions.find(
          (item) => item.id === Number(id)
        );
        setExhibition(matchedExhibition || null);
      }
    };

    fetchExhibitionDetail();
  }, [id]);

  return (
    <div>
      <ExhibitionFeed exhibition={exhibition} />
      <ExhibitionDetail exhibition={exhibition} />
      <ArtistInfo exhibition={exhibition} />
      <Guestbook guestbook={exhibition?.guestbook || []} />
    </div>
  );
};

export default ExhibitionPage;
