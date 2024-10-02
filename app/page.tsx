// import Link from "next/link";

// export default function Home() {
//   return (
//   <Link href='/blog/simulation-ideas'>simulation ideas</Link>)
// }

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/simulation-ideas');
}
