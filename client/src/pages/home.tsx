import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Fingerprint, ArrowRight, ShieldCheck, MessageSquare, Users, Sparkles, Lock, Globe } from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import background from "@assets/Background_1765642761559.jpg";
import logo from "@assets/Logo_1765642769982.png";

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

const WELCOME_MESSAGES: Record<string, string[]> = {
  en: [
    "Financial freedom starts with a single step. Let's take it together.",
    "Your future self will thank you for saving today.",
    "Master your money, master your life.",
    "Small daily savings add up to big dreams.",
    "Invest in yourself by tracking every penny."
  ],
  es: [
    "La libertad financiera comienza con un solo paso. Demos ese paso juntos.",
    "Tu yo del futuro te agradecerá por ahorrar hoy.",
    "Domina tu dinero, domina tu vida.",
    "Pequeños ahorros diarios suman grandes sueños.",
    "Invierte en ti mismo rastreando cada centavo."
  ],
  fr: [
    "La liberté financière commence par un seul pas. Faisons-le ensemble.",
    "Votre futur vous remerciera d'avoir économisé aujourd'hui.",
    "Maîtrisez votre argent, maîtrisez votre vie.",
    "De petites économies quotidiennes réalisent de grands rêves.",
    "Investissez en vous-même en suivant chaque centime."
  ],
  hi: [
    "आर्थिक स्वतंत्रता की शुरुआत एक कदम से होती है। आइए इसे साथ मिलकर उठाएं।",
    "आपका भविष्य आज की बचत के लिए आपको धन्यवाद देगा।",
    "अपने पैसे पर काबू पाएं, अपने जीवन पर काबू पाएं।",
    "छोटी-छोटी दैनिक बचत बड़े सपनों को पूरा करती है।",
    "हर पैसे का हिसाब रखकर खुद में निवेश करें।"
  ],
  ta: [
    "நிதி சுதந்திரம் ஒரு அடியிலிருந்து தொடங்குகிறது. அதை ஒன்றாக எடுத்து வைப்போம்.",
    "இன்று சேமிப்பதற்கு உங்கள் எதிர்காலம் உங்களுக்கு நன்றி சொல்லும்.",
    "உங்கள் பணத்தை ஆளுங்கள், உங்கள் வாழ்க்கையை ஆளுங்கள்.",
    "சிறிய தினசரி சேமிப்புகள் பெரிய கனவுகளை உருவாக்குகின்றன.",
    "ஒவ்வொரு காசையும் கண்காணிப்பதன் மூலம் உங்களில் முதலீடு செய்யுங்கள்."
  ],
  zh: [
    "财务自由始于第一步。让我们一起迈出这一步。",
    "未来的你会感谢今天储蓄的你。",
    "掌控你的金钱，掌控你的人生。",
    "每天的小积蓄汇聚成大梦想。",
    "记录每一分钱，投资你自己。"
  ],
  ar: [
    "الحرية المالية تبدأ بخطوة واحدة. لنخطوها معاً.",
    "مستقبلك سيشكرك على التوفير اليوم.",
    "تحكم في مالك، تحكم في حياتك.",
    "المدخرات اليومية الصغيرة تحقق أحلاماً كبيرة.",
    "استثمر في نفسك بتتبع كل قرش."
  ]
};

