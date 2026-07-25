import styles from "./Banner.module.css";
import { IoIosArrowBack } from "react-icons/io";
import reactIcon from "../assets/images/react.svg";
import jsIcon from "../assets/images/js.svg";
import nextIcon from "../assets/images/next.svg";
import tailwindIcon from "../assets/images/tailwind.svg";
import sassIcon from "../assets/images/sass.svg";
import Button from "../components/Button";

function Banner() {
  return (
    <section className={`${styles.banner}`}>
      <main className={`${styles.main}`}>
        <div className={styles.badge}>
          <div className={styles.dot}></div>
          <div> تکنولوژی مدرن برای طراحی بهتر</div>
        </div>

        <h1>
          <span>بهترین و جدیدترین</span>
          <strong>
            تکنولوژی روز دنیا <br /> در طراحی وبسایت
          </strong>
        </h1>

        <p>
          طراحی و توسعه وبسایت های نسل جدید با قدرتمندترین ابزار های
          فرانت‌اند؛خلق پلتفرم های مقیاس پذیر،پرسرعت و متناسب با نیاز های آینده
        </p>

        <Button
          title="همین حالا اقدام کنید"
          icon={<IoIosArrowBack />}
          link="contact"
        ></Button>
      </main>
      <aside className={`${styles.aside}`}>
        <div className={`${styles.techLogo} ${styles.react} glassBG`}>
          <img src={reactIcon} alt="react-icon" />
        </div>

        <div className={`${styles.techLogo} ${styles.javascript} glassBG`}>
          <img src={jsIcon} alt="javascript-icon" />
        </div>

        <div className={`${styles.techLogo} ${styles.tailwind} glassBG`}>
          <img src={tailwindIcon} alt="tailwind-icon" />
        </div>

        <div className={`${styles.techLogo} ${styles.next} glassBG`}>
          <img src={nextIcon} alt="next-icon" />
        </div>

        <div className={`${styles.techLogo} ${styles.scss} glassBG`}>
          <img src={sassIcon} alt="sass-icon" />
        </div>
        <svg
          className="MuiBox-root css-1ceigbf"
          viewBox="0 0 460 470"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="pTop" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#93C5FD" />
              <stop offset="1" stopColor="#2563EB" />
            </linearGradient>
            <linearGradient id="pRight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2563EB" />
              <stop offset="1" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="pLeft" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1D4ED8" />
              <stop offset="1" stopColor="#1E40AF" />
            </linearGradient>
            <linearGradient id="aTop" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#BFDBFE" />
              <stop offset="1" stopColor="#60A5FA" />
            </linearGradient>
            <linearGradient id="aRight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2563EB" />
              <stop offset="1" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="aLeft" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1D4ED8" />
              <stop offset="1" stopColor="#1E40AF" />
            </linearGradient>
            <radialGradient id="core" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="0.55" stopColor="#EFF6FF" />
              <stop offset="1" stopColor="#60A5FA" />
            </radialGradient>

            <filter
              id="softShadow"
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
              <feOffset dy="6" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.25" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <ellipse
            cx="232"
            cy="442"
            rx="150"
            ry="22"
            fill="#1E40AF"
            opacity="0.16"
            filter="url(#softShadow)"
          />

          <g
            stroke="#2563EB"
            strokeWidth="2.4"
            strokeDasharray="1 9"
            strokeLinecap="round"
            opacity="0.7"
          >
            <line x1="238" y1="226" x2="150" y2="300" />
            <line x1="238" y1="226" x2="320" y2="250" />
          </g>

          <g filter="url(#softShadow)">
            <polygon
              points="216,333 150,366 150,420 216,387"
              fill="url(#pRight)"
            />
            <polygon
              points="84,333 150,366 150,420 84,387"
              fill="url(#pLeft)"
            />
            <polygon
              points="150,300 216,333 150,366 84,333"
              fill="url(#pTop)"
            />
          </g>

          <g transform="matrix(66 33 -66 33 150 300)">
            <circle cx="0.26" cy="0.24" r="0.035" fill="#3B82F6" />
            <circle cx="0.37" cy="0.24" r="0.035" fill="#06B6D4" />
            <circle cx="0.48" cy="0.24" r="0.035" fill="#10B981" />
          </g>

          <g filter="url(#softShadow)">
            <polygon
              points="380,280 320,310 320,396 380,366"
              fill="url(#pRight)"
            />
            <polygon
              points="260,280 320,310 320,396 260,366"
              fill="url(#pLeft)"
            />
            <polygon
              points="320,250 380,280 320,310 260,280"
              fill="url(#pTop)"
            />
          </g>

          <g
            transform="matrix(60 30 0 86 260 280)"
            stroke="#93C5FD"
            strokeWidth="0.012"
            opacity="0.9"
          >
            <line x1="0.12" y1="0.3" x2="0.88" y2="0.3" />
            <line x1="0.12" y1="0.55" x2="0.88" y2="0.55" />
            <line x1="0.12" y1="0.8" x2="0.88" y2="0.8" />
          </g>

          <g transform="matrix(60 30 0 86 260 280)">
            <circle cx="0.2" cy="0.18" r="0.03" fill="#10B981" />
            <circle cx="0.2" cy="0.43" r="0.03" fill="#06B6D4" />
            <circle cx="0.2" cy="0.68" r="0.03" fill="#10B981" />
          </g>

          <g filter="url(#softShadow)">
            <polygon
              points="296,149 238,178 238,226 296,197"
              fill="url(#aRight)"
            />
            <polygon
              points="180,149 238,178 238,226 180,197"
              fill="url(#aLeft)"
            />
            <polygon
              points="238,120 296,149 238,178 180,149"
              fill="url(#aTop)"
            />
          </g>

          <g transform="matrix(58 29 -58 29 238 120)">
            <g stroke="#1D4ED8" strokeWidth="0.018" opacity="0.85">
              <line x1="0.5" y1="0.5" x2="0.5" y2="0.16" />
              <line x1="0.5" y1="0.5" x2="0.84" y2="0.5" />
              <line x1="0.5" y1="0.5" x2="0.5" y2="0.84" />
              <line x1="0.5" y1="0.5" x2="0.16" y2="0.5" />
            </g>

            <g fill="#1D4ED8">
              <circle cx="0.5" cy="0.16" r="0.045" />
              <circle cx="0.84" cy="0.5" r="0.045" />
              <circle cx="0.5" cy="0.84" r="0.045" />
              <circle cx="0.16" cy="0.5" r="0.045" />
            </g>

            <circle
              cx="0.5"
              cy="0.5"
              r="0.16"
              fill="url(#core)"
              filter="url(#glow)"
            />
          </g>
        </svg>
      </aside>
    </section>
  );
}

export default Banner;
