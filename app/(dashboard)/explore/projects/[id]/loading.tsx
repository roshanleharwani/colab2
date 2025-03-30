/* eslint-disable @next/next/no-img-element */
"use client";
import { ThreeDots } from "react-loader-spinner";
import { useTheme } from "next-themes";
export default function Loading() {
  const { theme } = useTheme();
  return (
    <div className="flex justify-center items-center h-full w-full">
      <ThreeDots
        visible={true}
        height="80"
        width="80"
        color={theme === "dark" ? "#fff" : "#000"}
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}
