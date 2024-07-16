import { auth } from "@/auth";

import DefaultLayout from "@/app/components/dashboard_components/Layouts/DefaultLayout";
import { AccountProfile } from "./AccountProfile";

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
