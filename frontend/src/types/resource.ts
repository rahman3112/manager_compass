export interface ResourceNode {
  name: string;
  isFolder: boolean;
  url?: string;
  extension?: string;
  children: ResourceNode[];
}
