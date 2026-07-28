// Landing / role router: redirects based on auth state + role
// (household -> /(household)/dashboard, collector -> /(collector)/dashboard, admin -> /(admin)/dashboard)
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
