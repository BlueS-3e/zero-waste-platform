import { RoleGuard } from "@/components/common/RoleGuard";

export default function HouseholdLayout() {
  return <RoleGuard allowedRole="household" />;
}
