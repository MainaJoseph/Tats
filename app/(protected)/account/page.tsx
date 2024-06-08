import { auth } from "@/auth";
import AccountProfile from "./AccountProfile";

const Account = async () => {
  const session = await auth();

  return (
    <div>
      <AccountProfile />
    </div>
  );
};

export default Account;
