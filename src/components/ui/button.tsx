import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
};

const Button = ({ children, ...rest }: ButtonProps) => (
  <button {...rest}>{children}</button>
);

export default Button;
