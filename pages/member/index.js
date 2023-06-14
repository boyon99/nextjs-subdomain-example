import React from 'react'
import { useRouter } from 'next/router';

export default function Member() {
  const router = useRouter();
  const { subdomain } = router.query;


  return <div>Member: {subdomain}</div>
}
