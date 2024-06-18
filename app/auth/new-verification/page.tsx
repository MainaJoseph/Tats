import HomeButton from "@/app/components/auth/home-button";
import { NewVerificationForm } from "@/app/components/auth/new-verification-form";

const NewVerificationPage = () => {
  return (
    <div className=" flex flex-col md:flex-row gap-20 md:gap-0 ">
      <div>
        <HomeButton />
      </div>

      <div className="w-full max-w-md">
        <NewVerificationForm />
      </div>
    </div>
  );
};

export default NewVerificationPage;
