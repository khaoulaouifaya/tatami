export const HOURLY_RATE = 12;
export function compensationSummary(sessions, rate = HOURLY_RATE) {
  const minutes = sessions.reduce((sum, session) => sum + session.minutes, 0);
  return {
    count: sessions.length,
    minutes,
    hours: minutes / 60,
    amount: Math.round(((minutes * rate) / 60) * 100) / 100,
  };
}
export function offerSeconds(deadline, now = Date.now()) {
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}
export function canAcceptOffer(status, deadline, now = Date.now()) {
  return status === "offered" && deadline > now;
}
