import { RegisterForm } from "@/app/components/auth/RegisterForm";
import HomeButton from "@/app/components/auth/home-button";

const signUpPage = () => {
  return (
    <div className=" flex flex-col md:flex-row gap-20 md:gap-0 ">
      <div>
        <HomeButton />
      </div>

      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};

export default signUpPage;
