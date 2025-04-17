import ExhibitionDetail from "../../components/Exhibition/ExhibitionDetail";
import ExhibitionFeed from "../../components/Exhibition/ExhibitionFeed";
import Guestbook from "../../components/Exhibition/Guestbook";
import "./ExhibitionPage.css";
const ExhibitionPage = () => {
  return (
    <div>
      <ExhibitionFeed />
      <ExhibitionDetail />
      <Guestbook />
    </div>
  );
};

export default ExhibitionPage;
