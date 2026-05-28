"use client";

import React, { useEffect } from "react";
import "./scroll-aware-header.css";

const page = () => {
  useEffect(() => {
    let prevScrollpos = window.pageYOffset;

    window.onscroll = function () {
      var currentScrollPos = window.pageYOffset;
      const header = document.querySelector(".main-header");
      if (!header) return;

      if (prevScrollpos > currentScrollPos) {
        header.style.top = "0";
      } else {
        header.style.top = "-100px";
      }

      prevScrollpos = currentScrollPos;
    };

    // Cleanup on unmount
    return () => {
      window.onscroll = null;
    };
  }, []);

  return (
    <main>
      <header className="main-header">
        <div className="logo">Sangeethan.</div>
        <nav className="main-nav">
          <ul>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Services</a>
            </li>
            <li>
              <a href="#">Portfolio</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </nav>
      </header>
      <section>
        <div className="container">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ut dui
          purus. Suspendisse sodales in justo ut ornare. Donec sit amet leo sed
          libero finibus mattis. Quisque in nisi quis nisl auctor porttitor.
          Integer ornare id risus non vehicula. Nunc id maximus orci. Donec
          semper ligula non consequat hendrerit. Proin efficitur quis leo ut
          volutpat. Nulla nec hendrerit massa. Nullam vel congue elit, eu
          commodo ante. Integer eu luctus ante. Praesent tellus sem, iaculis sed
          sapien at, auctor lacinia ante. Mauris tincidunt tortor sit amet
          molestie lobortis.
          <br />
          <br />
          Praesent fermentum felis eu diam rhoncus efficitur. Nullam elementum
          dolor vitae risus commodo pharetra at eget metus. Etiam convallis
          porta finibus. Maecenas diam odio, congue fermentum venenatis eget,
          gravida nec sapien. Maecenas sed lacinia mauris. Nam justo nisi,
          gravida eu interdum a, congue ac orci. Donec vitae malesuada orci, id
          varius dui. Proin sit amet ullamcorper sapien. Fusce lobortis erat ac
          odio porta gravida. Quisque consequat pellentesque lacus sit amet
          egestas. Vestibulum ornare urna egestas ipsum suscipit, at
          sollicitudin risus aliquam. Sed ut est vel velit feugiat pellentesque.
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Nullam ut enim in justo interdum efficitur.
          Sed posuere lorem mauris, nec bibendum sapien rhoncus vitae.
          <br />
          <br />
          Vestibulum et lorem quis mi eleifend commodo eu tincidunt diam. Sed
          vitae porta magna, id vehicula nisl. Morbi nec urna ac nunc aliquam
          consectetur. Ut dictum, tellus a egestas consectetur, nulla ex laoreet
          mi, non vehicula risus leo nec eros. Vivamus ut leo ex. Nulla non
          luctus purus. Nulla tempus vel nisl a dictum. Aliquam finibus eros at
          tristique interdum. Aliquam erat volutpat.
          <br />
          <br />
          Pellentesque tortor magna, commodo vel dui vel, sagittis aliquet
          justo. Aenean laoreet pretium enim, at porta lorem auctor at. Morbi
          fringilla euismod dui in lobortis. Nulla fermentum, lectus sed aliquam
          sollicitudin, sapien neque semper tortor, quis molestie mi leo a
          purus. Sed bibendum, sapien ut maximus volutpat, nisl quam mattis sem,
          sed lobortis sem mauris a neque. Fusce pharetra tristique turpis at
          fringilla. Proin ultricies sit amet arcu ut imperdiet. Integer tortor
          nisl, imperdiet eget risus sed, facilisis congue magna. Sed iaculis
          lacinia mi, vitae euismod mi ullamcorper in.
          <br />
          <br />
          Etiam dictum sagittis mauris, dictum dictum eros convallis a.
          Vestibulum sit amet pulvinar eros, vitae malesuada nisl. Nam lorem
          eros, viverra sit amet sodales ac, tempus eget massa. Mauris id mi
          urna. Nam eget erat mattis, volutpat justo ac, facilisis mauris.
          Suspendisse a elit sed sem interdum porta non eget dolor. Nam
          vestibulum sem mauris, in pharetra lacus vulputate quis.
          <br />
          <br />
          Mauris gravida tellus vitae erat maximus, eget convallis orci
          vehicula. Nunc at magna dictum, viverra justo id, interdum ligula. Nam
          euismod cursus lacus id dapibus. Praesent pulvinar auctor ipsum non
          egestas. Donec suscipit, velit a sollicitudin lacinia, quam eros
          efficitur ipsum, et sodales erat lectus nec mi. Phasellus bibendum
          velit et pharetra fringilla. Curabitur efficitur vehicula bibendum.
          <br />
          <br />
          Donec quis sapien malesuada, venenatis erat tristique, efficitur
          lacus. Etiam semper vestibulum orci vitae euismod. Proin et placerat
          massa. Phasellus et ultrices purus, viverra congue eros. Pellentesque
          felis arcu, euismod congue vestibulum eget, maximus vel dolor. Cras
          sit amet augue tempus, hendrerit nisi eget, pulvinar velit. Nulla
          hendrerit ornare justo, non gravida leo finibus sed. Suspendisse
          fermentum sem erat. Morbi sed metus sapien. Cras feugiat eget ligula
          vel egestas. Sed id leo mollis, mollis sapien mattis, dictum magna.
          Aenean elementum a lectus id lobortis. Orci varius natoque penatibus
          et magnis dis parturient montes, nascetur ridiculus mus.
          <br />
          <br />
          Sed at quam sollicitudin, suscipit risus sed, convallis quam. Nulla
          sit amet tempus arcu. Pellentesque a nisl justo. Sed cursus nulla nec
          urna tempus lobortis. Nunc ultrices faucibus eleifend. Mauris eu
          libero leo. Etiam venenatis arcu leo, sed tincidunt diam pellentesque
          non. Aliquam vel ante eget lectus semper placerat eu eu purus. Morbi
          tempus ornare mauris, a laoreet metus mollis dapibus. Vivamus
          tristique nisl a nunc vestibulum tincidunt. Proin aliquet fermentum
          commodo. Nulla sed nisi ut nisi scelerisque venenatis ac non lacus.
          <br />
          <br />
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Aliquam aliquet mauris vitae arcu suscipit
          pellentesque. Integer finibus ligula in lectus vehicula, vitae
          ullamcorper velit porta. Suspendisse potenti. Ut id mi nisi. Ut porta
          lorem at tincidunt pretium. Morbi consectetur cursus lorem sed
          interdum. Aliquam erat volutpat. Etiam vestibulum venenatis molestie.
          Morbi et facilisis risus, ut porta libero. Nunc condimentum orci at
          turpis sagittis iaculis. Donec interdum, velit facilisis consectetur
          commodo, purus diam porta eros, sit amet tempus massa sem in neque.
          <br />
          <br />
          Quisque id vehicula turpis. Etiam dignissim, sapien at venenatis
          pretium, ante eros congue nisi, sit amet consequat mauris risus sed
          felis. Proin urna risus, varius at est ultricies, convallis efficitur
          justo. Nulla nec neque ipsum. Integer molestie velit in neque
          convallis, non auctor dui feugiat. Fusce tristique nec justo ac
          eleifend. Maecenas id est est. Proin volutpat, odio dictum ornare
          volutpat, nisl felis commodo neque, sed venenatis diam sem ut augue.
          Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
          posuere cubilia curae;
          <br />
          <br />
          Praesent fermentum felis eu diam rhoncus efficitur. Nullam elementum
          dolor vitae risus commodo pharetra at eget metus. Etiam convallis
          porta finibus. Maecenas diam odio, congue fermentum venenatis eget,
          gravida nec sapien. Maecenas sed lacinia mauris. Nam justo nisi,
          gravida eu interdum a, congue ac orci. Donec vitae malesuada orci, id
          varius dui. Proin sit amet ullamcorper sapien. Fusce lobortis erat ac
          odio porta gravida. Quisque consequat pellentesque lacus sit amet
          egestas. Vestibulum ornare urna egestas ipsum suscipit, at
          sollicitudin risus aliquam. Sed ut est vel velit feugiat pellentesque.
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Nullam ut enim in justo interdum efficitur.
          Sed posuere lorem mauris, nec bibendum sapien rhoncus vitae.
          <br />
          <br />
          Vestibulum et lorem quis mi eleifend commodo eu tincidunt diam. Sed
          vitae porta magna, id vehicula nisl. Morbi nec urna ac nunc aliquam
          consectetur. Ut dictum, tellus a egestas consectetur, nulla ex laoreet
          mi, non vehicula risus leo nec eros. Vivamus ut leo ex. Nulla non
          luctus purus. Nulla tempus vel nisl a dictum. Aliquam finibus eros at
          tristique interdum. Aliquam erat volutpat.
          <br />
          <br />
          Pellentesque tortor magna, commodo vel dui vel, sagittis aliquet
          justo. Aenean laoreet pretium enim, at porta lorem auctor at. Morbi
          fringilla euismod dui in lobortis. Nulla fermentum, lectus sed aliquam
          sollicitudin, sapien neque semper tortor, quis molestie mi leo a
          purus. Sed bibendum, sapien ut maximus volutpat, nisl quam mattis sem,
          sed lobortis sem mauris a neque. Fusce pharetra tristique turpis at
          fringilla. Proin ultricies sit amet arcu ut imperdiet. Integer tortor
          nisl, imperdiet eget risus sed, facilisis congue magna. Sed iaculis
          lacinia mi, vitae euismod mi ullamcorper in.
          <br />
          <br />
          Etiam dictum sagittis mauris, dictum dictum eros convallis a.
          Vestibulum sit amet pulvinar eros, vitae malesuada nisl. Nam lorem
          eros, viverra sit amet sodales ac, tempus eget massa. Mauris id mi
          urna. Nam eget erat mattis, volutpat justo ac, facilisis mauris.
          Suspendisse a elit sed sem interdum porta non eget dolor. Nam
          vestibulum sem mauris, in pharetra lacus vulputate quis.
          <br />
          <br />
          Mauris gravida tellus vitae erat maximus, eget convallis orci
          vehicula. Nunc at magna dictum, viverra justo id, interdum ligula. Nam
          euismod cursus lacus id dapibus. Praesent pulvinar auctor ipsum non
          egestas. Donec suscipit, velit a sollicitudin lacinia, quam eros
          efficitur ipsum, et sodales erat lectus nec mi. Phasellus bibendum
          velit et pharetra fringilla. Curabitur efficitur vehicula bibendum.
          <br />
          <br />
          Donec quis sapien malesuada, venenatis erat tristique, efficitur
          lacus. Etiam semper vestibulum orci vitae euismod. Proin et placerat
          massa. Phasellus et ultrices purus, viverra congue eros. Pellentesque
          felis arcu, euismod congue vestibulum eget, maximus vel dolor. Cras
          sit amet augue tempus, hendrerit nisi eget, pulvinar velit. Nulla
          hendrerit ornare justo, non gravida leo finibus sed. Suspendisse
          fermentum sem erat. Morbi sed metus sapien. Cras feugiat eget ligula
          vel egestas. Sed id leo mollis, mollis sapien mattis, dictum magna.
          Aenean elementum a lectus id lobortis. Orci varius natoque penatibus
          et magnis dis parturient montes, nascetur ridiculus mus.
          <br />
          <br />
          Sed at quam sollicitudin, suscipit risus sed, convallis quam. Nulla
          sit amet tempus arcu. Pellentesque a nisl justo. Sed cursus nulla nec
          urna tempus lobortis. Nunc ultrices faucibus eleifend. Mauris eu
          libero leo. Etiam venenatis arcu leo, sed tincidunt diam pellentesque
          non. Aliquam vel ante eget lectus semper placerat eu eu purus. Morbi
          tempus ornare mauris, a laoreet metus mollis dapibus. Vivamus
          tristique nisl a nunc vestibulum tincidunt. Proin aliquet fermentum
          commodo. Nulla sed nisi ut nisi scelerisque venenatis ac non lacus.
          <br />
          <br />
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Aliquam aliquet mauris vitae arcu suscipit
          pellentesque. Integer finibus ligula in lectus vehicula, vitae
          ullamcorper velit porta. Suspendisse potenti. Ut id mi nisi. Ut porta
          lorem at tincidunt pretium. Morbi consectetur cursus lorem sed
          interdum. Aliquam erat volutpat. Etiam vestibulum venenatis molestie.
          Morbi et facilisis risus, ut porta libero. Nunc condimentum orci at
          turpis sagittis iaculis. Donec interdum, velit facilisis consectetur
          commodo, purus diam porta eros, sit amet tempus massa sem in neque.
          <br />
          <br />
          Quisque id vehicula turpis. Etiam dignissim, sapien at venenatis
          pretium, ante eros congue nisi, sit amet consequat mauris risus sed
          felis. Proin urna risus, varius at est ultricies, convallis efficitur
          justo. Nulla nec neque ipsum. Integer molestie velit in neque
          convallis, non auctor dui feugiat. Fusce tristique nec justo ac
          eleifend. Maecenas id est est. Proin volutpat, odio dictum ornare
          volutpat, nisl felis commodo neque, sed venenatis diam sem ut augue.
          Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
          posuere cubilia curae;
        </div>
      </section>
    </main>
  );
};

export default page;
