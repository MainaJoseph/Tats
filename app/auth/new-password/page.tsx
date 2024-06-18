import HomeButton from "@/app/components/auth/home-button";
import { NewPasswordForm } from "@/app/components/auth/new-password-form";

const NewPasswordPage = () => {
  return (
    <div className=" flex flex-col md:flex-row gap-20 md:gap-0 ">
      <div>
        <HomeButton />
      </div>

      <div className="w-full max-w-md">
        <NewPasswordForm />
      </div>
    </div>
  );
};

export default NewPasswordPage;
