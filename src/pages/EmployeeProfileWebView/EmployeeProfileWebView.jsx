import {
  appStore,
  cover,
  cube,
  googlePlay,
  logo_sidebar_footer,
  noAvatar,
  sidebar_Logo,
} from "@/shared/images";
import {
  btnClasses,
  currentLink,
  envelopeIcon,
  iconClasses,
  imgUrl,
  locationIcon,
  phoneIcon,
  profileData,
  secondary,
  shadowColor,
  socialLinks,
} from "./staticData.jsx";
import {
  Copy,
  LangSwitcher,
  MainModal,
  QrCodeTemplate,
  Building2,
  Share2,
  ScanQrCode,
  PlusCircle,
} from "@/shared/components";
import { useState, useTranslation, useEffect } from "@/shared/hooks";
import { Link } from "@/shared/wrappers.jsx";
import { toast } from "@/shared/constants.jsx";
import Attachments from "./Attachments.jsx";

const notifySuccess = (msg) => toast.success(msg);
const notifyError = (msg) => toast.error(msg);

const EmployeeProfileWebView = () => {
  const [canShare, setCanShare] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showShareProfileModal, setShowShareProfileModal] = useState(false);
  // const { id } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.share) {
      setCanShare(true);
    }
  }, []);

  const getBase64Image = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Failed to convert image:", error);
      return null;
    }
  };

  const generateVCard = async () => {
    let photoBase64 = "";

    try {
      photoBase64 = await getBase64Image(profileData.photo);
    } catch (error) {
      console.log("Could not embed photo in vCard", error);
    }

    let vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${profileData.firstName} ${profileData.lastName}
N:${profileData.lastName};${profileData.firstName};;;
TEL;TYPE=CELL:${profileData.phone}
EMAIL;TYPE=INTERNET:${profileData.email}
ADR;TYPE=WORK:;;${profileData.address};;;;
ORG:${profileData.company}
TITLE:${profileData.title}`;

    if (photoBase64) {
      vCardData += `\nPHOTO;ENCODING=b;TYPE=JPEG:${photoBase64}`;
    } else {
      vCardData += `\nPHOTO;VALUE=URL:${profileData.photo}`;
    }

    if (profileData.xTagLink) {
      vCardData += `\nURL;TYPE=xTag:${profileData.xTagLink}`;
    }

    // Alternative approach with better iOS support
    let itemIndex = 1;
    socialLinks.forEach((link) => {
      vCardData += `\nitem${itemIndex}.URL:${link.url}`;
      vCardData += `\nitem${itemIndex}.X-ABLabel:${link.name}`;
      itemIndex++;
    });

    // Add NOTE for older contact systems
    const socialLinksText = [
      ...(profileData.xTagLink
        ? [`xTag Profile: ${profileData.xTagLink}`]
        : []),
      ...socialLinks.map((link) => `${link.name}: ${link.url}`),
    ].join("\\n");

    vCardData += `\nNOTE:Links:\\n${socialLinksText}`;
    vCardData += `\nEND:VCARD`;

    return vCardData;
  };

  // const handleDownloadContact = async () => {
  //   try {
  //     const vCardData = await generateVCard();

  //     const isMobile =
  //       /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  //         navigator.userAgent
  //       );

  //     if (isMobile) {
  //       const encodedVCard = encodeURIComponent(vCardData);
  //       const dataUri = `data:text/vcard;charset=utf-8,${encodedVCard}`;

  //       const tempLink = document.createElement("a");
  //       tempLink.href = dataUri;
  //       tempLink.download = `${profileData.firstName}_${profileData.lastName}.vcf`;
  //       tempLink.style.display = "none";

  //       document.body.appendChild(tempLink);
  //       tempLink.click();
  //       document.body.removeChild(tempLink);

  //       notifySuccess(t("contactFileGenerated"));
  //     } else {
  //       const blob = new Blob([vCardData], {
  //         type: "text/vcard;charset=utf-8",
  //       });
  //       const url = URL.createObjectURL(blob);

  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.download = `${profileData.firstName}_${profileData.lastName}.vcf`;
  //       link.click();

  //       URL.revokeObjectURL(url);
  //       notifySuccess(t("contactFileDownloaded"));
  //     }
  //   } catch (error) {
  //     console.error("Download failed:", error);
  //     notifyError(t("failedToDownloadContact"));
  //   }
  // };

  const handleOpenInContacts = async () => {
    try {
      const vCardData = await generateVCard();

      const blob = new Blob([vCardData], { type: "text/vcard" });
      const url = URL.createObjectURL(blob);

      const tempLink = document.createElement("a");
      tempLink.href = url;
      tempLink.download = `${profileData.firstName}_${profileData.lastName}.vcf`;

      // For iOS, this will prompt to add to contacts
      // For Android, will download and can be opened
      tempLink.click();

      setTimeout(() => URL.revokeObjectURL(url), 100);

      notifySuccess(t("openingContact"));
    } catch (error) {
      console.error("Failed to open in contacts:", error);
      notifyError(t("openingContactFailed"));
    }
  };

  const handleShareContact = async () => {
    if (!navigator.share) {
      toast.error("Sharing not supported on this device");
      return;
    }

    try {
      const vCardData = await generateVCard();

      // Try to share as file
      if (navigator.canShare && navigator.canShare({ files: [] })) {
        const blob = new Blob([vCardData], { type: "text/vcard" });
        const file = new File(
          [blob],
          `${profileData.firstName}_${profileData.lastName}.vcf`,
          { type: "text/vcard" }
        );

        await navigator.share({
          title: `${profileData.firstName} ${profileData.lastName} - Contact`,
          text: `Contact information for ${profileData.firstName} ${profileData.lastName}`,
          files: [file],
        });
      } else {
        const contactText = `${profileData.firstName} ${profileData.lastName}
  📞 ${profileData.phone}
  📧 ${profileData.email}
  📍 ${profileData.address}
  🏢 ${profileData.company} - ${profileData.title}
  Profile Link: ${currentLink}   

  Social Links:
  ${socialLinks.map((link) => `${link.name}: ${link.url}`).join(`\n  `)}`;

        await navigator.share({
          title: `${profileData.firstName} ${profileData.lastName} - Contact`,
          text: contactText,
        });
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Sharing failed:", error);
        notifyError("Sharing failed");
      }
    }
  };

  const handleCopyContactInfo = async () => {
    const contactText = `${profileData.firstName} ${profileData.lastName}
  Phone: ${profileData.phone}
  Email: ${profileData.email}
  Address: ${profileData.address}
  Company: ${profileData.company}
  Title: ${profileData.title}
  Profile Link: ${currentLink}

  Social Links:
  ${socialLinks.map((link) => `${link.name}: ${link.url}`).join("\n")}`;

    try {
      await navigator.clipboard.writeText(contactText);
      notifySuccess("Contact info copied to clipboard!");
    } catch (error) {
      console.error(error);
      notifyError("Failed to copy contact info");
    }
  };

  const openInGoogleMaps = () => {
    const { address, coordinates } = profileData;

    let mapUrl = "";

    if (coordinates && coordinates.length === 2) {
      mapUrl = `https://www.google.com/maps?q=${coordinates[0]},${coordinates[1]}`;
    } else if (address) {
      mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
      )}`;
    } else {
      toast.error(t("noAddressAvailable"));
      return;
    }

    window.open(mapUrl, "_blank");
  };

  const sideBarContent = (
    <section className="p-4 flex flex-col gap-6 items-center text-center">
      <h2 className="text-2xl text-main font-bold">
        {t("connectAndDiscover")}
      </h2>
      <p className="text-gray-400 ">{t("discoverDesc")}</p>

      <div className="flex gap-2 items-center flex-wrap justify-center">
        <Link
          to="https://apps.apple.com/app/id1234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-102 duration-400"
        >
          <img src={appStore} alt="App Store" className="w-32 object-contain" />
        </Link>
        <Link
          to="https://play.google.com/store/apps/details?id=com.example.app"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-102 duration-400"
        >
          <img
            src={googlePlay}
            alt="Google Play"
            className="w-32 object-contain"
          />
        </Link>
      </div>
    </section>
  );

  const xTagLogo = (
    <img src={sidebar_Logo} alt="X-Tag Logo" className="w-24 h-auto" />
  );

  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (e) {
      console.log(e);
      toast.error(t("failedToCopy"));
    }
  };

  const shareQrCode = async () => {
    try {
      const qrCanvas = document.querySelector("canvas");
      if (!qrCanvas) {
        notifyError("QR Code not found");
        return;
      }

      const blob = await new Promise((resolve) =>
        qrCanvas.toBlob(resolve, "image/png")
      );

      if (!blob) {
        notifyError("Failed to generate QR image");
        return;
      }

      const file = new File([blob], "x-tag-qr.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "X-Tag QR Code",
          text: "Scan this QR to view my X-Tag profile!",
          files: [file],
        });
      } else if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        notifySuccess("QR Code copied to clipboard!");
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "x-tag-qr.png";
        link.click();
        URL.revokeObjectURL(url);
        toast.info("Sharing not supported. QR downloaded instead.");
      }

      setShowShareProfileModal(false);
    } catch (error) {
      console.error(error);
      notifyError("Failed to share QR Code");
    }
  };

  return (
    <>
      <main className="bg-[#1F1F1F] text-[#FFFFFF] sm:h-[100vh] flex">
        <aside className="hidden lg:flex w-[300px] bg-[#181818] flex-col items-center justify-between">
          <div className="flex flex-col items-center gap-4">
            <header className="bg-[#333333] w-full flex justify-center items-center p-2 rounded-b-2xl">
              {xTagLogo}
            </header>
            {sideBarContent}
          </div>

          <div className="bg-[#333333] flex justify-center items-center w-full rounded-t-2xl py-3.5">
            <img
              src={logo_sidebar_footer}
              alt=" powered by x tag"
              className="w-42"
            />
          </div>
        </aside>

        <div className="flex-1 h-full overflow-y-auto no_scroll_bar">
          {/* <OpenInAppPrompt profileId={id} /> */}
          <section className="max-w-7xl">
            <header className="relative mb-19">
              <img
                className="w-full min-h-[15vh] max-h-[40vh] object-cover mx-auto"
                src={cover}
                alt="cover"
              />

              <div className="absolute top-2 end-2">
                <LangSwitcher profileView />
              </div>

              <div className="w-full absolute bottom-0 start-0 translate-y-1/2 flex flex-col items-center justify-center">
                <div
                  role="button"
                  onClick={() => setShowModal(true)}
                  className="size-32 xs:size-36 rounded-full cursor-pointer bg-gray-700"
                >
                  <img
                    className="rounded-full size-full object-cover"
                    src={imgUrl ? imgUrl : noAvatar}
                    alt="avatar"
                  />
                </div>
              </div>
            </header>
            <div className="w-full flex flex-col items-center justify-center">
              <h1 className="text-3xl font-bold text-main text-center">
                {profileData.firstName} {profileData.lastName}
              </h1>
              <p className="font-semibold px-2 rounded text-white bg-main my-1 text-lg">
                {profileData.title}
              </p>
              <p className="flex gap-1 items-center text-gray-400 text-lg">
                <Building2 className="size-5" />
                {profileData.company}
              </p>
            </div>
            <main className="px-4">
              <section
                style={{
                  boxShadow: shadowColor,
                }}
                className="rounded-md p-4 my-4 bg-[#181818] overflow-hidden"
              >
                <h2 className="mb-4 font-bold text-xl text-main">
                  {t("personalInfo")}
                </h2>

                <ul className="flex justify-between items-center xs:px-6 flex-wrap gap-4">
                  <li className="flex items-center gap-2">
                    <div className="shrik-0"> {phoneIcon}</div>
                    <div className="flex flex-col">
                      <span className="text-gray-400">{t("phoneNumber")}</span>
                      <Link
                        to={`tel:${profileData.phone}`}
                        className="text-wrap"
                        title={t("call")}
                      >
                        {profileData.phone}
                      </Link>
                    </div>
                  </li>

                  <li className="flex items-center gap-2">
                    <div className="shrik-0">{locationIcon}</div>
                    <div className="flex flex-col">
                      <span className="text-gray-400">{t("address")}</span>
                      <button onClick={openInGoogleMaps} title={t("openMap")}>
                        {profileData.address}
                      </button>
                    </div>
                  </li>
                </ul>
                <div className="mt-4 xs:px-6">
                  <li className="flex items-center gap-2">
                    <div className="shrik-0">{envelopeIcon}</div>
                    <div className="flex flex-col">
                      <span className="text-gray-400">{t("email")}</span>
                      <Link
                        to={`mailto:${profileData.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all"
                        title={t("sendEmail")}
                      >
                        {profileData.email}
                      </Link>
                    </div>
                  </li>
                </div>

                <hr className="my-4 opacity-10" />

                <div className="flex justify-evenly items-center gap-4 flex-wrap my-4">
                  {/* <button
                  onClick={handleDownloadContact}
                  title={t("downloadContact")}
                  className={btnClasses}
                >
                  <Download className="size-7 text-main" />
                </button> */}
                  <button
                    onClick={handleOpenInContacts}
                    title={t("saveContact")}
                    className={btnClasses}
                  >
                    <PlusCircle className={iconClasses} />
                    <span>{t("saveContact")}</span>
                  </button>
                  {canShare && (
                    <button
                      onClick={handleShareContact}
                      title={t("shareContact")}
                      className={btnClasses}
                    >
                      <Share2 className={iconClasses} />
                      <span>{t("shareContact")}</span>
                    </button>
                  )}
                  <button
                    onClick={handleCopyContactInfo}
                    title={t("copyInfo")}
                    className={btnClasses}
                  >
                    <Copy className={iconClasses} />
                    <span>{t("copyInfo")}</span>
                  </button>
                  <button
                    onClick={() => setShowShareProfileModal(true)}
                    title={t("shareProfile")}
                    className={btnClasses}
                  >
                    <ScanQrCode className={iconClasses} />
                    <span>{t("shareProfile")}</span>
                  </button>
                </div>
              </section>

              <section
                style={{
                  backgroundColor: secondary,
                  boxShadow: shadowColor,
                }}
                className="rounded-md p-2 my-4"
              >
                <div className="flex justify-between p-4">
                  <div>
                    <h2 className="font-bold text-xl text-main">
                      {t("socialLinks")}
                    </h2>
                    <p className="text-gray-400">4 {t("links")}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col  gap-3 md:px-12 mb-2">
                  {socialLinks.map((link, indx) => (
                    <div
                      key={indx}
                      className={`flex justify-between items-center flex-wrap gap-2 py-3 px-4 rounded hover:bg-[#D0A1381A] duration-500 bg-[#1F1F1F]`}
                      style={{ boxShadow: shadowColor }}
                    >
                      <Link
                        to={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <img src={link.src} className="w-8" />
                        <p>{link.address}</p>
                      </Link>
                      <button
                        onClick={() => handleCopy(link.url)}
                        className="ms-auto"
                        aria-label="Copy link"
                      >
                        <Copy
                          className={`size-5  hover:text-white transition-colors ${
                            copiedUrl === link.url
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section
                style={{
                  boxShadow: shadowColor,
                }}
                className="rounded-md p-4 my-4 bg-[#181818] overflow-hidden"
              >
                <h2 className="mb-4 font-bold text-xl text-main">
                  {t("attachments")}
                </h2>
                <Attachments />
              </section>
            </main>
          </section>

          <footer className=" flex lg:hidden w-full bg-[#181818] flex-col items-center justify-center py-2">
            {xTagLogo}
            {sideBarContent}
          </footer>
        </div>
      </main>

      <MainModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        noActions
      >
        <div className="h-full flex justify-center items-center">
          <img className="size-60" src={imgUrl} alt="avatar" />
        </div>
      </MainModal>

      <MainModal
        isOpen={showShareProfileModal}
        onClose={() => setShowShareProfileModal(false)}
        onConfirm={shareQrCode}
        confirmTxt={t("share")}
        customBackground="bg-[#1f1f1f]"
      >
        <div className="p-4 flex justify-center items-center">
          <QrCodeTemplate
            data={currentLink}
            primaryColor="#ce9615"
            dotsType="classy-rounded"
            cornersSquareType="classy-rounded"
            cornersDotType="classy-rounded"
            image={cube}
            size={150}
            backgroundColor="#eeeeee"
          />
        </div>
      </MainModal>
    </>
  );
};

export default EmployeeProfileWebView;
