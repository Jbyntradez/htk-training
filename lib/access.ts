export const mockUser = {
  id: "local-preview-user",
  firstName: "Operator",
  name: "Operator Preview",
  initials: "OP",
  email: "preview@hardtokill.training"
};

export async function getAccessState() {
  return {
    user: mockUser,
    hasAccess: true,
    completedLessons: ["flexibility-mobility"]
  };
}