const UI_TEXT: Record<string, any> = {
  en: {
    getStarted: "Get Started",
    login: "Already have an account? Login",
    mobileTitle: "What's your number?",
    mobileDesc: "We'll send you a verification code.",
    sendOtp: "Send OTP",
    verifyTitle: "Verify it's you",
    verifyDesc: "Enter the code sent to",
    verifyLogin: "Verify & Login",
    resend: "Resend Code in 30s",
    permissionsTitle: "To serve you better",
    allowPermissions: "Allow Permissions",
    secureTitle: "Secure your account",
    secureDesc: "Setup Fingerprint or Face ID for faster login next time.",
    enableBio: "Enable Biometric",
    usePin: "Use PIN Instead",
    skip: "Skip for now",
    createPin: "Create a PIN",
    pinDesc: "Set a 4-digit PIN for quick access.",
    smsAccess: "SMS Access",
    smsDesc: "To automatically track your expenses.",
    contactAccess: "Contact Access",
    contactDesc: "To easily send money to friends.",
    bioAccess: "Biometric Access",
    bioDesc: "For secure and fast login."
  },
  es: {
    getStarted: "Empezar",
    login: "¿Ya tienes cuenta? Iniciar sesión",
    mobileTitle: "¿Cuál es tu número?",
    mobileDesc: "Te enviaremos un código de verificación.",
    sendOtp: "Enviar OTP",
    verifyTitle: "Verifica que eres tú",
    verifyDesc: "Ingresa el código enviado a",
    verifyLogin: "Verificar e Iniciar",
    resend: "Reenviar código en 30s",
    permissionsTitle: "Para servirte mejor",
    allowPermissions: "Permitir Permisos",
    secureTitle: "Asegura tu cuenta",
    secureDesc: "Configura Huella o Face ID para un acceso más rápido.",
    enableBio: "Habilitar Biometría",
    usePin: "Usar PIN",
    skip: "Saltar por ahora",
    createPin: "Crear un PIN",
    pinDesc: "Establece un PIN de 4 dígitos.",
    smsAccess: "Acceso a SMS",
    smsDesc: "Para rastrear tus gastos automáticamente.",
    contactAccess: "Acceso a Contactos",
    contactDesc: "Para enviar dinero a amigos fácilmente.",
    bioAccess: "Acceso Biométrico",
    bioDesc: "Para un inicio de sesión seguro y rápido."
  },
  // Default fallback to English for other languages for UI elements in this mockup
  fr: { getStarted: "Commencer", login: "Déjà un compte ? Connexion", mobileTitle: "Quel est votre numéro ?", mobileDesc: "Nous vous enverrons un code de vérification.", sendOtp: "Envoyer OTP", verifyTitle: "Vérifiez votre identité", verifyDesc: "Entrez le code envoyé au", verifyLogin: "Vérifier & Connexion", resend: "Renvoyer le code dans 30s", permissionsTitle: "Pour mieux vous servir", allowPermissions: "Autoriser les permissions", secureTitle: "Sécurisez votre compte", secureDesc: "Configurez l'empreinte digitale ou Face ID.", enableBio: "Activer la biométrie", usePin: "Utiliser un PIN", skip: "Passer pour l'instant", createPin: "Créer un PIN", pinDesc: "Définissez un PIN à 4 chiffres.", smsAccess: "Accès SMS", smsDesc: "Pour suivre vos dépenses automatiquement.", contactAccess: "Accès Contacts", contactDesc: "Pour envoyer de l'argent facilement.", bioAccess: "Accès Biométrique", bioDesc: "Pour une connexion sécurisée." },
  hi: { getStarted: "शुरू करें", login: "खाता है? लॉगिन करें", mobileTitle: "आपका नंबर क्या है?", mobileDesc: "हम आपको एक सत्यापन कोड भेजेंगे।", sendOtp: "OTP भेजें", verifyTitle: "सत्यापित करें", verifyDesc: "भेजा गया कोड दर्ज करें", verifyLogin: "सत्यापित करें और लॉगिन करें", resend: "30 सेकंड में कोड पुनः भेजें", permissionsTitle: "बेहतर सेवा के लिए", allowPermissions: "अनुमति दें", secureTitle: "अपना खाता सुरक्षित करें", secureDesc: "फिंगरप्रिंट या फेस आईडी सेट करें।", enableBio: "बायोमेट्रिक सक्षम करें", usePin: "पिन का उपयोग करें", skip: "अभी के लिए छोड़ें", createPin: "पिन बनाएं", pinDesc: "4 अंकों का पिन सेट करें।", smsAccess: "SMS एक्सेस", smsDesc: "खर्चों को ट्रैक करने के लिए।", contactAccess: "संपर्क एक्सेस", contactDesc: "दोस्तों को पैसे भेजने के लिए।", bioAccess: "बायोमेट्रिक एक्सेस", bioDesc: "सुरक्षित लॉगिन के लिए।" },
  ta: { getStarted: "தொடங்கவும்", login: "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையவும்", mobileTitle: "உங்கள் எண் என்ன?", mobileDesc: "நாங்கள் சரிபார்ப்புக் குறியீட்டை அனுப்புவோம்.", sendOtp: "OTP அனுப்பவும்", verifyTitle: "நீங்கள்தான் என்பதை உறுதிப்படுத்தவும்", verifyDesc: "அனுப்பப்பட்ட குறியீட்டை உள்ளிடவும்", verifyLogin: "சரிபார்த்து உள்நுழையவும்", resend: "30 வினாடிகளில் குறியீட்டை மீண்டும் அனுப்பவும்", permissionsTitle: "சிறந்த சேவைக்காக", allowPermissions: "அனுமதிகளை வழங்கவும்", secureTitle: "கணக்கை பாதுகாக்கவும்", secureDesc: "கைரேகை அல்லது முக அடையாளத்தை அமைக்கவும்.", enableBio: "பயோமெட்ரிக்கை இயக்கவும்", usePin: "PIN ஐப் பயன்படுத்தவும்", skip: "தற்போதைக்குத் தவிர்க்கவும்", createPin: "PIN ஐ உருவாக்கவும்", pinDesc: "4 இலக்க PIN ஐ அமைக்கவும்.", smsAccess: "SMS அணுகல்", smsDesc: "செலவுகளைக் கண்காணிக்க.", contactAccess: "தொடர்பு அணுகல்", contactDesc: "நண்பர்களுக்கு பணம் அனுப்ப.", bioAccess: "பயோமெட்ரிக் அணுகல்", bioDesc: "பாதுகாப்பான உள்நுழைவுக்கு." },
  zh: { getStarted: "开始", login: "已有账号？登录", mobileTitle: "您的号码是多少？", mobileDesc: "我们将发送验证码。", sendOtp: "发送验证码", verifyTitle: "验证身份", verifyDesc: "输入发送至的代码", verifyLogin: "验证并登录", resend: "30秒后重发", permissionsTitle: "为了更好地为您服务", allowPermissions: "允许权限", secureTitle: "保护您的账户", secureDesc: "设置指纹或面部识别。", enableBio: "启用生物识别", usePin: "使用 PIN", skip: "暂时跳过", createPin: "创建 PIN", pinDesc: "设置4位 PIN 码。", smsAccess: "短信权限", smsDesc: "自动追踪支出。", contactAccess: "通讯录权限", contactDesc: "轻松转账。", bioAccess: "生物识别权限", bioDesc: "安全登录。" },
  ar: { getStarted: "ابدأ الآن", login: "لديك حساب؟ تسجيل الدخول", mobileTitle: "ما هو رقم هاتفك؟", mobileDesc: "سنرسل لك رمز التحقق.", sendOtp: "إرسال الرمز", verifyTitle: "تحقق من هويتك", verifyDesc: "أدخل الرمز المرسل إلى", verifyLogin: "تحقق وتسجيل الدخول", resend: "إعادة الإرسال خلال 30 ثانية", permissionsTitle: "لخدمتكم بشكل أفضل", allowPermissions: "السماح بالأذونات", secureTitle: "أمن حسابك", secureDesc: "إعداد البصمة أو التعرف على الوجه.", enableBio: "تفعيل البصمة", usePin: "استخدام رمز PIN", skip: "تخطي الآن", createPin: "إنشاء رمز PIN", pinDesc: "تعيين رمز PIN من 4 أرقام.", smsAccess: "وصول SMS", smsDesc: "لتتبع المصاريف تلقائياً.", contactAccess: "وصول جهات الاتصال", contactDesc: "لإرسال المال للأصدقاء.", bioAccess: "وصول البصمة", bioDesc: "لتسجيل دخول آمن." }
};

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"welcome" | "mobile" | "otp" | "permissions" | "biometric-setup" | "setup-pin">("welcome");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [language, setLanguage] = useState("en");

  const t = UI_TEXT[language] || UI_TEXT['en'];

  useEffect(() => {
    // Pick a random message on mount based on language
    const messages = WELCOME_MESSAGES[language] || WELCOME_MESSAGES['en'];
    setWelcomeMessage(messages[Math.floor(Math.random() * messages.length)]);
    
    // Check if already logged in (simulated)
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const hasBiometric = localStorage.getItem("hasBiometric");
    
    if (isLoggedIn) {
      setLocation("/dashboard");
    }
  }, [setLocation, language]);

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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${background})` }}
      />
      <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-[1px]" />

      {/* Abstract Background Shapes (Optional - can remove if image is enough, but kept for depth) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-3xl z-0 mix-blend-screen opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-3xl z-0 mix-blend-screen opacity-50" />

      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-50">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-[140px] bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20">
            <Globe className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <span className="mr-2">{lang.flag}</span>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
            <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-white/20 shadow-2xl overflow-hidden p-4">
              <img src={logo} alt="KaasuTracker Logo" className="w-full h-full object-contain drop-shadow-lg" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-md">KaasuTracker</h1>
              <p className="text-xl text-gray-200 font-light leading-relaxed drop-shadow-sm">
                "{welcomeMessage}"
              </p>
            </div>

            <div className="pt-8 space-y-3">
              <Button size="lg" className="w-full h-12 text-base bg-blue-600 hover:bg-blue-500 text-white border-none shadow-lg shadow-blue-900/20" onClick={() => setStep("mobile")}>
                {t.getStarted}
              </Button>
              <Button variant="ghost" className="w-full text-gray-300 hover:text-white hover:bg-white/10">
                {t.login}
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
              <ArrowRight className={`h-4 w-4 ${language === 'ar' ? '' : 'rotate-180'} mr-2`} />
            </Button>
            
            <h2 className="text-2xl font-bold mb-2 text-white">{t.mobileTitle}</h2>
            <p className="text-gray-300 mb-8">{t.mobileDesc}</p>

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
                {t.sendOtp} <ArrowRight className={`ml-2 h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
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
              <ArrowRight className={`h-4 w-4 ${language === 'ar' ? '' : 'rotate-180'} mr-2`} />
            </Button>

            <h2 className="text-2xl font-bold mb-2 text-white">{t.verifyTitle}</h2>
            <p className="text-gray-300 mb-8">{t.verifyDesc} +91 {mobile}</p>

            <div className="flex justify-center mb-8" dir="ltr">
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
              {t.verifyLogin}
            </Button>
            
            <p className="text-center mt-4 text-sm text-gray-400 cursor-pointer hover:text-white">
              {t.resend}
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
            <h2 className="text-2xl font-bold mb-6 text-center text-white">{t.permissionsTitle}</h2>
            
            <div className="space-y-4 mb-8">
              <Card className="border-white/10 shadow-sm bg-white/5 backdrop-blur-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center">
                    <MessageSquare size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{t.smsAccess}</h4>
                    <p className="text-xs text-gray-300">{t.smsDesc}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 shadow-sm bg-white/5 backdrop-blur-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="h-10 w-10 rounded-full bg-green-500/20 text-green-300 flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{t.contactAccess}</h4>
                    <p className="text-xs text-gray-300">{t.contactDesc}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 shadow-sm bg-white/5 backdrop-blur-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="h-10 w-10 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{t.bioAccess}</h4>
                    <p className="text-xs text-gray-300">{t.bioDesc}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button onClick={handlePermissions} size="lg" className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white border-none">
              {t.allowPermissions}
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

            <h2 className="text-2xl font-bold mb-2 text-white">{t.secureTitle}</h2>
            <p className="text-gray-300 mb-8">
              {t.secureDesc}
            </p>

            <div className="space-y-3">
              <Button onClick={handleBiometricSetup} size="lg" className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white border-none">
                {t.enableBio}
              </Button>
              <Button variant="ghost" className="w-full text-gray-300 hover:text-white hover:bg-white/10" onClick={() => setStep("setup-pin")}>
                {t.usePin}
              </Button>
              <Button variant="link" className="w-full text-gray-400 hover:text-white" onClick={handleSkipBiometric}>
                {t.skip}
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

            <h2 className="text-2xl font-bold mb-2 text-white">{t.createPin}</h2>
            <p className="text-gray-300 mb-8">
              {t.pinDesc}
            </p>

            <div className="flex justify-center mb-8" dir="ltr">
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
              {t.enableBio}
            </Button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
