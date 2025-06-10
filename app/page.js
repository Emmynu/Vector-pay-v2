import Link from "next/link";


export default async function Home() {
  
  
  return (
    <section>
      <Link href={"/app"}>Go to dashboard</Link>
    </section>
  );
}
