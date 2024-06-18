import { ErrorCard } from "@/app/components/auth/error-card";
import HomeButton from "@/app/components/auth/home-button";

const AuthErrorPage = () => {
  return (
    <div className=" flex flex-col md:flex-row gap-20 md:gap-0 ">
      <div>
        <HomeButton />
      </div>

      <div className="w-full max-w-md">
        <ErrorCard />
      </div>
    </div>
  );
};

export default AuthErrorPage;
