"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
//Adding auth to the page
import { useActionState } from "react";
import { useState } from "react";
import { authenticate } from "@/actions/auth.actions";
//Adding registerUser to the page
import { registerUser } from "@/actions/user.actions";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Oval } from "react-loader-spinner";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function LoginSuspense() {
  const searchParams = useSearchParams();
  const callBackUrl = searchParams?.get("callbackUrl") || "/dashboard/";

  const [authErrorMessage, formAction, isLoginPending] = useActionState(
    authenticate,
    undefined
  );

  const [registerErrorMessage, setRegisterErrorMessage] = useState("");
  const [registerSuccessMessage, setRegisterSuccessMessage] = useState("");
  const [isRegisterPending, setIsRegisterPending] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegisterPending(true);
  
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const password = form.get("password") as string;
  
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    if (!passwordRegex.test(password)) {
      setRegisterErrorMessage(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      setIsRegisterPending(false);
      return;
    }
  
    const response = await registerUser(undefined, form);
    setIsRegisterPending(false);
  
    if (response.error) {
      setRegisterErrorMessage(response.message);
      setRegisterSuccessMessage("");
    } else {
      setRegisterErrorMessage("");
      setRegisterSuccessMessage("Registration successful!");
    }
  };

  return (
    <>
      <div id="grad">
        <div id="text" className=" flex items-center justify-center h-screen">
          <Tabs defaultValue="login" id="text" className="w-[400px] text">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger id="text" value="register">
                Register
              </TabsTrigger>
              <TabsTrigger id="text" value="login">
                Login
              </TabsTrigger>
            </TabsList>
            <TabsContent value="register">
              <form onSubmit={handleRegisterSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle id="text" className="font-bold text-xl">
                      Register
                    </CardTitle>
                    <CardDescription>
                      {" "}
                      Join us today! Create your account below.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div id="text" className="space-y-1">
                      <Label htmlFor="first">First Name</Label>
                      <Input
                        id="first"
                        placeholder="John"
                        type="input"
                        name="firstName"
                      />
                    </div>
                    <div id="text" className="space-y-1">
                      <Label htmlFor="last">Last Name</Label>
                      <Input
                        id="last"
                        placeholder="Doe"
                        type="input"
                        name="lastName"
                      />
                    </div>
                    <div id="text" className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        placeholder="Email"
                        type="email"
                        name="email"
                      />
                    </div>
                    <div id="text" className="space-y-1">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        placeholder="Password"
                        type="password"
                        name="password"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button
                      id="contrast"
                      className="drop-shadow-lg"
                      aria-disabled={isRegisterPending}
                    >
                      {isRegisterPending ? (
                        <Oval
                          height={20}
                          width={20}
                          color="#ffffff"
                          visible={true}
                          ariaLabel="oval-loading"
                          secondaryColor="#ffffff"
                          strokeWidth={2}
                          strokeWidthSecondary={2}
                        />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                    {registerErrorMessage && (
                      <>
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-500">
                          {registerErrorMessage}
                        </p>
                      </>
                    )}
                    {registerSuccessMessage && (
                      <>
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        <p className="text-sm text-green-500">
                          {registerSuccessMessage}
                        </p>
                      </>
                    )}
                  </CardFooter>
                </Card>
              </form>
            </TabsContent>
            <form action={formAction}>
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle id="text" className="font-bold text-xl">
                      Login
                    </CardTitle>
                    <CardDescription>
                      Welcome back! Please login to continue.
                    </CardDescription>
                  </CardHeader>
                  <CardContent id="text" className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        placeholder="Email"
                        type="email"
                        name="email"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        placeholder="Password"
                        type="password"
                        name="password"
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <input
                      type="hidden"
                      name="redirectTo"
                      value={callBackUrl}
                    />
                    <Button
                      id="dark-button"
                      className="drop-shadow-lg"
                      aria-disabled={isLoginPending}
                    >
                      {isLoginPending ? (
                        <Oval
                          height={20}
                          width={20}
                          color="#ffffff"
                          visible={true}
                          ariaLabel="oval-loading"
                          secondaryColor="#ffffff"
                          strokeWidth={2}
                          strokeWidthSecondary={2}
                        />
                      ) : (
                        "Login"
                      )}
                    </Button>
                    {authErrorMessage && (
                      <>
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-500">
                        Invalid Credentials
                        </p>
                      </>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>
            </form>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <LoginSuspense />
    </Suspense>
  );
}
