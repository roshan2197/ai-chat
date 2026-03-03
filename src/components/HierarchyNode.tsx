import { useEffect, useState } from "react";

export interface TreeNode {
  id: string;
  label: string;
  isExpanded?: boolean;
  children?: TreeNode[];
}

export default function HierarchyNode({
  nodes,
  onSelect,
  path = [],
}: {
  nodes: TreeNode[];
  onSelect?: (path: TreeNode[]) => void;
  path?: TreeNode[];
}) {
  const [localNodes, setLocalNodes] = useState<TreeNode[]>(nodes);

  useEffect(() => {
    setLocalNodes(nodes);
  }, [nodes]);

  const toggleChildren = (node: TreeNode) => {
    setLocalNodes((prev) =>
      prev.map((item) =>
        item.id === node.id ? { ...item, isExpanded: !item.isExpanded } : item,
      ),
    );
  };

  return (
    <div className="ml-4 select-none">
      {localNodes?.map((node) => {
        const currentPath = [...path, node];

        return (
          <div className="flex flex-col" key={node.id}>
            <div
              className="py-1 cursor-pointer hover:bg-gray-100 rounded flex flex-row items-center"
              onClick={() => onSelect?.(currentPath)}>
              {node.children && (
                <span
                  className="text-xs"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleChildren(node);
                  }}>
                  {node.isExpanded ? "v " : "> "}
                </span>
              )}
              <span>{node.label}</span>
            </div>

            {node.isExpanded &&
              node.children?.map((child) => (
                <HierarchyNode
                  key={child.id}
                  nodes={[child]}
                  onSelect={onSelect}
                  path={currentPath}
                />
              ))}
          </div>
        );
      })}
    </div>
  );
}
