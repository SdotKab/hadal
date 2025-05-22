"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import Link from "next/link";

const SignUpPage = () => {
  return (
    <div className="h-screen flex items-center justify-between p-8">
      <div className="hidden lg:flex w-1/2 items-center justify-center">
      </div>
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <h1 className="text-2xl xsm:text-4xl md:text-6xl font-bold">
          .Hadal.
        </h1>
        <h1 className="text-2xl ">Join today.</h1>
        <SignUp.Root>
          <SignUp.Step name="start" className="flex flex-col gap-4">
            <Clerk.Connection
              name="metamask"
              className="bg-white rounded-full p-2 text-black w-72 flex items-center justify-center gap-2 font-bold"
            >
              Sign up with Metamask
            </Clerk.Connection>
            <div className="flex flex-col gap-4">
              Sign up with Credentials
              <Clerk.Field name="username" className="flex flex-col gap-2">
                <Clerk.Input
                  className="py-2 px-6 rounded-full text-black w-72 placeholder:text-sm"
                  placeholder="Username"
                />
                <Clerk.FieldError className="text-red-300 text-sm" />
              </Clerk.Field>
              <Clerk.Field name="emailAddress" className="flex flex-col gap-2">
                <Clerk.Input
                  className="py-2 px-6 rounded-full text-black w-72 placeholder:text-sm"
                  placeholder="E-mail"
                />
                <Clerk.FieldError className="text-red-300 text-sm" />
              </Clerk.Field>
              <Clerk.Field name="password" className="flex flex-col gap-2">
                <Clerk.Input
                  className="py-2 px-6 rounded-full text-black w-72 placeholder:text-sm"
                  placeholder="Password"
                />
                <Clerk.FieldError className="text-red-300 text-sm" />
              </Clerk.Field>
              <SignUp.Captcha />
              <SignUp.Action
                submit
                className="bg-iconGreen rounded-full p-2 text-white font-bold w-72 text-center "
              >
                Sign up
              </SignUp.Action>
            </div>
          </SignUp.Step>
          <SignUp.Step name="continue" className="flex flex-col gap-4">
            <Clerk.Field name="username">
              <Clerk.Input placeholder="username" className="py-2 px-6 rounded-full text-black w-72 placeholder:text-sm" />
              <Clerk.FieldError className="text-red-300 text-sm" />
            </Clerk.Field>

            <SignUp.Action submit className="w-72 text-center text-iconGreen underline">Continue</SignUp.Action>
          </SignUp.Step>
          <SignUp.Step name="verifications">
            <SignUp.Strategy name="email_code">
              <h1 className="text-sm mb-2">Check your e-mail</h1>
              <Clerk.Field name="code" className="flex flex-col gap-4">
                <Clerk.Input
                  placeholder="Verification code"
                  className="py-2 px-6 rounded-full text-black w-72 placeholder:text-sm"
                />
                <Clerk.FieldError className="text-red-300 text-sm" />
              </Clerk.Field>
              <SignUp.Action
                submit
                className="mt-2 underline text-iconGreen text-sm"
              >
                Verify
              </SignUp.Action>
            </SignUp.Strategy>
          </SignUp.Step>
          {/* OR SIGN UP */}
          <div className="w-72 flex items-center gap-4">
            <div className="h-px bg-borderGray flex-grow"></div>
            <span className="text-textGrayLight">or</span>
            <div className="h-px bg-borderGray flex-grow"></div>
          </div>
          <Link
            href="/sign-in"
            className="bg-iconGreen rounded-full p-2 text-white font-bold w-72 text-center"
          >
            Already have an account?
          </Link>
          <p className="w-72 text-xs">
            By signing up, you agree to the{" "}
            <span className="text-iconGreen">Terms of Service</span> and{" "}
            <span className="text-iconGreen">Privacy Policy</span>, including{" "}
            <span className="text-iconGreen">Cookie Use</span>.
          </p>
        </SignUp.Root>
      </div>
    </div>
  );
};

export default SignUpPage;