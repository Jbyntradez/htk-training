export const mockUser = {
  id: "local-preview-user",
  firstName: "Jimmy",
  name: "Jimmy Bynum",
  initials: "JB",
  email: "jimmy@htktrainingco.com"
};

export async function getAccessState() {
  return {
    user: mockUser,
    hasAccess: true,
    completedLessons: ["flexibility-mobility"]
  };
}
