import React from "react";
import { useRouter } from "next/navigation";
import {
  CalendarIcon,
  EnvelopeClosedIcon,
  GearIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { TbTransactionYuan } from "react-icons/tb";
import { VisuallyHidden } from "@reach/visually-hidden";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  CommandDialog,
} from "@/components/ui/command";

interface CommandDialogueProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CommandDialogue: React.FC<CommandDialogueProps> = ({
  open,
  onOpenChange,
}) => {
  const router = useRouter();

  const handleDashboardClick = () => {
    console.log("Dashboard clicked");
    router.push("/dashboard");
  };

  const handleTransactionClick = () => {
    console.log("Dashboard clicked");
    router.push("/dashboard");
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="visually-hidden">
        <h2 className="font-bold ml-4">Command Dialog</h2>
      </div>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="text-slate-800">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem
            className="cursor-pointer"
            onSelect={handleDashboardClick}
          >
            <MdOutlineDashboardCustomize className="mr-2 h-4 w-4" />
            <span className="text-slate-950">DashBoard</span>
          </CommandItem>
          <CommandItem onSelect={handleTransactionClick}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>Transaction</span>
          </CommandItem>
          <CommandItem>
            <TbTransactionYuan className="mr-2 h-4 w-4" />
            <span>Detailed Transaction</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <PersonIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <EnvelopeClosedIcon className="mr-2 h-4 w-4" />
            <span>Mail</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <GearIcon className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandDialogue;
