import ToggleButton from "@/app/components/buttons_custom/button-toggle";

export const TwoFactorClient = () => {
  return (
    <div className="flex flex-col gap-1">
      <div className=" text-md font-semibold">Enable 2FA</div>
      <ToggleButton />
    </div>
  );
};
