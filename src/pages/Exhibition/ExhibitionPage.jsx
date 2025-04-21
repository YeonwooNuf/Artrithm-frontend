import { useState } from "react";
import ArtistInfo from "../../components/Exhibition/ArtistInfo";
import ExhibitionDetail from "../../components/Exhibition/ExhibitionDetail";
import ExhibitionFeed from "../../components/Exhibition/ExhibitionFeed";
import Guestbook from "../../components/Exhibition/Guestbook";
import "./ExhibitionPage.css";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

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
        const dummyData = [
          {
            id: 1,
            title: "빛의 조각",
            description: "자연광을 해체한 추상 전시입니다.",
            likes: 12,
            views: 150,
            thumbnail: "https://picsum.photos/100",
            path: "/exhibitions/Gallery3D",
            keywords: ["자연", "추상", "광선", "빛", "밝음"],
            artist: {
              name: "홍예술",
              bio: "서울과 베를린에서 활동하는 현대 작가입니다.",
              profileImage: "https://picsum.photos/100",
              works: [
                { id: 1, src: "/exhibition1.png", title: "사진" },
                { id: 2, src: "/exhibition2.png", title: "계속" },
                { id: 3, src: "/exhibition3.png", title: "안 뜨네" },
              ],
            },
            guestbook: [
              { id: "아뇨", message: "뚱인데요" },
              { id: "점메추", message: "해주세요" },
            ],
          },
          {
            id: 2,
            title: "몽환의 끝",
            description: "환상과 현실의 경계에서 펼쳐지는 감정의 흐름.",
            likes: 21,
            views: 234,
            thumbnail: "https://picsum.photos/100",
            path: "/exhibitions/Gallery3D",
            keywords: ["몽환", "꿈", "감성", "회화", "따뜻함함"],
            artist: {
              name: "이감성",
              bio: "꿈과 현실을 화폭에 담는 아티스트입니다.",
              profileImage: "https://picsum.photos/100",
              works: [
                { id: 1, src: "/exhibition1.png", title: "사진" },
                { id: 2, src: "/exhibition2.png", title: "계속" },
                { id: 3, src: "/exhibition3.png", title: "안 뜨네" },
              ],
            },
            guestbook: [
              { id: "몽키", message: "파크" },
              { id: "몽환", message: "이네" },
            ],
          },
          {
            id: 3,
            title: "조용한 파동",
            description: "소리 없는 울림과 색의 떨림을 표현한 전시입니다.",
            likes: 8,
            views: 90,
            thumbnail: "https://picsum.photos/100",
            path: "/exhibitions/Gallery3D",
            keywords: ["파동", "소리", "움직임", "에너지", "역동적"],
            artist: {
              name: "최파동",
              bio: "소리와 움직임을 시각화하는 실험적 작가.",
              profileImage: "https://picsum.photos/100",
              works: [
                { id: 1, src: "/exhibition1.png", title: "사진" },
                { id: 2, src: "/exhibition2.png", title: "계속" },
                { id: 3, src: "/exhibition3.png", title: "안 뜨네" },
              ],
            },
            guestbook: [{ id: "최파동", message: "이되" }],
          },
        ];

        const matchedExhibition = dummyData.find(
          (item) => item.id === Number(id)
        );
        if (matchedExhibition) {
          setExhibition(matchedExhibition);
        } else {
          setExhibition(null);
        }
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
