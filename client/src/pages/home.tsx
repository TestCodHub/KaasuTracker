import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Fingerprint, ArrowRight, ShieldCheck, MessageSquare, Users, Sparkles, Lock } from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const WELCOME_MESSAGES = [
  "Financial freedom starts with a single step. Let's take it together.",
  "Your future self will thank you for saving today.",
  "Master your money, master your life.",
  "Small daily savings add up to big dreams.",
  "Invest in yourself by tracking every penny."
];

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"welcome" | "mobile" | "otp" | "permissions" | "biometric-setup" | "setup-pin">("welcome");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");

  useEffect(() => {
    // Pick a random message on mount
    setWelcomeMessage(WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)]);
    
    // Check if already logged in (simulated)
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const hasBiometric = localStorage.getItem("hasBiometric");
    
    if (isLoggedIn) {
      if (hasBiometric) {
        // If they have biometric set up, maybe show a quick biometric prompt
        // For now, we'll just redirect to dashboard for simplicity in this flow, 
        // or we could show a "Unlock with PIN" screen.
        // Let's assume for this mockup we auto-redirect if "remembered"
         setLocation("/dashboard");
      } else {
         setLocation("/dashboard");
      }
    }
  }, [setLocation]);

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      toast({ title: "Invalid Number", description: "Please enter a valid 10-digit mobile number.", variant: "destructive" });
      return;
    }
    setStep("otp");
    toast({ title: "OTP Sent", description: "Use 1234 to login." });
  };

  const handleVerifyOTP = () => {
    if (otp === "1234") {
      setStep("permissions");
    } else {
      toast({ title: "Invalid OTP", description: "Please enter correct OTP.", variant: "destructive" });
    }
  };

  const handlePermissions = () => {
    // Simulate requesting permissions
    toast({ title: "Permissions Granted", description: "Thank you for trusting us." });
    setStep("biometric-setup");
  };

  const handleBiometricSetup = () => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("hasBiometric", "true");
    toast({ title: "Setup Complete", description: "Biometric login enabled." });
    setLocation("/dashboard");
  };

  const handleSkipBiometric = () => {
    localStorage.setItem("isLoggedIn", "true");
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-3xl -z-10" />

      <AnimatePresence mode="wait">
        
        {/* STEP 1: WELCOME */}
        {step === "welcome" && (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md text-center space-y-8"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
              <Sparkles size={40} />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">FinTrack</h1>
              <p className="text-xl text-muted-foreground font-light leading-relaxed">
                "{welcomeMessage}"
              </p>
            </div>

            <div className="pt-8 space-y-3">
              <Button size="lg" className="w-full h-12 text-base" onClick={() => setStep("mobile")}>
                Get Started
              </Button>
              <Button variant="ghost" className="w-full">
                Already have an account? Login
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: MOBILE NUMBER */}
        {step === "mobile" && (
          <motion.div 
            key="mobile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-md"
          >
            <Button variant="ghost" size="sm" className="mb-6 -ml-2" onClick={() => setStep("welcome")}>
              Back
            </Button>
            
            <h2 className="text-2xl font-bold mb-2">What's your number?</h2>
            <p className="text-muted-foreground mb-8">We'll send you a verification code.</p>

            <form onSubmit={handleMobileSubmit} className="space-y-6">
              <div className="space-y-2">
                <Input 
                  type="tel" 
                  placeholder="Mobile Number" 
                  className="h-14 text-lg bg-card"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  maxLength={10}
                />
              </div>
              <Button type="submit" size="lg" className="w-full h-12">
                Send OTP <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}

        {/* STEP 3: OTP */}
        {step === "otp" && (
          <motion.div 
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-md"
          >
            <Button variant="ghost" size="sm" className="mb-6 -ml-2" onClick={() => setStep("mobile")}>
              Back
            </Button>

            <h2 className="text-2xl font-bold mb-2">Verify it's you</h2>
            <p className="text-muted-foreground mb-8">Enter the code sent to +91 {mobile}</p>

            <div className="flex justify-center mb-8">
              <InputOTP maxLength={4} value={otp} onChange={(value) => setOtp(value)}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="h-14 w-14 text-lg" />
                  <InputOTPSlot index={1} className="h-14 w-14 text-lg" />
                  <InputOTPSlot index={2} className="h-14 w-14 text-lg" />
                  <InputOTPSlot index={3} className="h-14 w-14 text-lg" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button onClick={handleVerifyOTP} size="lg" className="w-full h-12" disabled={otp.length !== 4}>
              Verify & Login
            </Button>
            
            <p className="text-center mt-4 text-sm text-muted-foreground cursor-pointer hover:text-primary">
              Resend Code in 30s
            </p>
          </motion.div>
        )}

        {/* STEP 4: PERMISSIONS */}
        {step === "permissions" && (
          <motion.div 
            key="permissions"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">To serve you better</h2>
            
            <div className="space-y-4 mb-8">
              <Card className="border-none shadow-sm bg-secondary/50">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 flex items-center justify-center">
                    <MessageSquare size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">SMS Access</h4>
                    <p className="text-xs text-muted-foreground">To automatically track your expenses.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-secondary/50">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Contact Access</h4>
                    <p className="text-xs text-muted-foreground">To easily send money to friends.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-secondary/50">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-200 flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Biometric Access</h4>
                    <p className="text-xs text-muted-foreground">For secure and fast login.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button onClick={handlePermissions} size="lg" className="w-full h-12">
              Allow Permissions
            </Button>
          </motion.div>
        )}

        {/* STEP 5: BIOMETRIC SETUP */}
        {step === "biometric-setup" && (
          <motion.div 
            key="biometric"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-md text-center"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 text-primary animate-pulse">
              <Fingerprint size={48} />
            </div>

            <h2 className="text-2xl font-bold mb-2">Secure your account</h2>
            <p className="text-muted-foreground mb-8">
              Setup Fingerprint or Face ID for faster login next time.
            </p>

            <div className="space-y-3">
              <Button onClick={handleBiometricSetup} size="lg" className="w-full h-12">
                Enable Biometric
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setStep("setup-pin")}>
                Use PIN Instead
              </Button>
              <Button variant="link" className="w-full text-muted-foreground" onClick={handleSkipBiometric}>
                Skip for now
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 5b: PIN SETUP (Alternative) */}
         {step === "setup-pin" && (
          <motion.div 
            key="setup-pin"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-md text-center"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 text-primary">
              <Lock size={48} />
            </div>

            <h2 className="text-2xl font-bold mb-2">Create a PIN</h2>
            <p className="text-muted-foreground mb-8">
              Set a 4-digit PIN for quick access.
            </p>

            <div className="flex justify-center mb-8">
              <InputOTP maxLength={4} onChange={(val) => {
                 if(val.length === 4) {
                    toast({ title: "PIN Set", description: "Your PIN has been secured." });
                    handleBiometricSetup(); // Reuse completion logic
                 }
              }}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="h-14 w-14 text-lg" />
                  <InputOTPSlot index={1} className="h-14 w-14 text-lg" />
                  <InputOTPSlot index={2} className="h-14 w-14 text-lg" />
                  <InputOTPSlot index={3} className="h-14 w-14 text-lg" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button variant="ghost" className="w-full" onClick={() => setStep("biometric-setup")}>
              Use Biometric Instead
            </Button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
