import { UserAuthLogin } from "@/lib/components/ui/user-auth-login";
import Image from "next/image";
import Link from "next/link";

export default function SignUp() {
  return (
    <div className="h-[100vh] flex flex-row items-center w-full">
      <div className="bg-black p-6 relative h-full w-[90%]">
        <Image
          src={"/images/banner.jpg"}
          alt="Cover Image"
          className="h-full w-full absolute left-0 top-0 object-cover"
          width={2740}
          height={2740}
        />
        <div className="logo relative z-10 flex items-center flex-row gap-2 w-[40px] h-[40px]">
          <Image
            src={"/images/blanc-logo.png"}
            alt="Cover Image"
            className="h-[30px] w-[30px] object-cover"
            width={740}
            height={740}
          />
          <h1 className="font-light text-white text-3xl">
            blanc<span className="font-bold">Board</span>
          </h1>
        </div>
      </div>
      <div className="h-full relative w-full flex flex-col items-center justify-center bg-white">
        <Link
          className="absolute top-10 underline text-sm right-10"
          href={"./"}
        >
          I don&apos;t have an account
        </Link>

        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome Back
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your credentials below to login
              </p>
            </div>
            <UserAuthLogin />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <a
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
