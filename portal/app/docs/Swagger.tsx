"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => <p style={{ padding: 16 }}>Loading API docs…</p>,
});

export default function Swagger() {
  return (
    <SwaggerUI
      url="/openapi.yaml"
      persistAuthorization={true}
      requestInterceptor={(req: any) => {
        // Debug: verify Authorization header is set for secured calls
        // eslint-disable-next-line no-console
        console.log("Swagger request:", req.method, req.url, req.headers?.Authorization);
        return req;
      }}
    />
  );
}
