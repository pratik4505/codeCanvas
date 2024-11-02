import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import ContentEditable from "react-contenteditable";

export const Footer = ({ brandName, copyrightText, fontSize, fontStyle }) => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
  } = useNode();

  return (
    <footer
      ref={(ref) => connect(drag(ref))}
      className="bg-white rounded-lg shadow dark:bg-gray-900 m-4"
      style={{ fontSize: `${fontSize}px`, fontFamily: fontStyle }}
    >
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="#"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Flowbite Logo"
            />
            <ContentEditable
              html={brandName}
              disabled={false}
              onChange={(e) =>
                setProp((props) => (props.brandName = e.target.value))
              }
              className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
            />
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            {["About", "Privacy Policy", "Licensing", "Contact"].map(
              (item, index) => (
                <li key={index} className="me-4 md:me-6">
                  <ContentEditable
                    html={item}
                    disabled={false}
                    onChange={(e) =>
                      setProp(
                        (props) =>
                          (props[`menuItem${index}`] = e.target.value)
                      )
                    }
                    className="hover:underline"
                  />
                </li>
              )
            )}
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <ContentEditable
          html={copyrightText}
          disabled={false}
          onChange={(e) =>
            setProp((props) => (props.copyrightText = e.target.value))
          }
          className="block text-sm text-gray-500 sm:text-center dark:text-gray-400"
        />
      </div>
    </footer>
  );
};

export const FooterSettings = () => {
  const {
    actions: { setProp },
    brandName,
    fontSize,
    fontStyle,
    copyrightText,
  } = useNode((node) => ({
    brandName: node.data.props.brandName,
    fontSize: node.data.props.fontSize,
    fontStyle: node.data.props.fontStyle,
    copyrightText: node.data.props.copyrightText,
  }));

  return (
    <div>
      <label>
        Font Size:
        <input
          type="number"
          value={fontSize}
          onChange={(e) =>
            setProp((props) => (props.fontSize = e.target.value))
          }
          min="12"
          max="48"
        />
      </label>
      <label>
        Font Style:
        <select
          value={fontStyle}
          onChange={(e) =>
            setProp((props) => (props.fontStyle = e.target.value))
          }
        >
          <option value="Arial">Arial</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Verdana">Verdana</option>
        </select>
      </label>
    </div>
  );
};

export const FooterDefaultProps = {
  brandName: "Flowbite",
  copyrightText: "© 2023 Flowbite™. All Rights Reserved.",
  fontSize: 16,
  fontStyle: "Arial",
};

Footer.craft = {
  props: FooterDefaultProps,
  related: {
    settings: FooterSettings,
  },
};
