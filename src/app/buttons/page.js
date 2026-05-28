import React from "react";
import "./buttons.css";

const page = () => {
  return (
    <main>
      <section className="container">
        <div className="button-1-wrapper btn-wrapper">
          <a href="#" className="button-1">
            Hover Me
          </a>
        </div>
        <div className="button-2-wrapper btn-wrapper">
          <a href="#" className="button-2">
            Hover Me
          </a>
        </div>
      </section>
    </main>
  );
};

export default page;
