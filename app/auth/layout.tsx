import NavBar from "../components/Nav/Nav";

const authLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <NavBar />
      <div className="h-full flex items-center justify-center mt-7 ">
        {children}
      </div>
    </div>
  );
};

export default authLayout;
