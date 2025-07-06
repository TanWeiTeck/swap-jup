import { Button } from '@repo/ui/components/button';

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <Button>this is a button</Button>
      <Button variant="destructive">this is a button</Button>
      <Button variant="outline">this is a button</Button>
      <Button variant="secondary">this is a button</Button>
      <Button variant="ghost">this is a button</Button>
      <Button variant="link">this is a button</Button>
    </main>
  );
}
