import { ComponentType, ElementType, ReactNode } from "react";

type ConditionallyWrapProps = {
  children: ReactNode;
  with:
    | ElementType<{
        className?: string;
      }>
    | ComponentType;
  when: boolean;
};

const ConditionallyWrap = ({
  children,
  with: Component,
  when,
  ...rest
}: ConditionallyWrapProps) =>
  when ? <Component {...rest}>{children}</Component> : children;

export default ConditionallyWrap;
