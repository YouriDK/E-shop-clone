import React from "react";
//  * Component de message en cas d'erreur ou autre
export default function MessageBox(props) {
  return (
    <div className={`alert alert-${props.variant || "info"}`}>
      {props.children}
    </div>
  );
}
