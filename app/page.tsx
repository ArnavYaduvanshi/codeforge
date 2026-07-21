import { redirect } from "next/navigation";
import { Code2, Plus } from "lucide-react";

import { auth } from "@/auth";
import UserButton from "@/features/auth/components/user-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  const session = await auth();

  // proxy.ts already redirects signed-out visitors to /auth/sign-in before
  // this component ever renders. This check is just a defensive fallback
  // (e.g. if routes.ts is ever changed and this page becomes reachable
  // while signed out), so the page never assumes a user that isn't there.
  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  const firstName = session.user.name?.split(" ")[0];

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2 font-semibold">
          <Code2 className="h-5 w-5" />
          <span>VibeCode</span>
        </div>
        <UserButton />
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Signed in as {session.user.email}
        </p>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your playgrounds</CardTitle>
            <CardDescription>
              You don&apos;t have any playgrounds yet. Once you build that
              feature, this is where they&apos;ll show up.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button disabled>
              <Plus className="h-4 w-4" />
              Create playground
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              Placeholder button - this page exists to fix the 404 on
              &quot;/&quot; and prove sign-in works end to end. Wire it up to
              a real create-playground flow whenever you build that part.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
