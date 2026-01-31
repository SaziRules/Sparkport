export default function GetRewardedPage() {
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
                <h1 className="text-7xl font-extrabold! text-[#184363] text-center mt-20">Get Rewarded</h1>
              </main>
        
            </div>
    );
}