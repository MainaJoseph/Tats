"use client";

import { useCallback, useEffect } from "react";
import { CardWrapper } from "./CardWrapper";
import { useSearchParams } from "next/navigation";
import { PropagateLoader } from "react-spinners";

export const NewVerificationForm = () => {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    console.log("Token", token);
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <div className=" mt-40">
      <CardWrapper
        headerLabel="Confirm your verification"
        backButtonLabel="Back to Login"
        backButtonHref="/auth/login"
      >
        <div className="flex items-center w-full justify-center">
          <PropagateLoader />
        </div>
      </CardWrapper>
    </div>
  );
};
