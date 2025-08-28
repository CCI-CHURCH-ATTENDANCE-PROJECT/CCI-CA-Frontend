"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

// Phone input
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

// Country/state data
import { Country, State } from "country-state-city";

export default function VisitorsForm() {
  const [step, setStep] = useState(1);

  // Step 1: phone
  const [phone, setPhone] = useState("");

  // Step 2: country/state
  const countries = Country.getAllCountries();
  const [countryCode, setCountryCode] = useState<string>("");
  const [states, setStates] = useState<any[]>([]);
  const [stateCode, setStateCode] = useState<string>("");

  const handleCountryChange = (code: string) => {
    setCountryCode(code);
    setStates(State.getStatesOfCountry(code));
    setStateCode(""); // reset state when country changes
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-10">
      {/* Logo */}
      <div className="mb-6">
        <Image src="/logo.png" alt="Logo" width={80} height={80} />
      </div>

      {/* Header */}
      <h1 className="text-white uppercase tracking-wide text-sm">Form</h1>
      <h2 className="text-white font-bold text-xl mb-8 text-center">
        Visitors <span className="text-red-600">Registration</span> Form
      </h2>

      {/* Card */}
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="space-y-2">
          <Progress value={step * 33.3} className="h-2" />
          <CardTitle className="text-sm font-semibold uppercase text-red-600">
            Step {step} of 3
          </CardTitle>

          {step === 1 && (
            <>
              <h3 className="text-lg font-bold uppercase">Personal Information</h3>
              <p className="text-sm text-muted-foreground">
                Basic information about the visitor. All questions are required except stated otherwise.
              </p>
            </>
          )}
          {step === 2 && (
            <>
              <h3 className="text-lg font-bold uppercase">Address & Contact Information</h3>
              <p className="text-sm text-muted-foreground">
                Contact information about the visitor. All questions are required except stated otherwise.
              </p>
            </>
          )}
          {step === 3 && (
            <>
              <h3 className="text-lg font-bold uppercase">Follow Up</h3>
              <p className="text-sm text-muted-foreground">
                Follow-up information about the visitor. All questions are required except stated otherwise.
              </p>
            </>
          )}
        </CardHeader>

        {/* Step 1 */}
        {step === 1 && (
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <Input placeholder="Enter the visitor's first name" />
            </div>

            <div>
              <label className="text-sm font-medium">Last Name</label>
              <Input placeholder="Enter the visitor's last name" />
            </div>

            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <PhoneInput
                defaultCountry="ng"
                value={phone}
                onChange={(phone) => setPhone(phone)}
                // className="w-full "
                style={{width:"100%"}}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email Address</label>
              <Input type="email" placeholder="Enter email address" />
            </div>

            <div>
              <label className="text-sm font-medium">Profession</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="worker">Worker</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={nextStep} className="w-full bg-red-600 hover:bg-red-700">
              Next
            </Button>
          </CardContent>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Street Address</label>
              <Input placeholder="Enter the visitor's street address" />
            </div>

            <div>
              <label className="text-sm font-medium">Address Line 2</label>
              <Input placeholder="Enter address line 2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">City</label>
                <Input placeholder="Enter a city" />
              </div>
              <div>
                <label className="text-sm font-medium">State/Province/Region</label>
                <Select
                  onValueChange={(val) => setStateCode(val)}
                  disabled={!states.length}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((s) => (
                      <SelectItem key={s.isoCode} value={s.isoCode}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Zip/Postal Code</label>
                <Input placeholder="Enter postal code" />
              </div>
              <div>
                <label className="text-sm font-medium">Country</label>
                <Select onValueChange={handleCountryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.isoCode} value={c.isoCode}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Social Media Handle</label>
              <Input placeholder="e.g. IG: https://instagram.com/username" />
            </div>

            <div className="flex justify-between gap-4">
              <Button onClick={prevStep} variant="outline" className="w-1/2">
                Go Back
              </Button>
              <Button onClick={nextStep} className="w-1/2 bg-red-600 hover:bg-red-700">
                Next
              </Button>
            </div>
          </CardContent>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Would you like to enroll for the membership class?</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="no">Not yet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Would you like to join a Meet And Pray (MAP) Group?</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Yes</SelectItem>
                  <SelectItem value="option2">No</SelectItem>
                  <SelectItem value="option2">Not yet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between gap-4">
              <Button onClick={prevStep} variant="outline" className="w-1/2">
                Go Back
              </Button>
              <Button type="submit" className="w-1/2 bg-red-600 hover:bg-red-700">
                Submit
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
