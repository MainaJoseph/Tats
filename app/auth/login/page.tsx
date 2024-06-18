import { LoginForm } from "@/app/components/auth/LoginForm";
import HomeButton from "@/app/components/auth/home-button";

const LoginPage = () => {
  return (
    <div className=" flex flex-col md:flex-row gap-20 ">
      <div>
        <HomeButton />
      </div>

      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
