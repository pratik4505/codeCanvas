import { Button } from "../Elements/Button";
import { Card } from "../Elements/Card";
import { Container } from "../Elements/Container";

import { renderToStaticMarkup } from "react-dom/server";

const components = {
  Container,
  Button,
  Card,
};

export default function ConvertToHtml(json) {
  const renderComponents = (node) => {
    if (!node) return "";

    const Component = components[node.type.resolvedName];

    if (!Component) return "";

    const componentProps = { ...node.props };

    const childrenHtml = node.nodes
      ? node.nodes
          .map((childNode) => renderComponents(json[childNode]))
          .join("")
      : "";

    if (childrenHtml) {
      componentProps.children = childrenHtml;
    }

    return renderToStaticMarkup(<Component {...componentProps} />);
  };

  return renderComponents(json.ROOT);
}
