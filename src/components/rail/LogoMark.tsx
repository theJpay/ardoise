import ArdoiseLogo from "@assets/ardoise-logo.svg?react";

type LogoMarkProps = {
    size?: number;
};

function LogoMark({ size = 24 }: LogoMarkProps) {
    return <ArdoiseLogo width={size} height={size} className="text-accent" aria-hidden="true" />;
}

export default LogoMark;
