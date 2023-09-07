import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
    return (
        <Link href="/" className="block" aria-label="@replai">
            <Image src="/logo.svg" height={120} width={120} />
        </Link>
    );
}
