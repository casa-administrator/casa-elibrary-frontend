import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import { exchangeCasaSsoCode } from "../api/casaSso";

import { useAuth } from "../contexts/AuthContext";

import { CasaSsoTransition } from "../components/auth/CasaSsoTransition";

const CASA_ADMIN_URL =
  import.meta.env.VITE_CASA_CORE_URL ?? "http://admin.casa.local";

type Status = "loading" | "success" | "error";

export default function SsoCallbackPage() {
  const navigate = useNavigate();

  const { refreshUser } = useAuth();

  const started = useRef(false);

  const [status, setStatus] = useState<Status>("loading");

  const [message, setMessage] = useState<string>();

  useEffect(() => {
    if (started.current) {
      return;
    }

    started.current = true;

    async function completeSso() {
      const params = new URLSearchParams(window.location.search);

      const code = params.get("code");

      if (!code) {
        setStatus("error");

        setMessage("The CASA authorization code is missing.");

        return;
      }

      try {
        await exchangeCasaSsoCode(code);

        const currentUser = await refreshUser();

        if (!currentUser) {
          throw new Error("Unable to load the E-Library user session.");
        }

        setStatus("success");

        setMessage("Access confirmed. Opening CASA E-Library...");

        window.setTimeout(() => {
          navigate("/library", {
            replace: true,
          });
        }, 600);
      } catch (error) {
        console.error("CASA E-Library SSO error:", error);

        setStatus("error");

        setMessage("We could not complete your CASA secure access.");
      }
    }

    void completeSso();
  }, [navigate, refreshUser]);

  return (
    <CasaSsoTransition
      serviceName="CASA E-Library"
      serviceNameKm="បណ្ណាល័យអេឡិចត្រូនិក"
      status={status}
      message={message}
      onReturn={() => {
        window.location.replace(
          `${CASA_ADMIN_URL.replace(/\/$/, "")}/dashboard`,
        );
      }}
    />
  );
}
