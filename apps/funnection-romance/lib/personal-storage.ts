const PERSONAL_SUBMITTED_USER_IDS_KEY =
  "funnection-romance-personal-submitted-user-ids";

export const getPersonalSubmittedUserIds = () => {
  if (typeof window === "undefined") return [];

  const savedValue = localStorage.getItem(PERSONAL_SUBMITTED_USER_IDS_KEY);
  if (!savedValue) return [];

  try {
    const parsedValue = JSON.parse(savedValue);

    return Array.isArray(parsedValue)
      ? parsedValue.filter((id): id is number => Number.isInteger(id))
      : [];
  } catch {
    localStorage.removeItem(PERSONAL_SUBMITTED_USER_IDS_KEY);
    return [];
  }
};

export const savePersonalSubmittedUserId = (userId: number) => {
  if (typeof window === "undefined") return;

  const submittedUserIds = getPersonalSubmittedUserIds();
  const nextSubmittedUserIds = submittedUserIds.includes(userId)
    ? submittedUserIds
    : [...submittedUserIds, userId];

  localStorage.setItem(
    PERSONAL_SUBMITTED_USER_IDS_KEY,
    JSON.stringify(nextSubmittedUserIds)
  );
};
