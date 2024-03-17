export interface Requirement {
  id: string;
  category: string;
  status?: string; // Marked as optional since some items don't have a status
  name: string;
  description: string;
}
