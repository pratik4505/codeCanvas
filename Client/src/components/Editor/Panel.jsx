export const PanelSection = ({ title, children }) => {
  return (
    <div className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded">
      <h2 className="text-gray-800 font-semibold mb-2 text-sm">{title}</h2>
      <div>{children}</div>
    </div>
  );
};

  
  export const Panel = ({ className, children }) => {
    return (
      <div className={`p-4 bg-gray-100 shadow-md rounded ${className}`}>
        {children}
      </div>
    );
  };
  