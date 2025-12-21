import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Wallet, CheckCircle2, Star, Zap, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-cream font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sage/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-deep-teal/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none z-0" />

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
           <div className="relative w-10 h-10">
             <Image src="/assets/logo/Icon - Deep Teal.svg" alt="LevPay Logo" fill className="object-contain" />
           </div>
           <span className="text-2xl font-bold tracking-tight text-deep-teal">LevPay</span>
        </div>
        <div className="flex gap-4 items-center">
            <Button variant="ghost" asChild className="hidden md:flex text-deep-teal hover:text-deep-teal/80 hover:bg-transparent text-base font-medium">
                <Link href="/auth/login">Log In</Link>
            </Button>
            <Button asChild className="rounded-full bg-deep-teal text-white hover:bg-deep-teal/90 shadow-lg shadow-deep-teal/20 px-8 h-12 text-base">
                <Link href="/auth/register">Get Started</Link>
            </Button>
        </div>
      </nav>

      {/* Hero Background - Full Width */}
      <div className="absolute left-0 right-0 top-0 h-screen max-h-[900px] z-0">
         <Image 
            src="/images/herobg.png" 
            alt="Background" 
            fill 
            className="object-cover opacity-25 mix-blend-overlay"
         />
      </div>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4 relative z-10 max-w-5xl mx-auto mt-20 mb-32">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint-green/20 text-deep-teal font-semibold text-sm mb-8 backdrop-blur-sm border border-mint-green/30 shadow-sm animate-fade-in-up">
           <span className="w-2 h-2 rounded-full bg-deep-teal animate-pulse" />
           The Future of Payments is Here
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-deep-teal tracking-tight mb-8 leading-[1.1] animate-fade-in-up delay-100 drop-shadow-sm">
          Money moved <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-deep-teal to-sage">effortlessly.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-deep-teal/80 max-w-2xl mb-12 leading-relaxed animate-fade-in-up delay-200 font-medium">
          Experience the next generation of financial freedom. Secure, instant, and borderless transactions designed for the modern world.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center animate-fade-in-up delay-300 w-full sm:w-auto">
           <Button asChild size="lg" className="h-14 px-10 rounded-2xl bg-deep-teal text-white text-lg font-bold shadow-xl shadow-deep-teal/30 hover:scale-[1.02] transition-transform w-full sm:w-auto">
             <Link href="/auth/register">Open Account</Link>
           </Button>
           <Button variant="outline" size="lg" className="h-14 px-10 rounded-2xl bg-white/90 text-deep-teal border-gray-200 text-lg font-bold hover:bg-white shadow-lg shadow-gray-200/50 w-full sm:w-auto">
             Learn How it Works
           </Button>
        </div>

        {/* Floating Cards (Decorative) */}
        <div className="absolute top-1/2 -left-32 w-72 h-44 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl skew-y-6 hidden xl:flex items-center justify-center p-6 animate-[float_6s_ease-in-out_infinite]">
            <div className="flex items-center gap-4 w-full">
                <div className="w-12 h-12 rounded-full bg-mint-green/30 flex items-center justify-center text-deep-teal">
                    <ArrowRight className="w-6 h-6 rotate-45" />
                </div>
                <div>
                    <div className="text-sm font-medium text-gray-500">Transfer Received</div>
                    <div className="text-2xl font-bold text-deep-teal">+$1,250.00</div>
                </div>
            </div>
        </div>
        <div className="absolute top-1/3 -right-20 w-72 h-48 bg-deep-teal text-white backdrop-blur-xl rounded-2xl shadow-2xl -skew-y-3 hidden xl:flex flex-col justify-between p-8 animate-[float_8s_ease-in-out_infinite_1s]">
            <div className="flex justify-between items-start">
               <div className="text-white/80 text-sm font-medium">Current Balance</div>
               <Wallet className="w-6 h-6 text-mint-green" />
            </div>
            <div>
               <div className="text-4xl font-bold">$24,500.80</div>
               <div className="text-xs text-white/60 mt-2 flex items-center gap-1">
                 <span className="w-2 h-2 rounded-full bg-mint-green"></span>
                 Updated just now
               </div>
            </div>
        </div>
      </main>

       {/* Trusted By Section */}
       <section className="py-12 border-y border-deep-teal/5 bg-white/30 backdrop-blur-sm mb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm font-bold text-deep-teal/50 uppercase tracking-widest mb-8">Trusted by industry leaders</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {["Acme Corp", "Global Bank", "Stripe", "Visa", "TechFlow"].map((brand) => (
                    <span key={brand} className="text-2xl font-bold text-deep-teal/80">{brand}</span>
                ))}
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 mb-32 relative z-10">
        <div className="text-center mb-16">
             <h2 className="text-4xl font-bold text-deep-teal mb-4">Why Global Leaders Choose LevPay</h2>
             <p className="text-xl text-gray-600 max-w-2xl mx-auto">We've reimagined the financial stack to render the boundaries between traditional banking and modern fintech invisible.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
            {[
                { title: "Instant Global Transfers", desc: "Send money currently to over 140 countries with real-time settlement and zero hidden fees.", icon: Zap },
                { title: "Bank-Grade Security", desc: "Your assets are protected by military-grade encryption, biometric auth, and 24/7 fraud monitoring.", icon: Shield },
                { title: "Smart Multi-Currency", desc: "Hold, convert, and spend in 30+ currencies with intelligent routing for the best exchange rates.", icon: Globe },
            ].map((feature, i) => (
                <Card key={i} className="border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 bg-white/80 backdrop-blur-lg">
                    <CardHeader>
                        <div className="w-14 h-14 rounded-2xl bg-mint-green/20 flex items-center justify-center mb-4 text-deep-teal">
                            <feature.icon className="w-7 h-7" />
                        </div>
                        <CardTitle className="text-2xl text-deep-teal">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-base text-gray-600 leading-relaxed font-medium">
                            {feature.desc}
                        </CardDescription>
                    </CardContent>
                </Card>
            ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-deep-teal text-white relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
         <div className="max-w-7xl mx-auto px-6 relative z-10">
             <div className="grid lg:grid-cols-2 gap-16 items-center">
                 <div>
                     <h2 className="text-4xl md:text-5xl font-bold mb-6">Get started in minutes, not days.</h2>
                     <p className="text-xl text-white/80 mb-12">No paperwork, no branch visits. Just download the app and start transacting immediately.</p>
                     
                     <div className="space-y-8">
                         {[
                             { title: "Create your account", desc: "Sign up with just your email and basic details." },
                             { title: "Verify instantly", desc: "Our AI-powered KYC verifies your identity in seconds." },
                             { title: "Start transacting", desc: "Add funds and send money globally with a single tap." }
                         ].map((step, i) => (
                             <div key={i} className="flex gap-6">
                                 <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-mint-green flex items-center justify-center font-bold text-mint-green text-xl">
                                     {i + 1}
                                 </div>
                                 <div>
                                     <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                     <p className="text-white/70">{step.desc}</p>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
                 {/* Visual Placeholder for App Mockup */}
                 <div className="relative h-[600px] w-full rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                      <Image 
                        src="/images/app_mockup.png" 
                        alt="Mobile App Interface" 
                        fill 
                        className="object-cover"
                      />
                      {/* Overlay gradient for better text readability overlap if necessary */}
                      <div className="absolute inset-0 bg-gradient-to-t from-deep-teal/40 to-transparent pointer-events-none"></div>
                 </div>
             </div>
         </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative z-10">
           <h2 className="text-4xl font-bold text-deep-teal text-center mb-16">Loved by thousands</h2>
           <div className="grid md:grid-cols-3 gap-8">
               {[
                   { name: "Sarah J.", role: "Freelance Designer", text: "LevPay changed how I receive payments from international clients. It's incredibly fast.", rating: 5 },
                   { name: "Michael Chen", role: "Startup Founder", text: "The API is a dream to work with. We integrated payouts in less than a day.", rating: 5 },
                   { name: "Elena R.", role: "Digital Nomad", text: "Secure, reliable, and the fees are transparent. Best financial app I've used.", rating: 5 }
               ].map((review, i) => (
                   <Card key={i} className="bg-white border-0 shadow-lg p-6">
                       <CardContent className="pt-6">
                           <div className="flex gap-1 mb-4">
                               {[...Array(review.rating)].map((_, j) => (
                                   <Star key={j} className="w-5 h-5 fill-mint-green text-mint-green" />
                               ))}
                           </div>
                           <p className="text-gray-600 mb-6 italic">"{review.text}"</p>
                           <div>
                               <div className="font-bold text-deep-teal">{review.name}</div>
                               <div className="text-sm text-gray-500">{review.role}</div>
                           </div>
                       </CardContent>
                   </Card>
               ))}
           </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-sage/20 relative z-10">
          <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-5xl font-bold text-deep-teal mb-8">Ready to take control?</h2>
              <p className="text-xl text-deep-teal/70 mb-12">Join over 50,000 users who trust LevPay for their daily financial needs.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button asChild size="lg" className="h-16 px-12 rounded-2xl bg-deep-teal text-white text-xl font-bold hover:bg-deep-teal/90 shadow-2xl">
                    <Link href="/auth/register">Create Free Account</Link>
                  </Button>
              </div>
          </div>
      </section>
    </div>
  );
}
