
import { GuidanceForm } from "@/components/guidance/guidance-form";

export default function GuidancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-fuchsia-500 bg-[length:200%_200%] animate-gradient-shift">AI Financial Advisor</h1>
        <p className="text-muted-foreground">
          Get personalized advice on loans, business, and investments.
        </p>
      </div>
      <GuidanceForm />
    </div>
  );
}
