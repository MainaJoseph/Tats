import React from "react";
import {
  CalendarIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
  PersonIcon,
  RocketIcon,
} from "@radix-ui/react-icons";

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
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { TbTransactionYuan } from "react-icons/tb";

interface CommandDialogueProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CommandDialogue: React.FC<CommandDialogueProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="text-slate-800">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <MdOutlineDashboardCustomize className="mr-2 h-4 w-4" />
            <span className="text-slate-950">DashBoard</span>
          </CommandItem>
          <CommandItem>
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
