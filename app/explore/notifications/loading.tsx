/* eslint-disable @next/next/no-img-element */

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <img
        alt="Loading"
        src={"/handshake.gif"}
        className="h-36  text-gray-500 "
      />
    </div>
  );
}
