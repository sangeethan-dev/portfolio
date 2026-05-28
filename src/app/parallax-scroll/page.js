import React from "react";
import "./parallax-scroll.css";

const page = () => {
  return (
    <main>
      <div className="app">
        <section className="hero">
          <div className="img">
            <img
              src="./parallax-scroll/Nostalgic Vintage Photography Still Life.jpeg"
              alt="Hero Background"
            />
          </div>
          <div className="heading heading-lg heading-wrapper-md">
            Where Vintage Meets Velocity.
          </div>
          <div className="nav">
            <p>Tour</p>
            <p>Update</p>
            <p>Contact</p>
            <p>Merge</p>
          </div>
        </section>
        <section className="projects">
          <div className="img">
            <img
              src="/./parallax-scroll/Anna Zakharova - Nostalgic Memory Scene.jpeg"
              alt="Projects Background"
            />
          </div>
          <div className="projects-brief">
            <p>
              A short ambient animation capturing the feeling of morning light
              sneaking through old windows — slow, warm, and textured like film
              grain.
            </p>
          </div>

          <div className="col projects-cover">
            <div className="img">
              <img
                src="./parallax-scroll/Nostalgic Memory Scene.jpeg"
                alt="Hero Background"
              />
            </div>
          </div>
          <div className="col projects-list">
            <div className="project">
              <h3 className="heading-lg">Dust & Light</h3>
              <p>#atmospheric  #filmgrain  #ambientmotion</p>
            </div>
            <div className="project">
              <h3 className="heading-lg"> Focal Point</h3>
              <p>#depthoffield  #focusplay  #minimal</p>
            </div>
            <div className="project">
              <h3 className="heading-lg">Frame by Frame</h3>
              <p>#handdrawn  #nostalgic  #2danimation</p>
            </div>
            <div className="project">
              <h3 className="heading-lg">The Last Exposure</h3>
              <p>#storytelling  #vintagefilm  #scrollnarrative</p>
            </div>
          </div>
        </section>
        <section className="about">
          <div className="col intro">
            <p>Introduction</p>
            <p>
              This is a simple parallax scroll effect created using React and
              CSS.
            </p>
          </div>
          <div className="col portrait">
            <div className="portrait-container">
              <div className="img">
                <img
                  src="./parallax-scroll/Golden Hour Leisure with Vintage Camera and Refreshments.jpeg"
                  alt="Hero Background"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="banner">
          <div className="img">
            <img
              src="./parallax-scroll/Golden Hour Leisure with Vintage Camera and Refreshments.jpeg"
              alt="Hero Background"
            />
          </div>
          <div className="banner-copy">
            <p>Be the</p>
            <h2>First To know</h2>
            <p>
              This is a simple parallax scroll effect created using React and
              CSS.
            </p>
            <button>Join The Newsletter</button>
          </div>
        </section>
        <section className="footer">
          <div className="col">
            <p>Instagram / TikTok / Facebook</p>

            <div className="footer-links">
              <p>Menu</p>
              <a href="#">Tour</a>
              <a href="#">Update</a>
              <a href="#">Merge</a>
              <a href="#">Contact</a>
            </div>

            <p>© Designed and Developed by Sangeethan</p>
          </div>
          <div className="col">
            <p>
              Join the newsletter <br />
              <button>Subscribe</button>
            </p>

            <div className="shop">
              <div className="img">
                <img
                  src="./parallax-scroll/Golden Hour Leisure with Vintage Camera and Refreshments.jpeg"
                  alt="Hero Background"
                />
              </div>
            </div>
            <p>Spotify / Apple Music / Youtube</p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default page;
