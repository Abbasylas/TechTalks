import OrderDashboard from "@/components/OrderDashboard";

// Keep the route as a Server Component and isolate browser interactivity below it.
export default function HomePage() {
  return <OrderDashboard />;
}
