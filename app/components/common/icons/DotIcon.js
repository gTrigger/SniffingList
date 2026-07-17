export default function GithubIcon(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="50 50 200 200"
            width="30"
            height="30"
            fill="currentColor"
            {...props}
        >
            <defs>
                <linearGradient id="marker-fade" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.95" />
                    <stop offset="60%" stopColor="currentColor" stopOpacity="0.8" />
                    <stop offset="90%" stopColor="currentColor" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
                </linearGradient>

                <linearGradient id="marker-light-fade" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="currentColor" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
                </linearGradient>
            </defs>

            <g transform="rotate(-15 150 150)" style={{ mixBlendMode: "multiply" }}>
                <path d="M 85,110
                         C 115,85 165,95 195,125
                         C 215,145 220,185 185,210
                         C 155,230 115,215 95,185
                         C 75,155 70,125 85,110 Z"
                      fill="url(#marker-fade)" />

                <path d="M 100,120
                         C 125,100 160,110 180,135
                         C 195,155 195,180 170,195
                         C 145,210 115,200 105,175
                         C 95,150 90,130 100,120 Z"
                      fill="currentColor" opacity="0.4" />

                <path d="M 88,125 C 115,105 160,115 185,145 C 200,165 198,185 175,195"
                      fill="none" stroke="#fcfcfc" strokeWidth="2.5" opacity="0.3" strokeLinecap="round" />

                <path d="M 108,145 C 130,130 165,135 180,160 C 190,175 182,190 165,195"
                      fill="none" stroke="#fcfcfc" strokeWidth="1.5" opacity="0.25" strokeLinecap="round" />

                <path d="M 80,135 C 75,120 85,105 100,100 C 105,115 102,135 90,145 Z"
                      fill="url(#marker-light-fade)" />

                <path d="M 175,185 C 195,180 215,170 225,150 C 220,145 205,155 185,165"
                      fill="url(#marker-light-fade)" />

                <path d="M 165,198 C 190,198 210,185 220,165 C 215,165 195,175 180,180"
                      fill="url(#marker-light-fade)" opacity="0.7" />
            </g>
        </svg>
    );
}