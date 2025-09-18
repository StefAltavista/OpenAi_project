import Image from "next/image";

export default function Header() {
  return (
    <div className="h-full w-[98%] flex justify-center items-center p-4 relative">
      <Image
        src="/avatars/cameriere-bot.png"
        alt="Logo"
        width={50}
        height={50}
        className="left-2 absolute"
      />
      <h1 className="text-red-500 text-2xl">Summer Camp Bistrò</h1>
    </div>
  );
}
