export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/80">
      <div className="container grid gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-lg font-black text-white">L</div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Premium</p>
              <h1 className="text-xl font-black tracking-tight">LuxeCart</h1>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">Curated essentials for everyday luxury, performance, and style.</p>
        </div>
        <div>
          <h4 className="font-bold text-slate-900">Customer service</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>Contact us</li>
            <li>Shipping info</li>
            <li>Returns</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-900">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>About</li>
            <li>Privacy policy</li>
            <li>Terms</li>
            <li>Security</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-900">Get in touch</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>hello@luxecart.com</li>
            <li>+1 (555) 352-1809</li>
            <li>24/7 support</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
