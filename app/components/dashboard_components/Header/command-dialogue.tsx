import React from "react";
import { useRouter } from "next/navigation";
import {
  CalendarIcon,
  EnvelopeClosedIcon,
  GearIcon,
  PersonIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { TbTransactionYuan } from "react-icons/tb";

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
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

  const handleNavigation = (path: string) => {
    console.log(`Navigating to: ${path}`); // Debug log
    router.push(path);
    onOpenChange(false); // Close the dialog after navigation
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center py-4">
            <MagnifyingGlassIcon className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No results found.</p>
          </div>
        </CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => handleNavigation("/dashboard")}>
            <MdOutlineDashboardCustomize className="mr-2 h-4 w-4 text-blue-500" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigation("/transactions")}>
            <TbTransactionYuan className="mr-2 h-4 w-4 text-green-500" />
            <span>Transactions</span>
          </CommandItem>
          <CommandItem
            onSelect={() => handleNavigation("/transaction_report_v2")}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-purple-500" />
            <span>Detailed Transaction</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => handleNavigation("/profile")}>
            <PersonIcon className="mr-2 h-4 w-4 text-orange-500" />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigation("/mail")}>
            <EnvelopeClosedIcon className="mr-2 h-4 w-4 text-red-500" />
            <span>Mail</span>
            <CommandShortcut>⌘M</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigation("/settings")}>
            <GearIcon className="mr-2 h-4 w-4 text-gray-500" />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandDialogue;
