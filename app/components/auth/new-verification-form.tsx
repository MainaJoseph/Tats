"use client";

import { useCallback, useEffect, useState } from "react";
import { CardWrapper } from "./CardWrapper";
import { newVerification } from "@/actions/new-verfication";
import { useSearchParams } from "next/navigation";
import { PropagateLoader } from "react-spinners";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    //break the finction if you have a success or error message
    if (success || error) return;

    // if verification does to exist break the function
    if (!token) {
      setError("Missing token");
      return;
    }
    // use the newVerification server action
    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token, success, error]);

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
        <div className="flex flex-col gap-7 items-center w-full justify-center">
          {/* show loader if no success or error message */}
          {!success && !error && <PropagateLoader />}

          <FormSuccess message={success} />

          {/* show error if there is no sucess message */}
          {!success && <FormError message={error} />}
        </div>
      </CardWrapper>
    </div>
  );
};
