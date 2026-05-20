"use client";

import React, { useRef, useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { StyleRegistry, createStyleRegistry } from "styled-jsx";
import { AppRegistry } from "react-native-web";
import { flush } from "@gluestack-ui/themed";

function Main({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function StyledJsxRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [jsxStyleRegistry] = useState(() => createStyleRegistry());
  const isServerInserted = useRef(false);

  useServerInsertedHTML(() => {
    AppRegistry.registerComponent("Main", () => Main);
    const { getStyleElement } = AppRegistry.getApplication("Main");
    if (!isServerInserted.current) {
      isServerInserted.current = true;
      const styles = [
        getStyleElement(),
        jsxStyleRegistry.styles(),
        ...flush(),
      ];
      jsxStyleRegistry.flush();
      return <>{styles}</>;
    }
  });

  return (
    <StyleRegistry registry={jsxStyleRegistry}>{children}</StyleRegistry>
  );
}
