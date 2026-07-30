import { RoleGuard } from "@/components/common/RoleGuard";

export default function AdminLayout() {
  return <RoleGuard allowedRole="admin" />;
}
