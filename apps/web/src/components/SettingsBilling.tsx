"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingIcon from "components/LoadingIcon";
import { useAuth } from "util/auth";
import { redirectToBilling } from "util/stripe";

function SettingsBilling(props) {
  const router = useRouter();
  const auth = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.user.planIsActive) {
      // If user has an active plan then
      // take them to Stripe billing
      redirectToBilling().catch((error) => {
        setLoading(false);
        props.onStatus({
          type: "error",
          message: error.message,
        });
      });
    } else {
      // Otherwise go to pricing so they can
      // purchase a plan
      router.replace("/pricing");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading && (
        <div className="mx-auto w-7">
          <LoadingIcon />
        </div>
      )}
    </>
  );
}

export default SettingsBilling;
