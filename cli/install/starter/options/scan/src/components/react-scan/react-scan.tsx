"use client";

import React, { JSX, useEffect } from "react";
import { scan } from "react-scan";

export function ReactScan(): JSX.Element {
  useEffect(() => {
    scan({
      enabled: true,
    });
  }, []);

  return <></>;
}
