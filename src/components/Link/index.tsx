"use client"; // if you are planing to use it in the component which is not marker with use client directive this is a must

import classNames from "classnames";
import { usePathname } from "next/navigation";
import NextLink from "next/link";

import React from "react";

const Link = React.forwardRef(function Link(
  { href, className, ...rest }: any,
  ref: any
) {
  const pathName = usePathname();
  const isActive = pathName === href;

  return (
    <NextLink
      className={classNames(className, {
        active: isActive,
      })}
      ref={ref}
      href={href}
      {...rest}
    />
  );
});

export default Link;
