import { auth } from "@/auth";
import { AccountProfile } from "./AccountProfile";
import DefaultLayout from "@/app/components/dashboard_components/Layouts/DefaultLayout";

const Account = async () => {
  const session = await auth();

  return (
    <div>
      <DefaultLayout>
        <AccountProfile />
      </DefaultLayout>
    </div>
  );
};

export default Account;
