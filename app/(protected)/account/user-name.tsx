import { ExtendedUser } from "@/next-auth-d";

interface UserNameProps {
  user: ExtendedUser;
}
const UserName = ({ user }: UserNameProps) => {
  return (
    <div>
      <p>UserName</p>
      <span>{user?.id}</span>
    </div>
  );
};

export default UserName;
