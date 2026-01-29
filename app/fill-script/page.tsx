import FillYourScript from "@/components/FillYourScript";

export default function FillScriptPage() {
  return (
    <div className="relative min-h-screen">

      {/* Background image */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/heart-health.jpg')",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
      />

      {/* Overlay */}
      <div className="fixed inset-0 -z-10 bg-[#f2f2f2]/70" />

      {/* Page content */}
      <main className="relative">
        <FillYourScript />
      </main>

    </div>
  );
}
