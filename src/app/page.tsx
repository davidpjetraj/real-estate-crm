import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Welcome to the Real Estate Dashboard</h1>
      <p>
        Please <Link href="/login">login</Link> or register to access your
        dashboard.
      </p>
    </main>
  );
}
