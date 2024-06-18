import { ResetForm } from "@/app/components/auth/ResetForm";
import HomeButton from "@/app/components/auth/home-button";

const ResetPage = () => {
  return (
    <div className=" flex flex-col md:flex-row gap-20 md:gap-0 ">
      <div>
        <HomeButton />
      </div>

      <div className="w-full max-w-md">
        <ResetForm />
      </div>
    </div>
  );
};

export default ResetPage;
