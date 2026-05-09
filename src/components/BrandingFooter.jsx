export default function BrandingFooter() {
  return (
    <footer className="mt-8 py-6 border-t border-sunset-orange/10">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <img src="/explorer-fellowship/iitgn-logo.png" alt="IIT Gandhinagar" className="h-8 w-auto opacity-70"
            onError={(e) => { e.target.style.display = 'none'; }} />
          <div className="w-px h-6 bg-earth-brown/10" />
          <img src="/explorer-fellowship/fellowship-insignia.png" alt="Explorer's Fellowship" className="h-8 w-auto opacity-70"
            onError={(e) => { e.target.style.display = 'none'; }} />
        </div>
        <p className="text-xs text-iitgn-maroon/70 font-medium leading-relaxed">
          Supported by the IIT Gandhinagar<br />Student Affairs Explorer's Fellowship
        </p>
        <p className="text-[10px] text-earth-brown/30 font-mono">
          © 2026 Explorer's Fellowship
        </p>
      </div>
    </footer>
  );
}
