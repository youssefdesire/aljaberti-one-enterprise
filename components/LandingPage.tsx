
import React from 'react';
import { ArrowRight, CheckCircle, BarChart2, Users, Layers, ShieldCheck, Globe, Briefcase, ChevronRight, Star, Building } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/30">
                A1
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">Aljaberti ONE</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#features" className="hover:text-brand-600 transition-colors">Features</a>
              <a href="#solutions" className="hover:text-brand-600 transition-colors">Solutions</a>
              <a href="#testimonials" className="hover:text-brand-600 transition-colors">Success Stories</a>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={onLoginClick}
                className="text-sm font-bold text-slate-600 hover:text-brand-600 transition-colors hidden sm:block"
              >
                Log In
              </button>
              <button 
                onClick={onLoginClick}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-bold shadow-md shadow-brand-500/20 transition-all hover:scale-105"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-200/30 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1 mb-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">v2.0 Now Live</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Unified Management for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">Project Services</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Seamlessly integrate Projects, Finance, HR, and Operations into a single, intelligent cloud platform designed for modern enterprises.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <button 
                onClick={onLoginClick}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-lg shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Access Portal <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-lg shadow-sm transition-all hover:-translate-y-1">
              Request Demo
            </button>
          </div>

          {/* Hero Image Mockup */}
          <div className="mt-20 relative mx-auto max-w-5xl">
             <div className="bg-slate-900 rounded-2xl p-2 shadow-2xl border border-slate-800 animate-in fade-in zoom-in duration-1000 delay-500">
                 <div className="bg-slate-800 rounded-xl overflow-hidden aspect-[16/9] relative">
                     {/* Abstract Dashboard Representation */}
                     <div className="absolute inset-0 bg-slate-900 flex">
                        {/* Sidebar */}
                        <div className="w-64 bg-slate-800 border-r border-slate-700 p-4 hidden md:block">
                            <div className="space-y-4">
                                <div className="h-8 w-8 bg-brand-600 rounded-lg"></div>
                                <div className="space-y-2 mt-8">
                                    {[1,2,3,4,5].map(i => <div key={i} className="h-8 w-full bg-slate-700/50 rounded-lg"></div>)}
                                </div>
                            </div>
                        </div>
                        {/* Content */}
                        <div className="flex-1 p-6 bg-slate-50">
                            <div className="flex justify-between mb-6">
                                <div className="h-8 w-48 bg-white rounded-lg shadow-sm"></div>
                                <div className="h-8 w-8 bg-white rounded-full shadow-sm"></div>
                            </div>
                            <div className="grid grid-cols-3 gap-6 mb-6">
                                <div className="h-32 bg-white rounded-xl shadow-sm"></div>
                                <div className="h-32 bg-white rounded-xl shadow-sm"></div>
                                <div className="h-32 bg-white rounded-xl shadow-sm"></div>
                            </div>
                            <div className="flex gap-6 h-64">
                                <div className="flex-1 bg-white rounded-xl shadow-sm"></div>
                                <div className="w-1/3 bg-white rounded-xl shadow-sm"></div>
                            </div>
                        </div>
                     </div>
                     <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                        <p className="text-white/50 font-bold text-xl uppercase tracking-[0.5em]">Enterprise Dashboard</p>
                     </div>
                 </div>
             </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-brand-600 font-bold tracking-wide uppercase text-sm mb-2">Integrated Modules</h2>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to run your business</h3>
                <p className="text-slate-500 text-lg">Aljaberti ONE replaces disconnected tools with a single, cohesive operating system.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { icon: Briefcase, title: 'Project Management', desc: 'Track progress, manage risks, and ensure budget adherence for all your sites.' },
                    { icon: BarChart2, title: 'Finance & Accounting', desc: 'Real-time cash flow, automated invoicing, and VAT compliance built-in.' },
                    { icon: Users, title: 'HR & Payroll', desc: 'Manage your workforce, attendance, and WPS payroll from a single dashboard.' },
                    { icon: Layers, title: 'Inventory Control', desc: 'Monitor stock levels, manage warehouses, and automate procurement.' },
                    { icon: Globe, title: 'CRM & Sales', desc: 'Convert leads to deals and manage client relationships effectively.' },
                    { icon: ShieldCheck, title: 'Operations Log', desc: 'Daily site reporting, fleet management, and safety compliance tracking.' },
                ].map((feature, idx) => (
                    <div key={idx} className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300">
                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-brand-600 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                            <feature.icon className="w-7 h-7" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                        <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                        <div className="mt-6 flex items-center text-brand-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                            Learn more <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Solutions Section */}
      <div id="solutions" className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2">
                    <h2 className="text-brand-600 font-bold tracking-wide uppercase text-sm mb-2">Tailored Solutions</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Designed for Construction & Project Services</h3>
                    <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                        Unlike generic ERPs, Aljaberti ONE is built with the specific needs of project-based businesses in mind. Manage site operations, track fleet maintenance, and handle complex project accounting without the headache.
                    </p>
                    <ul className="space-y-4">
                        {[
                            "Real-time Site-to-Office Sync",
                            "Automated WPS Payroll Generation",
                            "Asset & Fleet Lifecycle Management",
                            "Integrated CRM & Quotation Engine"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-slate-800">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="lg:w-1/2 relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-brand-600 to-purple-600 rounded-2xl opacity-20 blur-2xl"></div>
                    <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl p-6">
                        {/* Mock UI Element */}
                        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-3">
                                <Building className="w-10 h-10 text-slate-400 bg-slate-100 p-2 rounded-lg" />
                                <div>
                                    <div className="h-4 w-32 bg-slate-200 rounded mb-1"></div>
                                    <div className="h-3 w-20 bg-slate-100 rounded"></div>
                                </div>
                            </div>
                            <div className="h-8 w-24 bg-brand-600 rounded-lg"></div>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200"></div>
                                        <div className="h-3 w-24 bg-slate-200 rounded"></div>
                                    </div>
                                    <div className="h-3 w-12 bg-slate-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex gap-4">
                            <div className="flex-1 h-32 bg-slate-100 rounded-xl"></div>
                            <div className="flex-1 h-32 bg-slate-100 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                  <div>
                      <div className="text-4xl md:text-5xl font-bold text-brand-400 mb-2">500+</div>
                      <div className="text-slate-400 font-medium">Projects Managed</div>
                  </div>
                  <div>
                      <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">AED 1.2B</div>
                      <div className="text-slate-400 font-medium">Transaction Volume</div>
                  </div>
                  <div>
                      <div className="text-4xl md:text-5xl font-bold text-emerald-400 mb-2">12k</div>
                      <div className="text-slate-400 font-medium">Active Users</div>
                  </div>
                  <div>
                      <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">99.9%</div>
                      <div className="text-slate-400 font-medium">System Uptime</div>
                  </div>
              </div>
          </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-brand-600 font-bold tracking-wide uppercase text-sm mb-2">Success Stories</h2>
                  <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Trusted by Industry Leaders</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                      {
                          quote: "Aljaberti ONE has completely revolutionized how we handle our site logistics. The real-time tracking is a game changer.",
                          author: "Khalid Al-Futtaim",
                          role: "Operations Director",
                          company: "BuildCo UAE"
                      },
                      {
                          quote: "The integration between HR and Payroll saved us days of manual work every month. WPS compliance is now automatic.",
                          author: "Sarah Jenkins",
                          role: "HR Manager",
                          company: "Global Tech Services"
                      },
                      {
                          quote: "A truly unified platform. Having our financials linked directly to project milestones gives us incredible visibility.",
                          author: "Omar Farooq",
                          role: "CFO",
                          company: "Prime Constructions"
                      }
                  ].map((t, i) => (
                      <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative">
                          <div className="absolute top-8 left-8 text-brand-200">
                              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" /></svg>
                          </div>
                          <p className="text-slate-700 italic mb-6 relative z-10 pt-8">"{t.quote}"</p>
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold">
                                  {t.author.charAt(0)}
                              </div>
                              <div>
                                  <p className="font-bold text-slate-900 text-sm">{t.author}</p>
                                  <p className="text-xs text-slate-500">{t.role}, {t.company}</p>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-white text-center">
          <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Ready to transform your operations?</h2>
              <p className="text-xl text-slate-500 mb-10">Join leading project management firms who trust Aljaberti ONE.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button 
                    onClick={onLoginClick}
                    className="px-8 py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-700 shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-1"
                  >
                      Get Started Now
                  </button>
                  <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
                      Contact Sales
                  </button>
              </div>
          </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-white font-bold text-xs">
                    A1
                  </div>
                  <span className="font-bold text-slate-700">Aljaberti ONE</span>
              </div>
              <div className="text-sm text-slate-500">
                  &copy; {new Date().getFullYear()} Aljaberti Group. All rights reserved.
              </div>
              <div className="flex gap-6 text-sm font-medium text-slate-600">
                  <a href="#" className="hover:text-brand-600">Privacy</a>
                  <a href="#" className="hover:text-brand-600">Terms</a>
                  <a href="#" className="hover:text-brand-600">Support</a>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;
