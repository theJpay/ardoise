import ArdoiseLogo from "@assets/ardoise-logo.svg?react";

type LogoMarkProps = {
    size?: number;
};

function LogoMark({ size = 24 }: LogoMarkProps) {
    return <ArdoiseLogo aria-hidden="true" className="text-accent" height={size} width={size} />;
}

export default LogoMark;
