import NavBar from "./components/Nav/Nav";
import LandingPage from "./landing-page";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div>
        <LandingPage />
      </div>
    </div>
  );
}
