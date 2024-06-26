import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FaUser } from "react-icons/fa";

const AvatarPic = () => {
  const user = useCurrentUser();
  return (
    <div className="rounded-full">
      <Avatar className="p-2 ">
        <AvatarImage src={user?.image || ""} className=" rounded-full" />
        <AvatarFallback className="bg-slate-700">
          <FaUser className="text-white" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default AvatarPic;
