import { Badge } from "@/components/ui/badge";
import { ToolTipLabel } from "@/components/ui/tooltip";

export const OpenSeaPropertyBadge: React.FC = () => {
  return (
    <ToolTipLabel label="This property is supported on OpenSea">
      <Badge className="rounded-full text-blue-500">OpenSea</Badge>
    </ToolTipLabel>
  );
};
