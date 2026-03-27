import { Link } from "react-router";

type LogoMarkProps = {
    size?: number;
};

function LogoMark({ size = 22 }: LogoMarkProps) {
    return (
        <Link to="/">
            <svg
                width={size}
                height={size}
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path d="M40 7 L9 71" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                <path
                    d="M40 7 L71 71"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                />
                <path
                    d="M21 50 L59 43"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                />
            </svg>
        </Link>
    );
}

export default LogoMark;
