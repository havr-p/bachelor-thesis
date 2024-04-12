interface ParentReference {
  parentId: string;
  parentRole: string;
}

export interface Requirement {
  id: string;
  level: string;
  name: string;
  statement: string;
  status?: string;
  references: ParentReference[];
}
