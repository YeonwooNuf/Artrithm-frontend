import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import HeroSection from "../../components/HeroSection/HeroSection";
import ExhibitionMasonry from "../../components/MainSections/ExhibitionMasonry/ExhibitionMasonry";
import ScrollRevealImage from "../../components/MainSections/ScrollRevealImage/ScrollRevealImage";
import WeeklyPopularArtworks from "../../components/MainSections/WeeklyPopularArtworks/WeeklyPopularArtworks";
import "./Home.css";

const Home = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <ScrollRevealImage />
      <ExhibitionMasonry />
      <WeeklyPopularArtworks />
    </div>
  );
};
export default Home;
