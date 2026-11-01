import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { canAcceptOffer, offerSeconds } from "../utils/sessionRules.mjs";

// Local preview only. Production transitions and expires_at must come from the API.
// Owned by the session screen so closing the viewer cannot reset an offer's deadline.
export default function useWaitlist() {
  const [status, setStatus] = useState("idle");
  const [deadline, setDeadline] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (status !== "offered") return;
    const tick = () => {
      const timestamp = Date.now();
      setNow(timestamp);
      if (timestamp >= deadline) setStatus("expired");
    };
    const timer = setInterval(tick, 1000);
    const subscription = AppState.addEventListener("change", (next) => {
      if (next === "active") tick();
    });
    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, [status, deadline]);
  function offer(seconds = 900) {
    const timestamp = Date.now();
    setNow(timestamp);
    setDeadline(timestamp + seconds * 1000);
    setStatus("offered");
  }
  function confirm() {
    const timestamp = Date.now();
    setNow(timestamp);
    if (!canAcceptOffer(status, deadline, timestamp)) {
      if (status === "offered") setStatus("expired");
      return false;
    }
    setStatus("confirmed");
    return true;
  }
  const remaining = offerSeconds(deadline, now);
  return {
    status: status === "offered" && !remaining ? "expired" : status,
    remaining,
    offer,
    confirm,
    changeStatus: setStatus,
  };
}
