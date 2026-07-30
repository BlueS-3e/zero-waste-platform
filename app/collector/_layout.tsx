import { RoleGuard } from "@/components/common/RoleGuard";

export default function CollectorLayout() {
  return <RoleGuard allowedRole="collector" />;
}
