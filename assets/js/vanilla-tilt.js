/**
 * Vanilla Tilt - A lightweight 3D tilt effect for JavaScript.
 * Version: 1.0.0
 * Author: Șandor Sergiu <micku7zu@gmail.com>
 * Modified for Miss Star International
 */

class VanillaTilt {
  constructor(element, settings = {}) {
    if (!(element instanceof Node)) {
      throw (
        "Can't initialize VanillaTilt because " + element + " is not a Node."
      );
    }

    this.width = null;
    this.height = null;
    this.left = null;
    this.top = null;
    this.transitionTimeout = null;
    this.updateCall = null;

    this.updateBind = this.update.bind(this);
    this.resetBind = this.reset.bind(this);

    this.element = element;
    this.settings = this.extendSettings(settings);

    this.reverse = this.settings.reverse ? -1 : 1;

    this.glare = this.isSettingTrue(this.settings.glare);
    this.glarePrerender = this.isSettingTrue(this.settings.glare);
    this.gyroscope = this.isSettingTrue(this.settings.gyroscope);

    if (this.glare) {
      this.prepareGlare();
    }

    this.addEventListeners();
  }

  isSettingTrue(setting) {
    return setting === "" || setting === true || setting === 1;
  }

  addEventListeners() {
    if (this.gyroscope) {
      window.addEventListener("deviceorientation", this.updateBind);
    }

    if (this.settings.reset) {
      this.element.addEventListener("mouseleave", this.resetBind);
    }

    this.element.addEventListener("mousemove", this.updateBind);
  }

  removeEventListeners() {
    if (this.gyroscope) {
      window.removeEventListener("deviceorientation", this.updateBind);
    }

    this.element.removeEventListener("mouseleave", this.resetBind);
    this.element.removeEventListener("mousemove", this.updateBind);
  }

  destroy() {
    clearTimeout(this.transitionTimeout);
    if (this.updateCall !== null) {
      cancelAnimationFrame(this.updateCall);
    }

    this.reset();

    this.removeEventListeners();
    this.element.vanillaTilt = null;
    delete this.element.vanillaTilt;

    this.element = null;
  }

  getValues() {
    let x = (this.event.clientX - this.left) / this.width;
    let y = (this.event.clientY - this.top) / this.height;

    x = Math.min(Math.max(x, 0), 1);
    y = Math.min(Math.max(y, 0), 1);

    let tiltX = (
      this.reverse *
      (this.settings.max / 2 - x * this.settings.max)
    ).toFixed(2);
    let tiltY = (
      this.reverse *
      (y * this.settings.max - this.settings.max / 2)
    ).toFixed(2);

    return {
      tiltX: tiltX,
      tiltY: tiltY,
      percentageX: x * 100,
      percentageY: y * 100,
    };
  }

  updateElementPosition() {
    let rect = this.element.getBoundingClientRect();
    this.width = this.element.offsetWidth;
    this.height = this.element.offsetHeight;
    this.left = rect.left;
    this.top = rect.top;
  }

  update(event) {
    this.event = event;
    this.updateElementPosition();

    this.updateCall = requestAnimationFrame(this.updateTransforms.bind(this));
  }

  updateTransforms() {
    let values = this.getValues();

    this.element.style.transform =
      "perspective(" +
      this.settings.perspective +
      "px) " +
      "rotateX(" +
      (this.settings.axis === "x" ? 0 : values.tiltY) +
      "deg) " +
      "rotateY(" +
      (this.settings.axis === "y" ? 0 : values.tiltX) +
      "deg) " +
      "scale3d(" +
      this.settings.scale +
      ", " +
      this.settings.scale +
      ", " +
      this.settings.scale +
      ")";

    if (this.glare) {
      this.glareElement.style.transform = `rotate(${values.angle}deg) translate(-50%, -50%)`;
      this.glareElement.style.opacity = `${
        (values.percentageY * this.settings["max-glare"]) / 100
      }`;
    }

    this.element.dispatchEvent(
      new CustomEvent("tiltChange", {
        detail: values,
      })
    );

    this.updateCall = null;
  }

  prepareGlare() {
    // If option pre-render is enabled we assume all html/css is present for an optimal glare effect.
    if (!this.glarePrerender) {
      // Create glare element
      const jsTiltGlare = document.createElement("div");
      jsTiltGlare.classList.add("js-tilt-glare");

      const jsTiltGlareInner = document.createElement("div");
      jsTiltGlareInner.classList.add("js-tilt-glare-inner");

      jsTiltGlare.appendChild(jsTiltGlareInner);
      this.element.appendChild(jsTiltGlare);
    }

    this.glareElementWrapper = this.element.querySelector(".js-tilt-glare");
    this.glareElement = this.element.querySelector(".js-tilt-glare-inner");

    if (this.glarePrerender) {
      return;
    }

    Object.assign(this.glareElementWrapper.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      "pointer-events": "none",
    });

    Object.assign(this.glareElement.style, {
      position: "absolute",
      top: "50%",
      left: "50%",
      "pointer-events": "none",
      "background-image": `linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)`,
      transform: "rotate(180deg) translate(-50%, -50%)",
      "transform-origin": "0% 0%",
      opacity: "0",
    });

    this.updateGlareSize();
  }

  updateGlareSize() {
    if (this.glare) {
      const glareSize =
        (this.element.offsetWidth > this.element.offsetHeight
          ? this.element.offsetWidth
          : this.element.offsetHeight) * 2;

      Object.assign(this.glareElement.style, {
        width: `${glareSize}px`,
        height: `${glareSize}px`,
      });
    }
  }

  reset() {
    this.event = {
      clientX: this.left + this.width / 2,
      clientY: this.top + this.height / 2,
    };

    if (this.transitionTimeout !== null) {
      clearTimeout(this.transitionTimeout);
    }

    this.element.style.transform =
      `perspective(${this.settings.perspective}px) ` +
      `rotateX(0deg) ` +
      `rotateY(0deg) ` +
      `scale3d(1, 1, 1)`;

    if (this.glare) {
      this.glareElement.style.transform =
        "rotate(180deg) translate(-50%, -50%)";
      this.glareElement.style.opacity = "0";
    }
  }

  extendSettings(settings) {
    let defaultSettings = {
      reverse: false,
      max: 15,
      perspective: 1000,
      scale: 1,
      speed: 300,
      transition: true,
      axis: null,
      glare: false,
      "max-glare": 1,
      "glare-prerender": false,
      reset: true,
      gyroscope: true,
    };

    let newSettings = {};

    for (var property in defaultSettings) {
      if (property in settings) {
        newSettings[property] = settings[property];
      } else {
        newSettings[property] = defaultSettings[property];
      }
    }

    return newSettings;
  }
}

if (typeof document !== "undefined") {
  /* expose the class to window */
  window.VanillaTilt = VanillaTilt;

  /**
   * Auto load
   */
  document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll("[data-tilt]");

    elements.forEach((element) => {
      new VanillaTilt(element);
    });
  });
}
