import { useState, useEffect } from "react";
import { X, Smartphone, LaptopMinimal } from "lucide-react";

const OpenInAppPrompt = ({ profileId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const appScheme = `xtag://profile/${profileId}`;
  const appStore = "https://apps.apple.com/app/xtag/id1234567890";
  const playStore = "https://play.google.com/store/apps/details?id=com.xtag";

  useEffect(() => {
    const hasSeenPrompt = sessionStorage.getItem("xtag_app_prompt_seen");

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile && !hasSeenPrompt) {
      setTimeout(() => {
        setIsOpen(true);
      }, 500);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("xtag_app_prompt_seen", true);
  };

  const handleContinueInBrowser = () => {
    handleClose();
  };

  const handleOpenApp = () => {
    setIsLoading(true);
    const userAgent = navigator.userAgent || navigator.vendor;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /android/i.test(userAgent);

    window.location.href = appScheme;

    let appOpened = false;
    const startTime = Date.now();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        appOpened = true;
        setIsLoading(false);
        handleClose();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const fallbackTimeout = setTimeout(() => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      const elapsedTime = Date.now() - startTime;

      if (elapsedTime < 2000 && !document.hidden && !appOpened) {
        setIsLoading(false);

        if (isAndroid) {
          window.location.href = playStore;
        } else if (isIOS) {
          window.location.href = appStore;
        } else {
          alert("The X-Tag app is available on iOS and Android devices.");
          handleClose();
        }
      } else {
        setIsLoading(false);
        handleClose();
      }
    }, 2500);

    return () => {
      clearTimeout(fallbackTimeout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      {/* Modal */}
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl animate-slide-up sm:animate-scale-in m-0 sm:m-4">
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-gray-100">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="size-5 text-gray-500" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D0A138] to-[#B8892E] rounded-xl flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Open in App?</h2>
              <p className="text-sm text-gray-500">Better experience awaits</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-600 text-center mb-6">
            Get the full X-Tag experience with faster loading, offline access,
            and exclusive features.
          </p>

          <div className="space-y-3 mb-6">
            {[
              "⚡ Faster performance",
              "📱 Native mobile experience",
              "🔔 Push notifications",
              "💾 Offline access",
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleOpenApp}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#D0A138] to-[#B8892E] text-white py-3.5 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Opening App...</span>
                </>
              ) : (
                <>
                  <Smartphone className="size-5" />
                  <span>Open X-Tag App</span>
                </>
              )}
            </button>

            <button
              onClick={handleContinueInBrowser}
              className="w-full bg-gray-100 text-gray-700 py-3.5 px-6 rounded-xl font-semibold hover:bg-gray-200 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <LaptopMinimal className="size-5" />
              <span>Continue in Browser</span>
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Don't have the app?{" "}
            <a
              href={
                /iPad|iPhone|iPod/.test(navigator.userAgent)
                  ? appStore
                  : playStore
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D0A138] font-medium hover:underline"
            >
              Download now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OpenInAppPrompt;
