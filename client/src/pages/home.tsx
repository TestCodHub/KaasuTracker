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

import generatedImage from '@assets/generated_images/dark_modern_finance_background_with_glowing_graphs.png';

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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${generatedImage})` }}
      />
      <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-[1px]" />

      {/* Abstract Background Shapes (Optional - can remove if image is enough, but kept for depth) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-3xl z-0 mix-blend-screen opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-3xl z-0 mix-blend-screen opacity-50" />

      <AnimatePresence mode="wait">
        
        {/* STEP 1: WELCOME */}
        {step === "welcome" && (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md text-center space-y-8 relative z-10"
          >
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-400 border border-white/10 shadow-2xl">
              <Sparkles size={40} />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-md">FinTrack</h1>
              <p className="text-xl text-gray-200 font-light leading-relaxed drop-shadow-sm">
                "{welcomeMessage}"
              </p>
            </div>

            <div className="pt-8 space-y-3">
              <Button size="lg" className="w-full h-12 text-base bg-blue-600 hover:bg-blue-500 text-white border-none shadow-lg shadow-blue-900/20" onClick={() => setStep("mobile")}>
                Get Started
              </Button>
              <Button variant="ghost" className="w-full text-gray-300 hover:text-white hover:bg-white/10">
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
            className="w-full max-w-md relative z-10"
          >
            <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-gray-300 hover:text-white hover:bg-white/10" onClick={() => setStep("welcome")}>
              Back
            </Button>
            
            <h2 className="text-2xl font-bold mb-2 text-white">What's your number?</h2>
            <p className="text-gray-300 mb-8">We'll send you a verification code.</p>

            <form onSubmit={handleMobileSubmit} className="space-y-6">
              <div className="space-y-2">
                <Input 
                  type="tel" 
                  placeholder="Mobile Number" 
                  className="h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  maxLength={10}
                />
              </div>
              <Button type="submit" size="lg" className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white border-none">
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
            className="w-full max-w-md relative z-10"
          >
            <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-gray-300 hover:text-white hover:bg-white/10" onClick={() => setStep("mobile")}>
              Back
            </Button>

            <h2 className="text-2xl font-bold mb-2 text-white">Verify it's you</h2>
            <p className="text-gray-300 mb-8">Enter the code sent to +91 {mobile}</p>

            <div className="flex justify-center mb-8">
              <InputOTP maxLength={4} value={otp} onChange={(value) => setOtp(value)}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="h-14 w-14 text-lg bg-white/10 border-white/20 text-white" />
                  <InputOTPSlot index={1} className="h-14 w-14 text-lg bg-white/10 border-white/20 text-white" />
                  <InputOTPSlot index={2} className="h-14 w-14 text-lg bg-white/10 border-white/20 text-white" />
                  <InputOTPSlot index={3} className="h-14 w-14 text-lg bg-white/10 border-white/20 text-white" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button onClick={handleVerifyOTP} size="lg" className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white border-none" disabled={otp.length !== 4}>
              Verify & Login
            </Button>
            
            <p className="text-center mt-4 text-sm text-gray-400 cursor-pointer hover:text-white">
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
            className="w-full max-w-md relative z-10"
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-white">To serve you better</h2>
            
            <div className="space-y-4 mb-8">
              <Card className="border-white/10 shadow-sm bg-white/5 backdrop-blur-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center">
                    <MessageSquare size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">SMS Access</h4>
                    <p className="text-xs text-gray-300">To automatically track your expenses.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 shadow-sm bg-white/5 backdrop-blur-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="h-10 w-10 rounded-full bg-green-500/20 text-green-300 flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">Contact Access</h4>
                    <p className="text-xs text-gray-300">To easily send money to friends.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 shadow-sm bg-white/5 backdrop-blur-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="h-10 w-10 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">Biometric Access</h4>
                    <p className="text-xs text-gray-300">For secure and fast login.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button onClick={handlePermissions} size="lg" className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white border-none">
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
            className="w-full max-w-md text-center relative z-10"
          >
            <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-400 animate-pulse border border-white/10">
              <Fingerprint size={48} />
            </div>

            <h2 className="text-2xl font-bold mb-2 text-white">Secure your account</h2>
            <p className="text-gray-300 mb-8">
              Setup Fingerprint or Face ID for faster login next time.
            </p>

            <div className="space-y-3">
              <Button onClick={handleBiometricSetup} size="lg" className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white border-none">
                Enable Biometric
              </Button>
              <Button variant="ghost" className="w-full text-gray-300 hover:text-white hover:bg-white/10" onClick={() => setStep("setup-pin")}>
                Use PIN Instead
              </Button>
              <Button variant="link" className="w-full text-gray-400 hover:text-white" onClick={handleSkipBiometric}>
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
            className="w-full max-w-md text-center relative z-10"
          >
            <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-400 border border-white/10">
              <Lock size={48} />
            </div>

            <h2 className="text-2xl font-bold mb-2 text-white">Create a PIN</h2>
            <p className="text-gray-300 mb-8">
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
                  <InputOTPSlot index={0} className="h-14 w-14 text-lg bg-white/10 border-white/20 text-white" />
                  <InputOTPSlot index={1} className="h-14 w-14 text-lg bg-white/10 border-white/20 text-white" />
                  <InputOTPSlot index={2} className="h-14 w-14 text-lg bg-white/10 border-white/20 text-white" />
                  <InputOTPSlot index={3} className="h-14 w-14 text-lg bg-white/10 border-white/20 text-white" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button variant="ghost" className="w-full text-gray-300 hover:text-white hover:bg-white/10" onClick={() => setStep("biometric-setup")}>
              Use Biometric Instead
            </Button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
