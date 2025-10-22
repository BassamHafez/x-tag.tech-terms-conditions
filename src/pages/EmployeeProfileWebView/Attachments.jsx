import { useEffect, useState, useTranslation } from "@/shared/hooks";
import { MainModal, DownloadIcon, PlayCircle } from "@/shared/components";
import { wordThumbnail, pdfThumbnail } from "@/shared/images";
import {
  baseSwiperConfig,
  imgClasses,
  files,
  photos,
  slideClasses,
  titleClasses,
  videos,
} from "./staticData";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import * as pdfjsLib from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";
import CustomSkeleton from "./CustomSkeleton";
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

const Attachments = () => {
  const [videoThumbs, setVideoThumbs] = useState({});
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState({});
  const [openItem, setOpenItem] = useState(null);
  const [pdfThumbs, setPdfThumbs] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    if (videos) {
      videos.forEach((video) => {
        const videoEl = document.createElement("video");
        videoEl.src = video.src;
        videoEl.crossOrigin = "anonymous";
        videoEl.muted = true;
        videoEl.currentTime = 10;

        videoEl.addEventListener("loadeddata", () => {
          const canvas = document.createElement("canvas");
          canvas.width = videoEl.videoWidth;
          canvas.height = videoEl.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
          const imgURL = canvas.toDataURL("image/jpeg");
          setVideoThumbs((prev) => ({ ...prev, [video.src]: imgURL }));
        });
      });
    }
  }, []);

  useEffect(() => {
    if (files) {
      files.forEach(async (file) => {
        if (!file.file.toLowerCase().endsWith(".pdf")) return;

        const loadingTask = pdfjsLib.getDocument(file.file);
        const pdfDoc = await loadingTask.promise;
        const page = await pdfDoc.getPage(1);

        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
        const imgURL = canvas.toDataURL("image/png");
        setPdfThumbs((prev) => ({ ...prev, [file.file]: imgURL }));
      });
    }
  }, []);

  const handleOpen = (item) => setOpenItem(item);
  const handleClose = () => setOpenItem(null);

  const handleDownloadFile = (file, isWord) => {
    if (!file) return;
    const link = document.createElement("a");
    link.href = file.file;
    link.download = file.title + (isWord ? ".docx" : ".pdf");
    link.click();
  };

  return (
    <main>
      {/* Videos */}
      <div className="mb-6 bg-[#1f1f1f] shadow p-4 rounded">
        <h3 className="text-md font-semibold mb-3 text-main">{t("videos")}</h3>
        <Swiper {...baseSwiperConfig}>
          {videos
            ? videos.map((video, i) => (
                <SwiperSlide key={i}>
                  <div className={slideClasses}>
                    <div
                      onClick={() => handleOpen({ ...video, type: "video" })}
                      className={imgClasses}
                    >
                      {videoThumbs[video.src] ? (
                        <img
                          src={videoThumbs[video.src]}
                          alt={`video-thumb-${i}`}
                          className="size-full aspect-video object-cover opacity-90"
                        />
                      ) : (
                        <div className="w-full aspect-video bg-gray-300 animate-pulse rounded-md" />
                      )}

                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-400">
                        <PlayCircle className="size-12 text-main" />
                        <span className="sr-only">{t("play")}</span>
                      </div>
                    </div>
                    <p className={titleClasses}>{video.title}</p>
                  </div>
                </SwiperSlide>
              ))
            : Array.from({ length: 4 }).map((_, i) => (
                <SwiperSlide key={i}>
                  <CustomSkeleton />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>

      {/* Files (PDF + Word) */}
      <div className="mb-4 bg-[#1f1f1f] shadow p-4 rounded">
        <h3 className="text-md font-semibold mb-3 text-main">{t("files")}</h3>
        <Swiper {...baseSwiperConfig}>
          {files
            ? files.map((file, i) => {
                const isPdf = file.file.toLowerCase().endsWith(".pdf");
                const isWord = file.file.toLowerCase().endsWith(".docx");

                const handleOpenFile = (e) => {
                  e.preventDefault();
                  if (isWord) return;
                  else if (isPdf) window.open(file.file, "_blank");
                };

                return (
                  <SwiperSlide key={i}>
                    <div onClick={handleOpenFile} className={slideClasses}>
                      <div className={imgClasses}>
                        {isPdf && pdfThumbs[file.file] ? (
                          <img
                            src={pdfThumbs[file.file]}
                            alt={`pdf-thumb-${i}`}
                            className="size-full object-cover rounded-t-lg"
                          />
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center bg-[#2a2a2a] size-full">
                            <img
                              src={isWord ? wordThumbnail : pdfThumbnail}
                              alt={isWord ? "Word thumbnail" : "Pdf thumbnail"}
                              className="size-16 object-cover rounded-t-lg"
                            />
                          </div>
                        )}
                      </div>
                      <button
                        className="bg-[#181818] opacity-70 absolute top-0 start-0 group hover:text-main p-1.5 rounded-tl-lg"
                        title={t("download")}
                        onClick={() => handleDownloadFile(file, isWord)}
                      >
                        <DownloadIcon className="size-5 group-hover:scale-105 duration-400" />
                      </button>
                      <p className={titleClasses}>{file.title}</p>
                    </div>
                  </SwiperSlide>
                );
              })
            : Array.from({ length: 3 }).map((_, i) => (
                <SwiperSlide key={i}>
                  <CustomSkeleton />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>

      {/* Photos */}
      <div className="mb-6 bg-[#1f1f1f] shadow p-4 rounded">
        <h3 className="text-md font-semibold mb-3 text-main">{t("photos")}</h3>
        <Swiper {...baseSwiperConfig}>
          {photos
            ? photos.map((photo, i) => (
                <SwiperSlide key={i}>
                  <div className={slideClasses}>
                    <div
                      onClick={() => {
                        setSelectedPhoto(photo);
                        setShowPhotoModal(true);
                      }}
                      className={imgClasses}
                    >
                      <img
                        src={photo?.src}
                        alt={`photo-${i}`}
                        className="rounded-t-lg size-full object-cover cursor-pointer"
                      />
                    </div>
                    <p className={titleClasses}>{photo.title}</p>
                  </div>
                </SwiperSlide>
              ))
            : Array.from({ length: 6 }).map((_, i) => (
                <SwiperSlide key={i}>
                  <CustomSkeleton />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>

      <p className="text-xs text-gray-500 text-center mt-2 italic">
        Swipe horizontally to view more →
      </p>

      {openItem && (
        <MainModal
          isOpen={!!openItem}
          onClose={handleClose}
          myWidth="max-w-4xl w-full mx-4"
          noActions
          title={<span className="font-bold">{openItem.title}</span>}
          headerClasses="px-1"
        >
          <div className="p-2">
            <video
              src={openItem.src}
              controls
              autoPlay
              className="w-full rounded-lg mt-2"
            />
          </div>
        </MainModal>
      )}

      <MainModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        noActions
      >
        <div className="flex justify-center items-center p-4">
          <img
            className="max-w-92 object-contain"
            src={selectedPhoto?.src}
            alt={selectedPhoto?.title}
          />
        </div>
      </MainModal>
    </main>
  );
};

export default Attachments;
