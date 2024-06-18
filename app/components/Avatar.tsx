import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FaUser } from "react-icons/fa";

const AvatarPic = () => {
  const user = useCurrentUser();
  return (
    <div>
      <Avatar className="p-2 rounded-full">
        <AvatarImage src={user?.image || ""} />
        <AvatarFallback className="bg-slate-700">
          <FaUser className="text-white" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default AvatarPic;
