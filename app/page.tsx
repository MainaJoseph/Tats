import NavBar from "./components/Nav/Nav";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-grow">Tats</div>
    </div>
  );
}
