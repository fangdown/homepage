export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-text-muted text-sm text-center">
          © {new Date().getFullYear()} Fangdu. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
