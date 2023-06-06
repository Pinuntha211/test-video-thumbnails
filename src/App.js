import { useEffect, useRef, useState } from "react";
import "./styles.css";
import {
  generateVideoThumbnails,
  importFileandPreview,
} from "@rajesh896/video-thumbnails-generator";

export default function App() {
  const [video, setVideo] = useState();
  const [thumbNumber, setThumbNumber] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoThumb, setVideoThumb] = useState("");
  const [thumbnails, setThumbnails] = useState([]);
  const refs = useRef({
    video: null,
    loader: null,
    numberInput: null,
    thumbButton: null,
  });

  useEffect(() => {
    if (video) {
      importFileandPreview(video).then((res) => {
        setVideoUrl(res);
      });
      setVideoThumb("");
      setThumbNumber(0);
      setThumbnails([]);
      if (refs.current.video) {
        refs.current.video.style.transform = "scale(1)";
      }

      if (refs.current.numberInput) {
        refs.current.numberInput.style.display = "block";
      }
      if (refs.current.thumbButton) {
        refs.current.thumbButton.style.display = "block";
      }
    }
  }, [video]);

  // console.log("video--🙆🙆", video, thumbnails, videoUrl);
  function openImage(data) {
    var image = new Image();
    image.src = data;
    image.style = "max-width:100%;max-height:100%;";
    var w = window.open("");
    w.document.write(image.outerHTML);
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p style={{ fontWeight: 700, fontSize: 18 }}>เลือกวิดีโอที่ต้องการ</p>
        {video && (
          <video
            poster={videoThumb}
            style={{
              maxWidth: 600,
              maxHeight: 400,
              transform: "scale(0)",
              transition: "all 0.3s",
            }}
            controls
            id="video"
            ref={(el) => (refs.current.video = el)}
            src={videoUrl}
          >
            <source src={videoUrl} type={video?.type} />
            เบราว์เซอร์ของคุณไม่รองรับวิดีโอนี้!
          </video>
        )}
        <div style={{ display: "flex", marginTop: 25 }}>
          <input
            type="file"
            id="inputfile"
            accept="video/*"
            onChange={(e) => {
              if (e.target.files?.length > 0) {
                setVideo(e.target.files[0]);
              }
            }}
          />
        </div>
        <div
          id="numberWrapper"
          style={{ display: "none", marginTop: 15 }}
          ref={(el) => (refs.current.numberInput = el)}
        >
          <label
            for="numberofthumbnails"
            style={{ marginLeft: 15, paddingRight: 10 }}
          >
            ใส่จำนวนรูปภาพที่ต้องการจะสร้าง :
          </label>
          <input
            type="number"
            id="numberofthumbnails"
            value={thumbNumber ? thumbNumber : ""}
            onChange={(e) => {
              setThumbNumber(parseInt(e.target.value, 0));
            }}
          />
        </div>
        <div
          style={{ marginTop: 25, display: "none" }}
          id="buttonWrapper"
          ref={(el) => (refs.current.thumbButton = el)}
        >
          <button
            id="generatethumbnails"
            className="btn-create-img"
            onClick={() => {
              if (video) {
                if (refs.current.loader) {
                  refs.current.loader.style.display = "block";
                }
                generateVideoThumbnails(video, thumbNumber - 1).then(
                  (thumbs) => {
                    setThumbnails(thumbs);
                    if (refs.current.loader) {
                      refs.current.loader.style.display = "none";
                    }
                  }
                );
              }
            }}
          >
            สร้างรูปภาพ
          </button>
        </div>
      </div>
      <div
        id="loader"
        style={{ display: "none", textAlign: "center" }}
        ref={(el) => (refs.current.loader = el)}
      >
        <img src="loading.gif" alt="" />
      </div>
      <div
        id="thumbnails"
        className={`${
          thumbnails?.length > 5 ? "scroll-x" : "div-wrap"
        } div-thumbnails`}
      >
        {thumbnails.map((item, index) => {
          return (
            <div className="div-img">
              <div className="div-preview">
                <span>{index + 1}</span>
                <div className="txt-preview" onClick={() => openImage(item)}>
                  preview
                </div>
              </div>

              <img
                src={item}
                className="img-thumbnails"
                alt=""
                onClick={() => {
                  setVideoThumb(item);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
