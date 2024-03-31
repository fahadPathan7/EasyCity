import "./Dashboard.css";

export default function NewsCard({ newsText, newsLink }) {
  return (
    <>
      <div
        className="news-card-canvas"
        onClick={() => {
          var win = window.open(newsLink, "_blank");
          win.focus();
        }}
      >
        {newsText}
      </div>
    </>
  );
}
